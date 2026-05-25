# Quantum Pendulum

3D pendulum divination powered by true QRNG (Outshift or qrandom.io): quantum integers steer anchor pulls; swing motion maps to swappable reading circles, with optional live mic entropy.

**Live:** [https://alecmccutcheon.github.io/Quantum-Pendulum/](https://alecmccutcheon.github.io/Quantum-Pendulum/)

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Outshift API key (recommended)

1. Click the **gear icon** (bottom-right).
2. Paste your [Outshift QRNG](https://api.qrng.outshift.com/) API key (`x-id-api-key`).
3. Save — the key stays in **browser localStorage only**.

Optional: copy `.env.example` to `.env.local` and set `OUTSHIFT_QRNG_API_KEY=` for local dev (never commit).

### Quantum sources

1. **Outshift** — requires API key
2. **qrandom.io** — no key

If the chosen source is down, measurement fails. The UI shows which source was used.

## Divination circles

Swap the disc under the pendulum for different readings — yes/no/maybe, elements, emotions, direction, and more can be added in `src/data/divinationCircles.ts`. Meaning comes from which sector the bob’s swing highlights, not from a fixed question format.

## GitHub Pages (static)

Set `GITHUB_PAGES=true` when building. The app uses CORS relays for qrandom.io in production (see `src/lib/qrngProviders.ts`). Local dev uses the Vite `/api/qrng` proxy in `vite-plugin-qrng.ts`.

Configure `base` in `vite.config.ts` to match your Pages path.

## Project layout

- `src/api/qrng.ts` — QRNG client
- `src/lib/quantumPendulum.ts` — batch fetch and impulse mapping
- `src/data/divinationCircles.ts` — swappable sector circles
- `docs/PENDULUM_PHYSICS_RESEARCH.md` — physics research and architecture notes
- `src/components/pendulum3d/` — Rapier + React Three Fiber simulation
- `src/pages/Home.tsx` — main UI

## Build

```bash
npm run build
npm run preview
```
