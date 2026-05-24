// Starts an Apify Google Maps scraper run and returns the run ID.
// The frontend polls /api/results?runId=... until the run finishes.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, location } = req.body;
  if (!query || !location) {
    return res.status(400).json({ error: 'Missing query or location' });
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
