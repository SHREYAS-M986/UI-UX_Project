import { fetchPageHtml } from '../src/lib/fetchPageUtil';

export const config = {
  runtime: 'nodejs',
  maxDuration: 15,
};

export default async function handler(req: any, res?: any) {
  // Support both Node HTTP handler and Web standard Fetch handler
  if (req instanceof Request) {
    const url = new URL(req.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response(JSON.stringify({ error: 'Missing "url" query parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const result = await fetchPageHtml(targetUrl);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Failed to fetch page' }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Node.js Express / Next.js / Vercel traditional serverless format
  const targetUrl = req.query?.url || req.body?.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing "url" parameter in query or body' });
  }

  try {
    const result = await fetchPageHtml(targetUrl);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(422).json({ error: err.message || 'Failed to fetch page' });
  }
}

