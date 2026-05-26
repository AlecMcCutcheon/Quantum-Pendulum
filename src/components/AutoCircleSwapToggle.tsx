import { useEffect, useState } from "react";
import {
  CIRCLE_SHIFT_THRESHOLD,
  circleShiftWindowElapsedMs,
  formatDeliberationTime,
  type CircleShiftLive,
} from "../lib/quantumCircleAuto";

interface AutoCircleSwapToggleProps {
  enabled: boolean;
  active: boolean;
  live: CircleShiftLive | null;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

function ShiftMeter({ live }: { live: CircleShiftLive }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const elapsed = circleShiftWindowElapsedMs(live, now);
  const lean = live.leanPct;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-wide text-star/45 uppercase">
            Shift lean
          </span>
          <span className="font-mono text-xs tabular-nums text-star/70">
            {live.score > 0 ? "+" : ""}
            {live.score}/{live.threshold}
          </span>
        </div>
        <div
          className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-white/10"
          role="meter"
          aria-valuenow={lean}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lean toward changing circle"
        >
          <div
            className="absolute inset-y-0 left-0 h-full rounded-full bg-gradient-to-r from-cyan-500/90 via-accent to-gold/90 transition-[width] duration-200"
            style={{ width: `${lean}%` }}
          />
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-star/35"
            aria-hidden
          />
        </div>
        <p className="mt-1 text-[10px] text-star/40">
          Keep ← → Change · {live.votesCast} vote{live.votesCast === 1 ? "" : "s"}{" "}
          · {formatDeliberationTime(elapsed)} on this disc
        </p>
      </div>
    </div>
  );
}

export function AutoCircleSwapToggle({
  enabled,
  active,
  live,
  onChange,
  disabled = false,
}: AutoCircleSwapToggleProps) {
  const hint = active && enabled ? "Live" : null;

  return (
    <div className="flex w-full max-w-md flex-col gap-2 text-left">
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-void accent-accent"
        />
        <span className="font-display text-xs tracking-widest text-accent/80 uppercase">
          Quantum circle shift
          {hint ? (
            <span className="ml-2 font-sans normal-case tracking-normal text-star/45">
              ({hint})
            </span>
          ) : null}
        </span>
      </label>

      <div className="rounded-xl border border-white/10 bg-void/40 px-4 py-3">
        <p className="text-xs leading-relaxed text-star/55">
          Each vote takes the next integer from the same session pool as the
          pendulum anchor (mic-mixed when microphone entropy is live).{" "}
          {CIRCLE_SHIFT_THRESHOLD} net change votes swap the disc; strong keep
          momentum resets the tally. Which circle to use is only drawn once a
          swap wins — no time limit.
        </p>
        {enabled && active && live ? (
          <div className="mt-3 border-t border-white/10 pt-3">
            <ShiftMeter live={live} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
