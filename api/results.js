// Checks an Apify run's status. Returns results when the run succeeds,
// deducts 1 credit (exactly once via claim lock), returns fresh balance.
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const creditKey  = (email) => `credits:${email.toLowerCase().trim()}`;
const claimKey   = (runId) => `claimed:${runId}`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { runId, email } = req.query;
  if (!runId) {
    return res.status(400).json({ error: 'Missing runId' });
  }

  const apiKey = process.env.APIFY_API_TOKEN;

  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!runRes.ok) {
      return res.status(500).json({ error: 'Failed to check run status' });
    }

    const runData = await runRes.json();
    const status = runData.data.status;

    if (['RUNNING', 'READY', 'ABORTING'].includes(status)) {
      return res.json({ status: 'pending' });
    }

    if (status !== 'SUCCEEDED') {
      return res.json({ status: 'error', message: `Run ended with status: ${status}` });
    }

    // Fetch dataset items
    const datasetId = runData.data.defaultDatasetId;
    const itemsRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?format=json&clean=true&limit=100`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const items = await itemsRes.json();
    const rows = Array.isArray(items) ? items : [];

    const results = rows
      .map(item => ({
        name:    item.title || item.name || '',
        phone:   item.phone || item.phoneUnformatted || '',
        email:   Array.isArray(item.emails) ? (item.emails[0] || '') : (item.email || ''),
        address: item.address || '',
        rating:  item.totalScore != null ? parseFloat(item.totalScore).toFixed(1) : '—',
        reviews: item.reviewsCount || item.reviews || 0,
        website: item.website || '',
      }))
      .filter(r => r.name);

    // Deduct 1 credit exactly once using a SET NX claim lock
    let credits = null;
    if (email && email.includes('@')) {
      const key   = creditKey(email);
      const claim = claimKey(runId);

      // SET NX returns 'OK' if key was set (first time), null if already exists
      const locked = await redis.set(claim, '1', { nx: true, ex: 60 * 60 * 24 * 7 }); // 7 day TTL

      if (locked === 'OK') {
        // We won the lock — deduct 1 credit
        const current = Number(await redis.get(key) ?? 0);
        const newBalance = Math.max(0, current - 1);
        await redis.set(key, newBalance);
        credits = newBalance;
      } else {
        // Already claimed — just return current balance
        credits = Number(await redis.get(key) ?? 0);
      }
    }

    return res.json({ status: 'success', results, credits });
  } catch (err) {
    console.error('Results error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
