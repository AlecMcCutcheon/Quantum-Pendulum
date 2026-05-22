# Quantum Tarot

Single-card tarot readings powered by true quantum randomness from the [ETH Zurich QRNG](http://qrng.ethz.ch/), with procedurally generated SVG card art and a full 78-card deck.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Outshift API key (recommended)

1. Click the **gear icon** (bottom-right).
2. Paste your [Outshift QRNG](https://api.qrng.outshift.com/) API key (`x-id-api-key`).
3. Save — the key stays in **browser localStorage only** (not in the repo).

Optional dev shortcut: copy `.env.example` to `.env.local` and set `OUTSHIFT_QRNG_API_KEY=` (never commit this file).

### Quantum sources (no local crypto)

Pick one in Settings:

1. **Outshift** — requires API key
2. **qrandom.io** — no key

If the chosen source is down, the draw fails. The UI shows which source was used.

> **Security:** If you pasted an API key in chat or committed it anywhere, rotate it in the Outshift dashboard.

## Draw flow

1. Click **Collapse the Wave**.
2. The app requests quantum integers (and floats for art entropy) via the proxy.
3. Results pick: card index `0–77`, orientation (upright / reversed / sideways), and an art seed.
4. SVG card art is generated deterministically from the seed; the reading text is loaded from deck data.

See [docs/quantum-random-api.md](docs/quantum-random-api.md) for API details.

## Deck naming

| Classic | Quantum |
|---------|---------|
| Major Arcana | e.g. *The Fool* → **The Observer** |
| Wands | **Photons** |
| Cups | **Fluids** |
| Swords | **Operators** |
| Pentacles | **Lattice** |

Each card shows `quantumName` with `classicName` as subtitle so traditional mappings stay clear.

## GitHub Pages & quantum randomness

Live site: `https://alecmccutcheon.github.io/Quantum-Tarot/`

**qrandom.io does not allow browser CORS**, so the deployed app cannot call it directly from GitHub Pages. Use one of:

1. **Cloudflare Worker (recommended)** — `worker/` proxies Outshift and qrandom server-side with `Access-Control-Allow-Origin: *`.

   ```bash
   npx wrangler deploy --config worker/wrangler.toml
   ```

   In the GitHub repo: **Settings → Secrets and variables → Actions → Variables**, add `QRNG_PROXY_URL` = your worker URL (e.g. `https://quantum-tarot-qrng.<account>.workers.dev`, no trailing slash). Re-run the Pages deploy workflow so `VITE_QRNG_PROXY_URL` is baked into the build.

2. **CORS relay fallback** — If `QRNG_PROXY_URL` is unset, production tries public relays (`api.cors.lol`, `api.cors.syrins.tech`, then `proxy.corsfix.com`). Relays are third-party and may rate-limit. **Corsfix** only works from browser `fetch` (not pasted URLs) and requires registering your Pages host (`alecmccutcheon.github.io`) at [corsfix.com](https://corsfix.com).

   **Optional:** add GitHub secret `CLOUDFLARE_API_TOKEN` (+ `CLOUDFLARE_ACCOUNT_ID`). The Pages workflow will deploy `worker/` automatically and bake the worker URL into the build.

Local `npm run dev` still uses the Vite `/api/qrng` middleware in [vite-plugin-qrng.ts](vite-plugin-qrng.ts).

## Customizing card art

Each card’s **prominent glyphs** (cups, blades, photon rods, lattice coins, major arcana symbols, pip layouts) are driven by [`src/lib/cardArt/cardArtConfig.ts`](src/lib/cardArt/cardArtConfig.ts). Procedural patterns stay in the background at lower opacity.

Edit `CARD_ART_OVERRIDES` to tune any card by id (e.g. `cups-09` for Nine of Fluids / Nine of Cups):

```ts
"cups-09": {
  glyphScale: 1.2,
  backgroundOpacity: 0.3,
},
```

Glyph geometry lives under `src/lib/cardArt/glyphs/` (suit symbols, pip grids, major & court emblems).

## Project layout

- `src/api/qrng.ts` — QRNG client with retry
- `src/data/deck.ts` — 78 cards
- `src/data/readings/` — upright / reversed / sideways meanings
- `src/lib/cardArt/` — seeded SVG generator
- `src/pages/Home.tsx` — single-card UI

## Build

```bash
npm run build
npm run preview
```
