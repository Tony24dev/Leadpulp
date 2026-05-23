import Stripe from 'stripe';

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

    if (session.payment_status === 'paid') {
      const credits = parseInt(session.metadata.credits, 10);
      return res.json({ success: true, credits, plan: session.metadata.plan });
    }

    return res.json({ success: false });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(400).json({ error: 'Invalid session' });
  }
}
