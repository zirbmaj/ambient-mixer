---
name: drift
description: Ambient sound mixer - 17 layers of real audio + synthesis
url: https://drift.nowherelabs.dev
repo: github.com/zirbmaj/ambient-mixer
type: static-site
hosting: vercel
---

## Build

No build step. Static site — HTML, CSS, vanilla JS.

```bash
# serve locally
cd ~/ambient-mixer && python3 -m http.server 8080
```

## Deploy

Push to `main` on GitHub. Vercel auto-deploys.

```bash
# manual deploy
cd ~/ambient-mixer && vercel deploy --prod
```

## Test

```bash
cd ~/static-workspace && node tests/all-products.mjs
```

Playwright suite covers all Nowhere Labs products including Drift.

## Key Files

| File | Purpose |
|------|---------|
| `engine.js` | Audio engine — 17 layers, Web Audio API synthesis + sample playback |
| `index.html` | Landing page (SEO, marketing, hero) |
| `app.html` | Main mixer app UI |
| `style.css` | All styles |
| `discover.html` | Community mixes / discover feed |
| `today.html` | Daily curated mix |
| `sleep.html` | Sleep-focused preset page |
| `vercel.json` | Routing and deploy config |
| `audio/normalized/` | Normalized MP3 samples (rain, fire, cafe, etc.) |
| `manifest.json` | PWA manifest |
| `sitemap.xml` | SEO sitemap |

### SEO Landing Pages

- `brown-noise-for-focus.html`
- `brown-noise-for-sleeping.html`
- `cafe-ambience-for-working.html`
- `fireplace-sounds.html`
- `rain-sounds-for-studying.html`
- `snow-sounds-for-sleeping.html`
- `thunderstorm-sounds.html`

## Layers

17 sound layers across categories:

- **Weather**: rain, heavy-rain, thunder, wind, snow
- **Nature**: fire, waves, crickets, birds, leaves
- **Ambient**: cafe, train, vinyl
- **Synthesis**: brown-noise, white-noise, drone, binaural

Each layer has a `type` of either `sample` (MP3 file) or `synth` (generated via Web Audio API). Some layers use both — sample for playback with synth fallback.

## Dependencies

- **Web Audio API** — all audio synthesis and playback (browser-native, no npm)
- **Supabase** — analytics events + discover feed (community mixes)
- **Spotify embed** — curated playlist on landing page
- **Google Fonts** — Inter + Space Mono

No npm. No bundler. No framework.

## Common Tasks

### Add a new layer

1. Add audio file to `audio/normalized/` (normalize loudness first)
2. Add layer object to the `LAYERS` array in `engine.js` with id, name, icon SVG, category, type, src, and create function
3. Test in app.html — verify volume slider, mute, and playback

### Publish a mix

Mixes are saved to Supabase via the discover feed. Users create mixes in app.html and publish to `discover.html`.

### Update landing page

Edit `index.html`. Hero section, feature grid, and CTA are all inline. SEO meta tags are in the `<head>`.

### Add an SEO landing page

1. Create new HTML file at repo root (e.g., `ocean-sounds-for-sleeping.html`)
2. Follow structure of existing landing pages (standalone, links to app.html)
3. Add to `sitemap.xml`
4. Add to `robots.txt` if needed
