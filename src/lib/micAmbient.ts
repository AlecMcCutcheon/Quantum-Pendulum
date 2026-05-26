import {
  MicActivityWindow,
  type MicFrameMetrics,
} from "./micActivityWindow";

export type MicEntropyPhase = "idle" | "active";

/**
 * Thin wrapper — VAD state lives in MicActivityWindow.
 */
export class AmbientActivityTracker {
  private window = new MicActivityWindow();

  get isAmbient(): boolean {
    return this.window.isAmbient;
  }

  get phase(): MicEntropyPhase {
    return this.window.isAmbient ? "idle" : "active";
  }

  displayActivity(): number {
    return this.window.displayActivity();
  }

  startCalibration(now = performance.now()): void {
    this.window.startCalibration(now);
  }

  push(frame: MicFrameMetrics, dtMs: number): void {
    this.window.push(frame, dtMs);
  }

  reset(): void {
    this.window.reset();
  }
}

/** @deprecated Use AmbientActivityTracker */
export const AmbientLevelTracker = AmbientActivityTracker;

export function smoothMeter(previous: number, raw: number, alpha = 0.2): number {
  const next = previous * (1 - alpha) + raw * alpha;
  return Math.min(100, Math.round(next));
}
