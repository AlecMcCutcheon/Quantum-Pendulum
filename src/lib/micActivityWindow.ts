/**
 * Ambient gate: spectral flatness only (VAD literature standard).
 * Noise/hiss = high flatness (0–1). Speech/tones = lower flatness.
 *
 * Two separate timings:
 * - Leave idle (→ Live): short attack — react quickly to speech.
 * - Enter idle (→ Ambient): hangover + hold — only after sound stops.
 */

export const ACTIVITY_WINDOW_MS = 2200;
export const NOISE_CALIBRATION_MS = 900;
/** Speech-like signal this long flips ambient → live. */
export const LIVE_ATTACK_MS = 120;
/** Stay live this long after the last speech-like frame (entering idle only). */
export const IDLE_HANGOVER_MS = 1100;
/** Non-speech after hangover before ambient locks in. */
export const IDLE_HOLD_MS = 3200;
export const ACTIVITY_WINDOW_MIN_MS = 400;

export interface MicFrameMetrics {
  instant: number;
  flux: number;
  flatness: number;
  flatness01: number;
  rawMotion: number;
  rms: number;
  zcr: number;
}

interface TimestampedFrame extends MicFrameMetrics {
  at: number;
}

interface NoiseProfile {
  /** Highest flatness seen during noise-only calibration (hiss / room tone). */
  flatness01: number;
  rms: number;
  flux: number;
  n: number;
}

interface CalNoiseAccumulator {
  maxFlatness01: number;
  sumRms: number;
  sumFlux: number;
  n: number;
}

function historySpanMs(frames: TimestampedFrame[]): number {
  if (frames.length < 2) return 0;
  return frames[frames.length - 1]!.at - frames[0]!.at;
}

/** Default noise floor when calibration had too little true hiss. */
const FALLBACK_NOISE_PROFILE: NoiseProfile = {
  flatness01: 0.58,
  rms: 0.025,
  flux: 10,
  n: 1,
};

export class MicActivityWindow {
  private frames: TimestampedFrame[] = [];
  private calibratingUntil = 0;
  private calNoise: CalNoiseAccumulator | null = null;
  private profile: NoiseProfile | null = null;
  private lastSpeechAt = 0;
  private speechAttackMs = 0;
  private nonSpeechMs = 0;
  private _ambient = true;

  reset(): void {
    this.frames = [];
    this.calibratingUntil = 0;
    this.calNoise = null;
    this.profile = null;
    this.lastSpeechAt = 0;
    this.speechAttackMs = 0;
    this.nonSpeechMs = 0;
    this._ambient = true;
  }

  startCalibration(now = performance.now()): void {
    this.calibratingUntil = now + NOISE_CALIBRATION_MS;
    this.calNoise = null;
    this.profile = null;
    this.frames = [];
    this.lastSpeechAt = 0;
    this.speechAttackMs = 0;
    this.nonSpeechMs = 0;
    this._ambient = true;
  }

  isCalibrating(now = performance.now()): boolean {
    return now < this.calibratingUntil;
  }

  get isAmbient(): boolean {
    return this._ambient;
  }

  /** True hiss only — used while calibrating the noise ceiling. */
  private looksLikeStationaryNoise(f: MicFrameMetrics): boolean {
    return f.flatness01 >= 0.54 && f.instant < 12;
  }

  private accumulateNoiseSample(f: MicFrameMetrics): void {
    const c = this.calNoise ?? {
      maxFlatness01: 0,
      sumRms: 0,
      sumFlux: 0,
      n: 0,
    };
    c.maxFlatness01 = Math.max(c.maxFlatness01, f.flatness01);
    c.sumRms += f.rms;
    c.sumFlux += f.flux;
    c.n += 1;
    this.calNoise = c;
  }

  private finalizeNoiseProfile(): void {
    const c = this.calNoise;
    if (!c || c.n < 4) {
      this.profile = { ...FALLBACK_NOISE_PROFILE };
    } else {
      this.profile = {
        flatness01: c.maxFlatness01,
        rms: c.sumRms / c.n,
        flux: c.sumFlux / c.n,
        n: c.n,
      };
    }
    this.calNoise = null;
  }

  /**
   * Hiss sits at the learned flatness ceiling (little or no drop below it).
   * Anything clearly more tonal (drop > ~0.03) is not stationary noise.
   */
  private isStationaryNoise(f: MicFrameMetrics): boolean {
    if (!this.profile) {
      return f.flatness01 >= 0.53;
    }
    const p = this.profile;
    const drop = p.flatness01 - f.flatness01;
    return drop <= 0.025 && f.flatness01 >= p.flatness01 - 0.03;
  }

  /**
   * Live = activity on the waveform/flux meter plus a tonal spectrum
   * (lower flatness than the hiss ceiling).
   */
  private isSpeechFrame(f: MicFrameMetrics): boolean {
    if (this.isStationaryNoise(f)) return false;

    if (!this.profile) {
      return f.instant >= 14 || f.flatness01 < 0.48;
    }

    const p = this.profile;
    const drop = p.flatness01 - f.flatness01;

    if (f.instant >= 14 && drop > 0.025) return true;
    if (drop >= 0.04) return true;
    if (drop >= 0.025 && f.rms >= p.rms * 1.2) return true;
    if (f.flatness01 < 0.48 && f.flux >= 18) return true;
    if (f.rawMotion >= 12 && drop > 0.02) return true;
    return false;
  }

  push(
    frame: MicFrameMetrics,
    dtMs: number,
    now = performance.now(),
  ): void {
    this.frames.push({ ...frame, at: now });
    const cutoff = now - ACTIVITY_WINDOW_MS;
    while (this.frames.length > 0 && this.frames[0]!.at < cutoff) {
      this.frames.shift();
    }

    if (this.calibratingUntil > 0 && now >= this.calibratingUntil) {
      this.finalizeNoiseProfile();
      this.calibratingUntil = 0;
    }

    if (now < this.calibratingUntil) {
      if (this.looksLikeStationaryNoise(frame)) {
        this.accumulateNoiseSample(frame);
      }
      this._ambient = true;
      this.speechAttackMs = 0;
      this.nonSpeechMs = 0;
      return;
    }

    if (this.isSpeechFrame(frame)) {
      this.lastSpeechAt = now;
      this.nonSpeechMs = 0;
      this.speechAttackMs += Math.min(80, Math.max(8, dtMs));
      if (this.speechAttackMs >= LIVE_ATTACK_MS) {
        this._ambient = false;
      }
      return;
    }

    this.speechAttackMs = 0;

    if (this._ambient) {
      return;
    }

    if (now - this.lastSpeechAt < IDLE_HANGOVER_MS) {
      return;
    }

    this.nonSpeechMs += Math.min(80, Math.max(8, dtMs));
    if (
      this.nonSpeechMs >= IDLE_HOLD_MS &&
      this.spanMs >= ACTIVITY_WINDOW_MIN_MS
    ) {
      this._ambient = true;
    }
  }

  framesInLast(ms: number, now = performance.now()): TimestampedFrame[] {
    const cutoff = now - ms;
    return this.frames.filter((f) => f.at >= cutoff);
  }

  get spanMs(): number {
    return historySpanMs(this.frames);
  }

  shouldBeLive(now = performance.now()): boolean {
    return !this._ambient && !this.isCalibrating(now);
  }

  displayActivity(now = performance.now()): number {
    if (this._ambient) return 0;
    const recent = this.framesInLast(500, now);
    if (recent.length === 0) return 0;
    return Math.min(
      100,
      Math.round(Math.max(...recent.map((f) => f.instant)) * 0.9),
    );
  }
}
