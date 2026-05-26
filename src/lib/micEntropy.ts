import { WORLD } from "../components/pendulum3d/constants";
import type {
  ConsumedQuantumRecord,
  QuantumConsumptionLedger,
} from "../types/quantumLedger";
import {
  IMPULSE_FIELDS,
  impulseFieldRole,
  impulseFromValues,
} from "./quantumPendulum";

/** Mix one QRNG integer with a live mic byte — XOR-style, bias preserved. */
export function mixWithMicEntropy(qrng: number, micByte: number): number {
  const q = Math.abs(Math.trunc(qrng)) >>> 0;
  const m = micByte & 0xff;
  return (q ^ Math.imul(m, 0x9e3779b1)) >>> 0;
}

/**
 * 0–100 Hamming weight of (QRNG ⊕ mixed) / 32.
 * For XOR with a scrambled mic mask this clusters near **50%** — that is healthy
 * full-word mixing, not bias. Do not use as “how loud the mic is”.
 */
export function integerXorSpreadPercent(qrng: number, mixed: number): number {
  const q = Math.abs(Math.trunc(qrng)) >>> 0;
  const m = Math.abs(Math.trunc(mixed)) >>> 0;
  if (q === m) return 0;
  let xor = q ^ m;
  let bits = 0;
  for (let i = 0; i < 32; i++) {
    bits += xor & 1;
    xor >>>= 1;
  }
  return Math.round((bits / 32) * 100);
}

/** @deprecated Use integerXorSpreadPercent — name kept for ledger field clarity */
export const integerPhaseShiftScore = integerXorSpreadPercent;

/** 0–100 how far mic samples deviate from silence (128) this impulse. */
export function micActivityPercent(micBytes: number[]): number {
  const used = micBytes.filter((b): b is number => b !== null);
  if (used.length === 0) return 0;
  const meanDev =
    used.reduce((sum, b) => sum + Math.abs(b - 128), 0) / used.length;
  return Math.min(100, Math.round((meanDev / 128) * 100));
}

/**
 * 0–100 Tarot-style: how far the anchor impulse moved vs mapping the same
 * five QRNG integers directly (angle + position in the disk).
 */
export function impulsePhaseShiftScore(
  rawValues: number[],
  mixedValues: number[],
): number {
  if (rawValues.length !== mixedValues.length) return 0;
  const direct = impulseFromValues(rawValues);
  const shifted = impulseFromValues(mixedValues);
  const maxR = WORLD.anchorMaxRadius;
  const maxDiameter = maxR * 2;

  const dist = Math.hypot(
    direct.targetX - shifted.targetX,
    direct.targetZ - shifted.targetZ,
  );
  const positionPct = Math.min(100, (dist / maxDiameter) * 100);

  const angleDirect = Math.atan2(direct.targetX, direct.targetZ);
  const angleShifted = Math.atan2(shifted.targetX, shifted.targetZ);
  let angleDelta = Math.abs(angleDirect - angleShifted);
  if (angleDelta > Math.PI) angleDelta = 2 * Math.PI - angleDelta;
  const anglePct = (angleDelta / Math.PI) * 100;

  const approachPct =
    Math.abs(direct.approachStrength - shifted.approachStrength) * 100;

  return Math.min(
    100,
    Math.round(positionPct * 0.5 + anglePct * 0.35 + approachPct * 0.15),
  );
}

/** In-memory log tail — older rows are dropped to limit browser memory. */
export const LEDGER_RECORDS_MAX = 100;

function appendLedgerRecords(
  ledger: QuantumConsumptionLedger,
  newRecords: ConsumedQuantumRecord[],
): ConsumedQuantumRecord[] {
  const combined = [...ledger.records, ...newRecords];
  return combined.length > LEDGER_RECORDS_MAX
    ? combined.slice(-LEDGER_RECORDS_MAX)
    : combined;
}

export function createEmptyLedger(): QuantumConsumptionLedger {
  return {
    records: [],
    integersConsumed: 0,
    impulsesConsumed: 0,
    avgXorSpread: 0,
    avgImpulsePhaseShift: 0,
    avgMicActivity: 0,
    lastImpulsePhaseShift: 0,
    lastMicActivity: 0,
    lastXorSpread: 0,
    impulsePhaseHistory: [],
    micActivityHistory: [],
  };
}

export function appendLedgerImpulse(
  ledger: QuantumConsumptionLedger,
  poolStartIndex: number,
  raw: number[],
  mixed: number[],
  micBytes: (number | null)[],
): QuantumConsumptionLedger {
  const impulseIndex = ledger.impulsesConsumed;
  const at = Date.now();
  const micActive = micBytes.some((b) => b !== null);

  const newRecords = raw.map((qrng, i) => {
    const m = mixed[i]!;
    const micByte = micBytes[i] ?? null;
    const xorSpread =
      micByte === null ? 0 : integerXorSpreadPercent(qrng, m);
    const fieldIndex = i % IMPULSE_FIELDS;
    return {
      poolIndex: poolStartIndex + i,
      impulseIndex,
      fieldIndex,
      label: `impulse #${impulseIndex + 1} · ${impulseFieldRole(fieldIndex)}`,
      qrng,
      mixed: m,
      micByte,
      xorSpread,
      at,
    };
  });

  const records = appendLedgerRecords(ledger, newRecords);
  const xorSamples = records.map((r) => r.xorSpread).filter((s) => s > 0);
  const avgXorSpread =
    xorSamples.length > 0
      ? Math.round(xorSamples.reduce((a, b) => a + b, 0) / xorSamples.length)
      : 0;

  const lastXorSpread = micActive
    ? Math.round(
        newRecords.reduce((a, r) => a + r.xorSpread, 0) / newRecords.length,
      )
    : 0;

  const lastMicActivity = micActivityPercent(
    micBytes.filter((b): b is number => b !== null),
  );
  const lastImpulsePhaseShift = micActive
    ? impulsePhaseShiftScore(raw, mixed)
    : 0;

  const impulseSamples = [...ledger.impulsePhaseHistory, lastImpulsePhaseShift].filter(
    (s) => s > 0,
  );
  const micSamples = [...ledger.micActivityHistory, lastMicActivity].filter(
    (s) => s > 0,
  );

  return {
    records,
    integersConsumed: ledger.integersConsumed + newRecords.length,
    impulsesConsumed: ledger.impulsesConsumed + 1,
    avgXorSpread,
    avgImpulsePhaseShift:
      impulseSamples.length > 0
        ? Math.round(
            impulseSamples.reduce((a, b) => a + b, 0) / impulseSamples.length,
          )
        : 0,
    avgMicActivity:
      micSamples.length > 0
        ? Math.round(micSamples.reduce((a, b) => a + b, 0) / micSamples.length)
        : 0,
    lastImpulsePhaseShift,
    lastMicActivity,
    lastXorSpread,
    impulsePhaseHistory: impulseSamples.slice(-24),
    micActivityHistory: micSamples.slice(-24),
  };
}

/** Non-impulse draws (circle shift, etc.) — same FIFO pool as impulses. */
export function appendLedgerPoolSlots(
  ledger: QuantumConsumptionLedger,
  poolStartIndex: number,
  raw: number[],
  mixed: number[],
  labels: string[],
  micBytes: (number | null)[] = [],
): QuantumConsumptionLedger {
  const at = Date.now();
  const newRecords = raw.map((qrng, i) => {
    const m = mixed[i]!;
    const micByte = micBytes[i] ?? null;
    const xorSpread =
      micByte === null ? 0 : integerXorSpreadPercent(qrng, m);
    return {
      poolIndex: poolStartIndex + i,
      impulseIndex: -1,
      fieldIndex: i,
      label: labels[i] ?? labels[0] ?? "pool",
      qrng,
      mixed: m,
      micByte,
      xorSpread,
      at,
    };
  });
  return {
    ...ledger,
    records: appendLedgerRecords(ledger, newRecords),
    integersConsumed: ledger.integersConsumed + newRecords.length,
  };
}
