// GET  /api/credits?email=xxx  → returns current balance
// POST /api/credits             → init email with 3 free credits (only on first visit)
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const FREE_CREDITS = 3;
const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const balance = await redis.get(creditKey(email));
    return res.json({ credits: balance ?? 0, exists: balance !== null });
  }

  if (req.method === 'POST') {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const existing = await redis.get(creditKey(email));
    if (existing !== null) {
      // Already registered — just return their balance
      return res.json({ credits: Number(existing), isNew: false });
    }

    // First time — give free credits
    await redis.set(creditKey(email), FREE_CREDITS);
    return res.json({ credits: FREE_CREDITS, isNew: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
