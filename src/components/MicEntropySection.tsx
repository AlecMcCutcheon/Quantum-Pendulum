import type {
  MicEntropyStatus,
  MicLiveStats,
} from "../hooks/useLiveMicEntropy";
import type { MicEntropyPhase } from "../lib/micAmbient";
import type { QuantumConsumptionLedger } from "../types/quantumLedger";

interface MicEntropySectionProps {
  enabled: boolean;
  status: MicEntropyStatus;
  error: string | null;
  live: MicLiveStats;
  entropyPhase: MicEntropyPhase;
  ledger: QuantumConsumptionLedger;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}

function MeterRow({
  label,
  value,
  idle,
}: {
  label: string;
  value: number;
  idle?: boolean;
}) {
  const display = idle ? "Idle" : `${value}%`;
  const width = idle ? 12 : Math.max(value > 0 ? 3 : 0, value);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
          {label}
        </span>
        <span
          className={`font-mono text-xs tabular-nums ${
            idle ? "text-star/40 italic" : "text-star/70"
          }`}
        >
          {display}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuenow={idle ? 0 : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-150 ${
            idle
              ? "bg-star/25"
              : "bg-gradient-to-r from-cyan-500/90 via-accent to-gold/90"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function MicEntropySection({
  enabled,
  status,
  error,
  live,
  entropyPhase,
  ledger,
  disabled,
  onChange,
}: MicEntropySectionProps) {
  const hint =
    status === "requesting"
      ? "Requesting…"
      : status === "on"
        ? entropyPhase === "idle"
          ? "Ambient"
          : "Live"
        : null;
  const showMeters = enabled && status === "on";
  const phaseIdle = entropyPhase === "idle";
  const phaseShift =
    !phaseIdle && ledger.impulsesConsumed > 0
      ? ledger.lastImpulsePhaseShift
      : 0;

  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-left">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled || status === "requesting"}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-void accent-accent"
        />
        <span className="font-display text-xs tracking-widest text-accent/80 uppercase">
          Microphone entropy
          {hint ? (
            <span className="ml-2 font-sans normal-case tracking-normal text-star/45">
              ({hint})
            </span>
          ) : null}
        </span>
      </label>

      {error ? (
        <p className="text-xs text-red-300/90" role="status">
          {error}
        </p>
      ) : null}

      {showMeters ? (
        <div className="space-y-3 rounded-xl border border-white/10 bg-void/40 px-4 py-3">
          <MeterRow label="Volume" value={live.level} />
          <MeterRow label="Phase shift" value={phaseShift} idle={phaseIdle} />
        </div>
      ) : null}
    </div>
  );
}
