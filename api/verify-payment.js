import Stripe from 'stripe';

const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;
const paidKey   = (sessionId) => `paid:${sessionId}`;

async function redisGet(key) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res   = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { result } = await res.json();
  return result;
}

async function redisSet(key, value, opts = {}) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const parts = [url, 'set', encodeURIComponent(key), encodeURIComponent(String(value))];
  if (opts.nx) parts.push('nx');
  if (opts.ex) parts.push('ex', opts.ex);
  const res = await fetch(parts.join('/'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const { result } = await res.json();
  return result;
}

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

    const credits = parseInt(session.metadata.credits, 10);
    const plan    = session.metadata.plan;
    const email   = session.metadata.email || session.customer_details?.email || '';

    let newBalance = null;
    if (email && email.includes('@')) {
      const locked = await redisSet(paidKey(session_id), '1', { nx: true, ex: 60 * 60 * 24 * 30 });
      if (locked === 'OK') {
        const current = Number(await redisGet(creditKey(email)) ?? 0);
        newBalance = current + credits;
        await redisSet(creditKey(email), newBalance);
      } else {
        newBalance = Number(await redisGet(creditKey(email)) ?? 0);
      }
    }

    return res.json({ success: true, credits, plan, balance: newBalance });
  } catch (err) {
    console.error('Verify payment error:', err);
    return res.status(400).json({ error: 'Invalid session' });
  }
}
