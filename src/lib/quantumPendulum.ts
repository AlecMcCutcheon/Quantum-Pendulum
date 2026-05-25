import { WORLD } from "../components/pendulum3d/constants";
import { getLastQrngSource, randint, type QrngSource } from "../api/qrng";
import type {
  PendulumImpulse,
  QuantumBatchMeta,
  QuantumStream,
} from "../types/pendulum";

export const QUANTUM_BATCH_SIZE = 48;

/**
 * angle°, radius√, strength, blend ms, interval — each pick is a point in the disk.
 */
export const IMPULSE_FIELDS = 5;

/** Fetch the next batch only when this many ints remain in the *current* batch (~2 impulses). */
export const PREFETCH_THRESHOLD = IMPULSE_FIELDS * 2;

export const IMPULSE_LIMITS = {
  minApproach: 0.52,
  maxApproach: 0.95,
  minBlendMs: 300,
  maxBlendMs: 1750,
  /** QRNG ms until next anchor pull — wider span = more variation in pacing. */
  minIntervalMs: 280,
  maxIntervalMs: 3000,
} as const;

function unit(n: number): number {
  return (Math.abs(n) % 1_000_000) / 1_000_000;
}

/** Uniform angle fraction in [0, 1) from two independent unit uniforms. */
export function uniformAngleUnit(u1: number, u2: number): number {
  const theta = Math.atan2(u1 - 0.5, u2 - 0.5);
  const t = theta / (Math.PI * 2) + 0.5;
  return t >= 1 ? t - 1 : t < 0 ? t + 1 : t;
}

function lerp(min: number, max: number, t: number): number {
  return min + (max - min) * t;
}

/** Uniform random point in a disk (sqrt on radius avoids center clustering). */
export function diskPointFromUnits(
  uAngle: number,
  uRadius: number,
  maxRadius: number,
): { x: number; z: number; angleRad: number } {
  const angleRad = uniformAngleUnit(uAngle, uRadius) * Math.PI * 2;
  const radius = Math.sqrt(uRadius) * maxRadius;
  return {
    x: Math.sin(angleRad) * radius,
    z: Math.cos(angleRad) * radius,
    angleRad,
  };
}

export function createEmptyStream(): QuantumStream {
  return {
    pool: [],
    cursor: 0,
    poolBaseIndex: 0,
    batches: [],
    prefetchState: "idle",
  };
}

/** Drop consumed integers from memory; ledger pool indices stay absolute via poolBaseIndex. */
export function trimConsumedFromStream(stream: QuantumStream): QuantumStream {
  if (stream.cursor <= 0) return stream;

  const trim = stream.cursor;
  const newPool = stream.pool.slice(trim);
  const newBatches = stream.batches
    .filter((b) => b.offset + b.length > trim)
    .map((b) => ({
      ...b,
      offset: b.offset - trim,
    }));

  return {
    ...stream,
    pool: newPool,
    cursor: 0,
    poolBaseIndex: stream.poolBaseIndex + trim,
    batches: newBatches,
  };
}

export function streamRemaining(stream: QuantumStream): number {
  return Math.max(0, stream.pool.length - stream.cursor);
}

/** Batch that contains the next integer to consume. */
export function activeBatchIndex(stream: QuantumStream): number {
  for (let i = stream.batches.length - 1; i >= 0; i--) {
    if (stream.cursor >= stream.batches[i]!.offset) return i;
  }
  return 0;
}

export function remainingInActiveBatch(stream: QuantumStream): number {
  const batch = stream.batches[activeBatchIndex(stream)];
  if (!batch) return streamRemaining(stream);
  return Math.max(0, batch.offset + batch.length - stream.cursor);
}

/** True when a full next batch is already appended and waiting. */
export function hasLookaheadBatch(stream: QuantumStream): boolean {
  const batch = stream.batches[activeBatchIndex(stream)];
  if (!batch) return false;
  return stream.pool.length > batch.offset + batch.length;
}

export function shouldPrefetch(stream: QuantumStream): boolean {
  return (
    stream.prefetchState === "idle" &&
    stream.batches.length > 0 &&
    streamRemaining(stream) >= IMPULSE_FIELDS &&
    !hasLookaheadBatch(stream) &&
    remainingInActiveBatch(stream) <= PREFETCH_THRESHOLD
  );
}

export async function fetchQuantumBatch(
  size = QUANTUM_BATCH_SIZE,
): Promise<{
  drawId: string;
  pool: number[];
  source: QrngSource;
  drawnAt: number;
} | null> {
  const batch = await randint({
    min: 0,
    max: 2_147_483_646,
    size,
  });

  if (!batch?.length) return null;

  return {
    drawId: crypto.randomUUID(),
    pool: [...batch],
    source: getLastQrngSource(),
    drawnAt: Date.now(),
  };
}

export function appendBatchToStream(
  stream: QuantumStream,
  batch: {
    drawId: string;
    pool: number[];
    source: QrngSource;
    drawnAt: number;
  },
): QuantumStream {
  const offset = stream.pool.length;
  const meta: QuantumBatchMeta = {
    drawId: batch.drawId,
    offset,
    length: batch.pool.length,
    drawnAt: batch.drawnAt,
    source: batch.source,
  };

  return {
    pool: [...stream.pool, ...batch.pool],
    cursor: stream.cursor,
    poolBaseIndex: stream.poolBaseIndex,
    batches: [...stream.batches, meta],
    prefetchState: "idle",
  };
}

export function takeFromStream(
  stream: QuantumStream,
  count: number,
  mix?: (qrng: number) => number,
): { values: number[]; stream: QuantumStream } | null {
  const remaining = streamRemaining(stream);
  if (remaining < count) return null;

  const raw = stream.pool.slice(stream.cursor, stream.cursor + count);
  const values = mix ? raw.map(mix) : raw;
  return {
    values,
    stream: { ...stream, cursor: stream.cursor + count },
  };
}

export function impulseFromValues(values: number[]): PendulumImpulse {
  const [angleRaw, radiusRaw, strRaw, blendRaw, intervalRaw] = values;
  const uA = unit(angleRaw ?? 0);
  const uR = unit(radiusRaw ?? 0);
  const { x, z } = diskPointFromUnits(uA, uR, WORLD.anchorMaxRadius);

  const approachStrength = lerp(
    IMPULSE_LIMITS.minApproach,
    IMPULSE_LIMITS.maxApproach,
    unit(strRaw ?? 0),
  );
  const blendMs = Math.round(
    lerp(
      IMPULSE_LIMITS.minBlendMs,
      IMPULSE_LIMITS.maxBlendMs,
      unit(blendRaw ?? 0),
    ),
  );
  const intervalMs = Math.round(
    lerp(
      IMPULSE_LIMITS.minIntervalMs,
      IMPULSE_LIMITS.maxIntervalMs,
      unit(intervalRaw ?? 0),
    ),
  );

  return {
    targetX: x,
    targetZ: z,
    approachStrength,
    blendMs,
    intervalMs,
  };
}

export function nextImpulseFromStream(
  stream: QuantumStream,
  mix?: (qrng: number) => number,
): {
  impulse: PendulumImpulse;
  stream: QuantumStream;
  raw: number[];
  mixed: number[];
} | null {
  const taken = takeFromStream(stream, IMPULSE_FIELDS, mix);
  if (!taken) return null;
  const start = stream.cursor;
  const raw = stream.pool.slice(start, start + IMPULSE_FIELDS);
  return {
    impulse: impulseFromValues(taken.values),
    stream: taken.stream,
    raw,
    mixed: taken.values,
  };
}

export function impulseFieldRole(index: number): string {
  const slot = index % IMPULSE_FIELDS;
  if (slot === 0) return "disk angle (0–360°)";
  if (slot === 1) return "disk radius (√ uniform)";
  if (slot === 2) return "approach strength";
  if (slot === 3) return "blend duration";
  return "next interval";
}

export function formatStreamRoles(length: number): string[] {
  return Array.from({ length }, (_, i) => impulseFieldRole(i));
}

export function sessionSourceLabel(source: QrngSource): string {
  if (source === "outshift") return "Outshift QRNG";
  if (source === "qrandom") return "qrandom.io";
  return "Unknown";
}
