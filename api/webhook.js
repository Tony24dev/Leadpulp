import Stripe from 'stripe';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;
const paidKey   = (sessionId) => `paid:${sessionId}`;

// Vercel doesn't parse the raw body automatically — we need the raw buffer
// to verify Stripe's webhook signature.
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.payment_status !== 'paid') {
      return res.json({ received: true });
    }

    const plan      = session.metadata?.plan     || 'unknown';
    const credits   = session.metadata?.credits  || '?';
    const amount    = (session.amount_total / 100).toFixed(2);
    const currency  = (session.currency || 'usd').toUpperCase();
    const customer  = session.metadata?.email || session.customer_details?.email || 'unknown';

    // Add credits to Redis (idempotent — same lock key as verify-payment)
    if (customer !== 'unknown' && customer.includes('@')) {
      const claim = paidKey(session.id);
      const locked = await redis.set(claim, '1', { nx: true, ex: 60 * 60 * 24 * 30 });
      if (locked === 'OK') {
        const current = Number(await redis.get(creditKey(customer)) ?? 0);
        await redis.set(creditKey(customer), current + parseInt(credits, 10));
        console.log(`Credits added: ${credits} → ${customer}`);
      } else {
        console.log(`Credits already applied for session ${session.id}`);
      }
    }
    const date      = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'medium', timeStyle: 'short' });

    const planLabel = { starter: 'Starter', growth: 'Growth', agency: 'Agency' }[plan] || plan;

    try {
      await resend.emails.send({
        from: 'LeadPulp <notifications@leadpulp.com>',
        to: [process.env.NOTIFICATION_EMAIL],
        subject: `💰 New sale — ${planLabel} ($${amount})`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #0a0a0a; color: #f5f5f5; border-radius: 12px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px;">
              <div style="width: 36px; height: 36px; background: #FF6B00; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; font-size: 14px;">LP</div>
              <span style="font-weight: 700; font-size: 20px;">Lead<span style="color: #FF6B00;">Pulp</span></span>
            </div>

            <h1 style="font-size: 24px; margin: 0 0 6px; font-weight: 800;">New sale! 🎉</h1>
            <p style="color: #888; margin: 0 0 28px; font-size: 14px;">${date} EST</p>

            <div style="background: #141414; border: 1px solid #2a2a2a; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #888; font-size: 13px;">Plan</span>
                <span style="font-weight: 600; font-size: 13px;">${planLabel}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #888; font-size: 13px;">Credits</span>
                <span style="font-weight: 600; font-size: 13px; color: #FF6B00;">${parseInt(credits).toLocaleString()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #888; font-size: 13px;">Amount</span>
                <span style="font-weight: 700; font-size: 16px; color: #22c55e;">$${amount} ${currency}</span>
              </div>
              <div style="border-top: 1px solid #2a2a2a; margin: 12px 0;"></div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #888; font-size: 13px;">Customer</span>
                <span style="font-size: 13px;">${customer}</span>
              </div>
            </div>

            <p style="color: #555; font-size: 12px; text-align: center; margin: 0;">
              LeadPulp · leadpulp.com
            </p>
          </div>
        `,
      });

      console.log(`Sale notification sent for ${planLabel} — $${amount}`);
    } catch (emailErr) {
      console.error('Failed to send sale notification:', emailErr);
      // Don't fail the webhook — Stripe will retry if we return an error
    }
  }

  return res.json({ received: true });
}
