import type { QrngSource } from "../api/qrng";

export interface DivinationSector {
  label: string;
}

/** Five sectors on fixed axes: N–S, E–W, TR↔BL, TL↔BR, center */
export type SwingCircleSectors = [
  DivinationSector,
  DivinationSector,
  DivinationSector,
  DivinationSector,
  DivinationSector,
];

export interface DivinationCircle {
  id: string;
  name: string;
  description: string;
  sectors: SwingCircleSectors;
}

/** Quantum picks a random point in the anchor disk; pivot eases there smoothly. */
export interface PendulumImpulse {
  /** Target on anchor plane (world x / z), uniform in disk */
  targetX: number;
  targetZ: number;
  /** How strongly to move toward target (0–1) */
  approachStrength: number;
  /** Ms to blend toward this target */
  blendMs: number;
  intervalMs: number;
}

/** One quantum draw applied to the anchor (mic-mixed + optional pure QRNG twin). */
export interface ConsumedImpulse {
  impulse: PendulumImpulse;
  /** Pure QRNG target when microphone mixing is active. */
  directImpulse?: PendulumImpulse;
}

export interface QuantumBatchMeta {
  drawId: string;
  offset: number;
  length: number;
  drawnAt: number;
  source: QrngSource;
}

export interface QuantumStream {
  pool: number[];
  cursor: number;
  /** Absolute index of pool[0] — preserved when consumed prefix is trimmed. */
  poolBaseIndex: number;
  batches: QuantumBatchMeta[];
  prefetchState: "idle" | "loading";
}

/** @deprecated Use QuantumStream */
export interface QuantumPendulumSession {
  drawId: string;
  pool: number[];
  poolIndex: number;
  source: QrngSource;
  drawnAt: number;
}
