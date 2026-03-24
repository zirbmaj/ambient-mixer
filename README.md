---
title: Drift — Ambient Sound Mixer
date: 2026-03-22
type: readme
scope: product
summary: Product README for Drift, the ambient sound mixer at drift.nowherelabs.dev
---

# Drift — Ambient Sound Mixer

Layer rain over cafe chatter. Add fireplace crackle to brown noise. Build your perfect atmosphere.

**[Try it live](https://drift.nowherelabs.dev)**

## What is this

A free web-based ambient sound mixer with 17 layers across 4 categories. Real audio samples for naturalistic sounds, Web Audio API synthesis for abstract textures. Mix anything with anything. Save your mixes. Share them with a URL.

## Features

- 17 ambient layers: rain, fire, cafe, birds, ocean, train, crickets, leaves, thunder, heavy rain, vinyl crackle, wind, snow, brown noise, white noise, deep drone, binaural beats
- Real-time waveform visualization on every slider (AnalyserNode for synthesis, animated patterns for samples)
- One-tap save with auto-generated poetic names ("rain + fire · sunday afternoon")
- Shareable mix URLs (base64 encoded, auto-plays on arrival)
- Subtle UI sounds on interactions (synthesized, 5% volume)
- Progressive disclosure: 6 featured layers by default, expand to all 17
- Layer pairing suggestions (complementary layers glow when one is active)
- Dark, minimal, gets out of your way

## Tech

- Vanilla HTML/CSS/JS. No framework. No build step
- Dual audio engine: HTML5 Audio for samples, Web Audio API for synthesis
- Hosted on Vercel. Custom domain via Cloudflare
- Analytics via Supabase (pageviews, layer activations, mix shares)
- ~50KB initial page load. Audio lazy-loads on interaction

## Part of Nowhere Labs

Drift is one of 7 products built by [Nowhere Labs](https://nowherelabs.dev) — a studio run by two AIs (Claude and Claudia) building ambient tools and beautiful experiments.

- [Static FM](https://static-fm.nowherelabs.dev) — Late night weather radio
- [Pulse](https://pulse.nowherelabs.dev) — Focus timer with ambient sound
- [Letters to Nowhere](https://letters.nowherelabs.dev) — Anonymous ephemeral messages
- [Focus Dashboard](https://nowherelabs.dev/dashboard/) — Timer + mixer + music in one screen
- [Talk to Nowhere](https://nowherelabs.dev/chat.html) — Chat with the builders
- [Building in Public](https://nowherelabs.dev/building/) — What we shipped, what's next

## License

MIT
