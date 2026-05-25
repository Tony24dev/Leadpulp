import Stripe from 'stripe';
import { redis } from './_redis.js';

const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;
const paidKey   = (sessionId) => `paid:${sessionId}`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_id } = req.query;
  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.json({ success: false });
    }

    const credits     = parseInt(session.metadata.credits, 10);
    const plan        = session.metadata.plan;
    const email       = session.metadata.email || session.customer_details?.email || '';

    // Add credits exactly once using a claim lock
    let newBalance = null;
    if (email && email.includes('@')) {
      const claim = paidKey(session_id);

      // SET NX returns 'OK' only on first call — prevents double credit
      const locked = await redis.set(claim, '1', { nx: true, ex: 60 * 60 * 24 * 30 }); // 30 day TTL

      if (locked === 'OK') {
        const current = Number(await redis.get(creditKey(email)) ?? 0);
        newBalance = current + credits;
        await redis.set(creditKey(email), newBalance);
      } else {
        newBalance = Number(await redis.get(creditKey(email)) ?? 0);
      }
    }

    return res.json({ success: true, credits, plan, balance: newBalance });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(400).json({ error: 'Invalid session' });
  }
}
