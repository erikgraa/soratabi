# Soratabi 空旅

<img src="icon.svg" width="96" align="right" alt="Soratabi icon" />

*Sora* (空, sky) + *tabi* (旅, journey): see your flight on a cute cartoon globe → **https://soratabi.graa.dev**

## Features

- ✈️ **Flight numbers or airports**: `SK903`, `KL1144 KL835`, `OSL-AMS-SFO` or a mix like `TRD OSL SK903`
- 🌍 **Cartoon globe** with animated route arcs, distances and estimated flight time
- 🗺️ **Flatten the earth**: morphs the globe into a zoomable flat map
- 📡 **What's flying around me?**: live aircraft within 150 km of you (or of a typed airport code); tap one to see its route
- ▴ **Minimizable panel**; the route is kept in the URL hash so links are shareable

## Data sources

| Source | Used for | Key |
|---|---|---|
| [OpenFlights](https://openflights.org/data) | Airports | – |
| [adsbdb](https://www.adsbdb.com) (open source) | Flight number → route | – |
| [AirLabs](https://airlabs.co) | Live position/status, *around me* | Optional, free tier |
| [adsb.lol](https://adsb.lol) (open data, ODbL) | *Around me* | – (needs the CORS proxy below) |

API keys and the proxy URL are entered under **⚙️ Data sources** and stored only in your browser (`localStorage`).

### ADS-B CORS proxy (optional)

adsb.lol doesn't send CORS headers, so browsers need a tiny proxy. Deploy the included Cloudflare Worker:

```sh
cd proxy
npx wrangler deploy
```

Then paste the worker URL into **⚙️ Data sources**, or set `DEFAULT_ADSB_PROXY` in `index.html` to enable it for everyone.

## Development

It's a single static `index.html` (globe.gl + d3 from CDN), so there's no build step. Open it in a browser or serve the folder.
Pushing to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
