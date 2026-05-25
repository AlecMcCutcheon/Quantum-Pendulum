# Quantum Random API (Pendulum app)

The app uses **Outshift** or **qrandom.io** only — no local pseudo-random fallback for measurements.

## Client API (`src/api/qrng.ts`)

| Function | Purpose |
|----------|---------|
| `randint({ min, max, size })` | Integer batch (pendulum pool) |
| `rand({ size })` | Unit floats (optional) |
| `testQrngConnection()` | Settings connectivity test |

Dev: Vite middleware `POST /api/qrng/randint` via `vite-plugin-qrng.ts`.  
Production static hosting: direct provider calls with CORS relays for qrandom.io (`src/lib/qrngProviders.ts`).

## Outshift

```
POST https://api.qrng.outshift.com/api/v1/random_numbers
Header: x-id-api-key
Body: { encoding, format, bits_per_block, number_of_blocks }
```

`random_numbers[].decimal` is mapped into `result: number[]`.

## qrandom.io

```
GET https://qrandom.io/api/random/ints?min=&max=&n=
```

## Pendulum batch

Default `QUANTUM_BATCH_SIZE = 48` in `src/lib/quantumPendulum.ts`. Each impulse consumes four integers (anchor Δx, anchor Δy, ω kick, interval ms).

## Retry

Up to 5 attempts, 1s delay (`src/api/qrng.ts`).
