import { useEffect } from "react";
import { buildStreamReport } from "../lib/quantumTransactionExplain";
import type { QuantumConsumptionLedger } from "../types/quantumLedger";
import type { QuantumStream } from "../types/pendulum";

interface QuantumTransactionModalProps {
  open: boolean;
  onClose: () => void;
  stream: QuantumStream | null;
  ledger: QuantumConsumptionLedger;
  micActive: boolean;
}

export function QuantumTransactionButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-star/50 underline-offset-2 hover:text-accent hover:underline"
    >
      View quantum stream
    </button>
  );
}

export function QuantumTransactionModal({
  open,
  onClose,
  stream,
  ledger,
  micActive,
}: QuantumTransactionModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (
    !open ||
    !stream ||
    (stream.pool.length === 0 && ledger.records.length === 0)
  ) {
    return null;
  }

  const report = buildStreamReport(stream, ledger);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-title"
    >
      <div className="themed-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-accent/30 bg-nebula/95 p-6 shadow-xl lg:max-w-3xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2
              id="tx-title"
              className="font-display text-lg tracking-wide text-accent"
            >
              Quantum stream
            </h2>
            <p className="mt-1 text-xs text-star/50">
              Full consumed history for this session — not a truncated tail.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-star/60 hover:text-star"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-xs leading-relaxed text-star/55">
          One batched QRNG pool feeds everything in order: pendulum impulses
          (five integers each) and circle-shift votes (one at a time) share the
          same cursor — whoever needs entropy next takes the next integer(s).{" "}
          <strong className="font-normal text-star/70">
            Queued now
          </strong>{" "}
          is what matters for the next pull — not the session total fetched.
          Used numbers are kept in the log below; the in-memory buffer only
          holds what is still unread (plus any prefetched batch).
        </p>

        <dl className="grid gap-3 text-sm text-star/80 sm:grid-cols-2">
          <div>
            <dt className="text-star/50">Queued now</dt>
            <dd>
              {report.queued} integers (~{report.queuedImpulses} impulses)
            </dd>
          </div>
          <div>
            <dt className="text-star/50">In memory</dt>
            <dd>{report.bufferedNow} integers waiting to read</dd>
          </div>
          <div>
            <dt className="text-star/50">Used this session</dt>
            <dd>
              {report.consumedCount} integers · {report.impulsesConsumed}{" "}
              impulses
            </dd>
          </div>
          <div>
            <dt className="text-star/50">Fetched total</dt>
            <dd>
              {report.sessionFetchedTotal} integers · {report.batchCount} QRNG
              batches
            </dd>
          </div>
        </dl>

        {micActive ? (
          <p className="mt-4 text-xs text-star/55">
            Mic on · phase shift {report.lastImpulsePhaseShift}% (avg{" "}
            {report.avgImpulsePhaseShift}%) · XOR spread {report.avgXorSpread}%
          </p>
        ) : null}

        <p className="mt-5 text-xs font-semibold tracking-wide text-star/45 uppercase">
          Consumed (full session log)
        </p>
        <pre className="mt-1 max-h-56 overflow-auto rounded-lg border border-white/10 bg-void/60 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-star/75">
          {report.consumedFormatted}
        </pre>

        <p className="mt-4 text-xs font-semibold tracking-wide text-star/45 uppercase">
          Next integers (raw QRNG preview)
        </p>
        <pre className="mt-1 max-h-40 overflow-auto rounded-lg border border-white/10 bg-void/60 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-star/70">
          {report.poolAheadFormatted}
        </pre>

        <p className="mt-4 text-xs font-semibold tracking-wide text-star/45 uppercase">
          Batch sources
        </p>
        <pre className="mt-1 max-h-28 overflow-auto rounded-lg border border-white/10 bg-void/60 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-star/60">
          {report.batchesSummary}
        </pre>

        <p className="mt-4 text-xs leading-relaxed text-star/45">
          Each impulse uses five integers: disk angle, disk radius, approach
          strength, blend duration, next interval. With mic on, one byte is
          paired per integer at consumption time; phase shift measures how far
          the used value moved from the raw QRNG word. Impulse phase shift is
          the meaningful “how far did the draw move” metric; XOR spread near 50%
          only confirms full-word mixing.
        </p>
      </div>
    </div>
  );
}
