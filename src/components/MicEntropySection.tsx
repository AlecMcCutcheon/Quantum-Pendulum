import { useEffect, useRef, useState } from "react";
import type {
  MicEntropyStatus,
  MicInputMode,
  MicLiveStats,
} from "../hooks/useLiveMicEntropy";
import type { MicEntropyPhase } from "../lib/micAmbient";
import type { QuantumConsumptionLedger } from "../types/quantumLedger";
import { MicActivityWaveform } from "./MicActivityWaveform";

interface MicEntropySectionProps {
  enabled: boolean;
  status: MicEntropyStatus;
  error: string | null;
  live: MicLiveStats;
  inputMode: MicInputMode;
  onInputModeChange: (mode: MicInputMode) => void;
  pttHeld: boolean;
  onPttHeldChange: (held: boolean) => void;
  entropyPhase: MicEntropyPhase;
  ledger: QuantumConsumptionLedger;
  waveformRef: React.RefObject<Uint8Array>;
  mixingActive: boolean;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}

function MicModeToggle({
  value,
  onChange,
  disabled,
}: {
  value: MicInputMode;
  onChange: (mode: MicInputMode) => void;
  disabled?: boolean;
}) {
  const btn = (mode: MicInputMode, label: string) => {
    const on = value === mode;
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={on}
        onClick={() => onChange(mode)}
        className={`px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase transition-colors ${
          on
            ? "bg-accent/25 text-accent"
            : "text-star/45 hover:text-star/70"
        } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
      >
        {label}
      </button>
    );
  };
  return (
    <div
      role="group"
      aria-label="Microphone input mode"
      className="flex shrink-0 overflow-hidden rounded-md border border-white/12 bg-void/60"
    >
      {btn("auto", "Auto")}
      <span className="w-px bg-white/10" aria-hidden />
      {btn("ptt", "PTT")}
    </div>
  );
}

function PttToggleButton({
  active,
  disabled,
  onToggle,
}: {
  active: boolean;
  disabled?: boolean;
  onToggle: (active: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={active}
      onClick={() => onToggle(!active)}
      className={`w-full rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
        active
          ? "border-accent/50 bg-accent/20 text-star"
          : "border-white/15 bg-white/5 text-star/70 hover:border-white/25 hover:bg-white/8"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {active ? "Mic entropy on — click to stop" : "Click to mix mic entropy"}
    </button>
  );
}

function PhaseShiftMeter({
  value,
  idle,
}: {
  value: number;
  idle?: boolean;
}) {
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const [display, setDisplay] = useState(0);

  targetRef.current = idle ? 0 : value;

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const target = targetRef.current;
      const cur = smoothRef.current;
      const diff = target - cur;
      if (Math.abs(diff) < 0.35) {
        smoothRef.current = target;
      } else {
        smoothRef.current = cur + diff * (diff > 0 ? 0.14 : 0.1);
      }
      setDisplay(smoothRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const showIdleLabel = Boolean(idle) && display < 1.5;
  const label = showIdleLabel ? "Idle" : `${Math.round(display)}%`;
  const width = showIdleLabel
    ? 8 + (1 - Math.min(1, display / 1.5)) * 4
    : Math.max(display > 0 ? 3 : 0, display);
  const liveMix = idle
    ? Math.max(0, Math.min(1, display / 18))
    : Math.min(1, 0.25 + (display / 100) * 0.75);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
          Phase shift
        </span>
        <span
          className="font-mono text-xs tabular-nums transition-colors duration-300"
          style={{
            color:
              liveMix > 0.4
                ? "rgba(226, 232, 240, 0.72)"
                : "rgba(148, 163, 184, 0.42)",
            fontStyle: showIdleLabel ? "italic" : "normal",
          }}
        >
          {label}
        </span>
      </div>
      <div
        className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuenow={Math.round(display)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Phase shift"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-star/25 transition-[width] duration-75 ease-out"
          style={{ width: `${width}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-500/90 via-accent to-gold/90 transition-[width,opacity] duration-75 ease-out"
          style={{ width: `${width}%`, opacity: liveMix }}
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
  inputMode,
  onInputModeChange,
  pttHeld,
  onPttHeldChange,
  entropyPhase,
  ledger,
  waveformRef,
  mixingActive,
  disabled,
  onChange,
}: MicEntropySectionProps) {
  const ptt = inputMode === "ptt";
  const hint =
    status === "requesting"
      ? "Requesting…"
      : status === "on"
        ? ptt
          ? pttHeld
            ? "Live"
            : "PTT"
          : entropyPhase === "idle"
            ? "Ambient"
            : "Live"
        : null;
  const showMeters = enabled && status === "on";
  const phaseIdle = ptt ? !pttHeld : entropyPhase === "idle";
  const phaseShift =
    !phaseIdle && ledger.impulsesConsumed > 0
      ? ledger.lastImpulsePhaseShift
      : 0;

  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-left">
      <div className="flex items-center justify-between gap-3">
        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={enabled}
            disabled={disabled || status === "requesting"}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 shrink-0 rounded border-white/20 bg-void accent-accent"
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
        <MicModeToggle
          value={inputMode}
          onChange={onInputModeChange}
          disabled={disabled}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-300/90" role="status">
          {error}
        </p>
      ) : null}

      {showMeters ? (
        <div className="space-y-3 rounded-xl border border-white/10 bg-void/40 px-4 py-3">
          {ptt ? (
            <PttToggleButton
              active={pttHeld}
              disabled={disabled}
              onToggle={onPttHeldChange}
            />
          ) : null}
          <MicActivityWaveform
            waveformRef={waveformRef}
            activity={live.activity}
            gain={live.gain}
            mixingLive={mixingActive}
            phaseIdle={phaseIdle}
          />
          <PhaseShiftMeter value={phaseShift} idle={phaseIdle} />
        </div>
      ) : null}
    </div>
  );
}
