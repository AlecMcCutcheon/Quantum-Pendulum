/** Must hold stability this long before treating as ambient (ms). */
export const AMBIENT_HOLD_MS = 900;
/** Mean level at or below this = quiet floor (room hiss / idle mic). */
export const QUIET_LEVEL_MAX = 14;
/** Mean above this exits ambient immediately (hysteresis). */
export const QUIET_LEVEL_EXIT = 18;
/** EMA alpha for level sent into the tracker (lower = smoother). */
export const LEVEL_SMOOTH_ALPHA = 0.14;

export type MicEntropyPhase = "idle" | "active";

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Quiet ambient: level wobbles in a narrow band (e.g. 1–2% for a long time).
 * Uses relative spread at low volumes so absolute % jitter does not block idle.
 */
function isStableWindow(samples: number[]): boolean {
  if (samples.length < 2) return false;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  const range = max - min;
  const avg = mean(samples);

  if (avg <= QUIET_LEVEL_MAX) {
    if (range <= 3) return true;
    if (avg >= 0.5 && range / avg <= 0.55) return true;
    return false;
  }

  return range <= Math.max(5, avg * 0.22);
}

function isActiveSignal(samples: number[]): boolean {
  const avg = mean(samples);
  if (avg >= QUIET_LEVEL_EXIT) return true;
  const min = Math.min(...samples);
  const max = Math.max(...samples);
  if (max - min >= 12) return true;
  const recent = samples.slice(-6);
  const older = samples.slice(0, Math.max(0, samples.length - 6));
  if (older.length >= 4 && recent.length >= 4) {
    const jump = Math.abs(mean(recent) - mean(older));
    if (jump >= 8) return true;
  }
  return false;
}

export class AmbientLevelTracker {
  private history: number[] = [];
  private stableMs = 0;
  private _isAmbient = false;

  get isAmbient(): boolean {
    return this._isAmbient;
  }

  get phase(): MicEntropyPhase {
    return this._isAmbient ? "idle" : "active";
  }

  push(level: number, dtMs: number): void {
    this.history.push(level);
    if (this.history.length > 40) this.history.shift();

    if (this.history.length < 10) {
      this.stableMs = 0;
      this._isAmbient = false;
      return;
    }

    const window = this.history;
    const avg = mean(window);

    if (isActiveSignal(window)) {
      this.stableMs = 0;
      this._isAmbient = false;
      return;
    }

    const quiet = avg <= QUIET_LEVEL_MAX;
    const stable = isStableWindow(window);

    if (quiet && stable) {
      this.stableMs += dtMs;
      if (this.stableMs >= AMBIENT_HOLD_MS) {
        this._isAmbient = true;
      }
      return;
    }

    this.stableMs = Math.max(0, this.stableMs - dtMs * 1.5);
    if (this.stableMs < AMBIENT_HOLD_MS * 0.35) {
      this._isAmbient = false;
    }
  }

  reset(): void {
    this.history = [];
    this.stableMs = 0;
    this._isAmbient = false;
  }
}

/** Exponential moving average for mic level (0–100). */
export function smoothMicLevel(previous: number, raw: number): number {
  const next = previous * (1 - LEVEL_SMOOTH_ALPHA) + raw * LEVEL_SMOOTH_ALPHA;
  return Math.min(100, Math.round(next));
}
