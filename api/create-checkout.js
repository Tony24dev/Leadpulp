import Stripe from 'stripe';

const PLANS = {
  starter: { credits: 500 },
  growth:  { credits: 2000 },
  agency:  { credits: 5000 },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, email } = req.body;

  if (!PLANS[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const priceId = process.env[`STRIPE_PRICE_${plan.toUpperCase()}`];
  if (!priceId) {
    return res.status(500).json({ error: `Stripe price for "${plan}" not configured` });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        credits: String(PLANS[plan].credits),
        plan,
        email: email || '',
      },
    };

    // Pre-fill customer email if provided
    if (email && email.includes('@')) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
