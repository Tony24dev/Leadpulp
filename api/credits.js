// GET  /api/credits?email=xxx  → returns current balance
// POST /api/credits             → init email with 3 free credits (only on first visit)

const FREE_CREDITS = 3;
const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;

async function redisGet(key) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis env vars not set');
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (json.error) throw new Error(`Redis error: ${json.error}`);
  return json.result; // string | null
}

async function redisSet(key, value) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Redis env vars not set');
  const res = await fetch(
    `${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(String(value))}`,
    { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
  );
  const json = await res.json();
  if (json.error) throw new Error(`Redis error: ${json.error}`);
  return json.result;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { email } = req.query;
      if (!email) return res.status(400).json({ error: 'Missing email' });

      const balance = await redisGet(creditKey(email));
      return res.json({ credits: balance !== null ? Number(balance) : 0, exists: balance !== null });
    }

    if (req.method === 'POST') {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      const existing = await redisGet(creditKey(email));
      if (existing !== null) {
        return res.json({ credits: Number(existing), isNew: false });
      }

      await redisSet(creditKey(email), FREE_CREDITS);
      return res.json({ credits: FREE_CREDITS, isNew: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Credits error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
