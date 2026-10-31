// Cloudflare Worker: tiny CORS proxy for the open adsb.lol API, used by Soratabi's "What's flying around me?".
// Only GET /v2/point/{lat}/{lon}/{radius_nm} is forwarded. Deploy with `npx wrangler deploy` (see README).
const ALLOWED_ORIGINS = ['https://soratabi.graa.dev'];

export default {
  async fetch(req) {
    const origin = req.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    const cors = { 'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0], Vary: 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: { ...cors, 'Access-Control-Allow-Methods': 'GET' } });

    const { pathname } = new URL(req.url);
    const m = pathname.match(/^\/v2\/point\/(-?\d{1,2}(?:\.\d+)?)\/(-?\d{1,3}(?:\.\d+)?)\/(\d{1,3})$/);
    if (req.method !== 'GET' || !m || +m[3] > 250) return new Response('Not found', { status: 404, headers: cors });

    const upstream = await fetch(`https://api.adsb.lol${pathname}`, {
      headers: { 'User-Agent': 'soratabi (+https://soratabi.graa.dev)' },
      cf: { cacheTtl: 5, cacheEverything: true },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=5' },
    });
  },
};
