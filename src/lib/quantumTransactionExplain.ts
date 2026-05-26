import type { ConsumedQuantumRecord } from "../types/quantumLedger";
import type { QuantumConsumptionLedger } from "../types/quantumLedger";
import type { QuantumStream } from "../types/pendulum";
import {
  formatStreamRoles,
  hasLookaheadBatch,
  impulseFieldRole,
  remainingInActiveBatch,
  sessionSourceLabel,
  streamRemaining,
} from "./quantumPendulum";

export function formatQuantumRaw(
  raw: number[],
  roles?: string[],
): string {
  return raw
    .map((n, i) => {
      const role = roles?.[i];
      return role ? `[${i}] ${n}  · ${role}` : `[${i}] ${n}`;
    })
    .join("\n");
}

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatConsumedRow(r: ConsumedQuantumRecord): string {
  const role =
    r.label ??
    (r.impulseIndex >= 0
      ? `impulse #${r.impulseIndex + 1} · ${impulseFieldRole(r.fieldIndex)}`
      : impulseFieldRole(r.fieldIndex));
  const mic =
    r.micByte === null ? "—" : `0x${r.micByte.toString(16).padStart(2, "0")}`;
  const spread =
    r.micByte === null ? "—" : `xor ${r.xorSpread}%`;
  return (
    `[${r.poolIndex}] QRNG ${r.qrng} → used ${r.mixed} · mic ${mic} · ${spread}\n` +
    `     ${role}`
  );
}

export function buildStreamReport(
  stream: QuantumStream,
  ledger: QuantumConsumptionLedger,
): {
  batchCount: number;
  sessionFetchedTotal: number;
  bufferedNow: number;
  queued: number;
  queuedImpulses: number;
  consumedCount: number;
  impulsesConsumed: number;
  batchesSummary: string;
  consumedFormatted: string;
  poolAheadFormatted: string;
  avgXorSpread: number;
  avgImpulsePhaseShift: number;
  avgMicActivity: number;
  lastImpulsePhaseShift: number;
  lastMicActivity: number;
  lastXorSpread: number;
} {
  const batchesSummary = stream.batches
    .map(
      (b, i) =>
        `#${i + 1} ${b.drawId.slice(0, 8)}… · ${sessionSourceLabel(b.source)} · ${formatTimestamp(b.drawnAt)} · ${b.length} ints @${b.offset}`,
    )
    .join("\n");

  const consumedFormatted =
    ledger.records.length > 0
      ? ledger.records.map(formatConsumedRow).join("\n\n")
      : "(none yet — impulses appear here as they are consumed)";

  const inCurrentBatch = remainingInActiveBatch(stream);
  const lookahead = hasLookaheadBatch(stream);
  const previewCount = Math.min(inCurrentBatch, 10);
  const ahead = stream.pool.slice(
    stream.cursor,
    stream.cursor + previewCount,
  );
  const poolAheadFormatted =
    ahead.length > 0
      ? `Next in current batch (raw QRNG — mic mixes only at consumption):\n${formatQuantumRaw(
          ahead,
          formatStreamRoles(ahead.length),
        )}${
          inCurrentBatch > previewCount
            ? `\n… +${inCurrentBatch - previewCount} more in this batch`
            : ""
        }${
          lookahead
            ? `\n\nNext batch already prefetched (${streamRemaining(stream) - inCurrentBatch} ints) — held until this batch ends.`
            : ""
        }`
      : "(pool empty ahead of cursor)";

  const queued = streamRemaining(stream);
  const sessionFetchedTotal = stream.poolBaseIndex + stream.pool.length;

  return {
    batchCount: stream.batches.length,
    sessionFetchedTotal,
    bufferedNow: stream.pool.length,
    queued,
    queuedImpulses: Math.floor(queued / 5),
    consumedCount: ledger.records.length,
    impulsesConsumed: ledger.impulsesConsumed,
    batchesSummary: batchesSummary || "(none)",
    consumedFormatted,
    poolAheadFormatted,
    avgXorSpread: ledger.avgXorSpread,
    avgImpulsePhaseShift: ledger.avgImpulsePhaseShift,
    avgMicActivity: ledger.avgMicActivity,
    lastImpulsePhaseShift: ledger.lastImpulsePhaseShift,
    lastMicActivity: ledger.lastMicActivity,
    lastXorSpread: ledger.lastXorSpread,
  };
}
