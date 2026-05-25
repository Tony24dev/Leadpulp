// Checks server-side credits, then starts an Apify run.

const creditKey = (email) => `credits:${email.toLowerCase().trim()}`;

async function redisGet(key) {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const res   = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { result } = await res.json();
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, location, email } = req.body;
  if (!query || !location) {
    return res.status(400).json({ error: 'Missing query or location' });
  }
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Missing email' });
  }

  // Check server-side credits
  const balance = await redisGet(creditKey(email));
  if (balance === null || Number(balance) <= 0) {
    return res.status(402).json({ error: 'No credits remaining', credits: 0 });
  }

  const apiKey = process.env.APIFY_API_TOKEN;
  if (!apiKey) {
    return res.status(500).json({ error: 'Apify not configured' });
  }

  try {
    const response = await fetch(
      'https://api.apify.com/v2/acts/compass~crawler-google-places/runs',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          searchStringsArray: [query],
          locationQuery: location,
          maxCrawledPlacesPerSearch: 50,
          language: 'en',
          exportPlaceUrls: false,
          includeHistogram: false,
          includeOpeningHours: false,
          includePeopleAlsoSearch: false,
          additionalInfo: false,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Apify error:', response.status, text);
      return res.status(500).json({ error: 'Failed to start scraping job' });
    }

    const data = await response.json();
    return res.json({ runId: data.data.id });
  } catch (err) {
    console.error('Scrape start error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
