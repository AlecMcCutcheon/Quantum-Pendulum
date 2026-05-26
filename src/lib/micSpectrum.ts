/** Fold magnitude spectrum into one entropy byte (rotates across bins each call). */
export function foldSpectrumByte(freq: Uint8Array, tick: number): number {
  const n = freq.length;
  if (n === 0) return 128;
  let h = 0;
  for (let k = 0; k < 10; k++) {
    const i = (tick * 7 + k * 13) % n;
    h ^= freq[i]!;
    h = (Math.imul(h, 0x9e) + k) & 0xff;
  }
  return h;
}

/** 0–1 spectral flatness (Wiener entropy): high = noise-like, low = tonal / speech. */
export function spectralFlatness01(freq: Uint8Array): number {
  let sum = 0;
  let sumLog = 0;
  let count = 0;
  for (let i = 2; i < freq.length; i++) {
    const m = Math.max(1, freq[i]!);
    sum += m;
    sumLog += Math.log(m);
    count++;
  }
  if (count === 0 || sum <= 0) return 0;
  const geo = Math.exp(sumLog / count);
  const arith = sum / count;
  return Math.min(1, Math.max(0, geo / arith));
}

/** 0–100 display scale derived from flatness01. */
export function spectralFlatnessPercent(freq: Uint8Array): number {
  return Math.min(100, Math.round(spectralFlatness01(freq) * 100));
}

/** 0–100 mean |Δbin| per frame. */
export function spectralFluxPercent(
  freq: Uint8Array,
  prev: Uint8Array | null,
): number {
  if (!prev || prev.length !== freq.length) return 0;
  let sum = 0;
  for (let i = 0; i < freq.length; i++) {
    sum += Math.abs(freq[i]! - prev[i]!);
  }
  const meanDelta = sum / freq.length;
  return Math.min(100, Math.round(meanDelta * 2.2));
}

/** 0–1 zero-crossing rate (useful with flatness in classic VAD). */
export function zeroCrossingRate01(raw: Uint8Array): number {
  if (raw.length < 2) return 0;
  let crossings = 0;
  for (let i = 1; i < raw.length; i++) {
    const a = raw[i - 1]! - 128;
    const b = raw[i]! - 128;
    if ((a >= 0 && b < 0) || (a < 0 && b >= 0)) crossings++;
  }
  return crossings / (raw.length - 1);
}

/** Peak + mean deviation motion for a waveform buffer (0–100). */
export function waveformMotionPercent(samples: Uint8Array): number {
  if (samples.length === 0) return 0;
  let min = 255;
  let max = 0;
  let sumDev = 0;
  for (let i = 0; i < samples.length; i++) {
    const b = samples[i]!;
    if (b < min) min = b;
    if (b > max) max = b;
    sumDev += Math.abs(b - 128);
  }
  const peak = max - min;
  const meanDev = sumDev / samples.length;
  const peakScore = Math.min(100, (peak / 64) * 100);
  const devScore = Math.min(100, (meanDev / 42) * 100);
  return Math.min(100, Math.round(Math.max(peakScore, devScore * 0.9)));
}

/** UI activity meter (decoupled from VAD gate). */
export function micActivityPercent(
  display: Uint8Array,
  raw: Uint8Array,
  flux: number,
  flatness01: number,
): number {
  const rawMotion = waveformMotionPercent(raw);
  const displayMotion = waveformMotionPercent(display);
  const fluxScore = Math.min(100, Math.round(flux * 2.4));
  const coreSignal = Math.max(rawMotion, fluxScore);

  if (flatness01 >= 0.5 && coreSignal < 14) {
    return Math.min(5, Math.round(rawMotion * 0.1));
  }

  if (coreSignal < 12) {
    return Math.min(3, Math.round(displayMotion * 0.06));
  }

  return Math.min(
    100,
    Math.round(Math.max(coreSignal, displayMotion * 0.88, fluxScore)),
  );
}

/** Slow AGC for the display waveform only (entropy ring stays raw). */
export class WaveformGain {
  private gain = 1;

  get multiplier(): number {
    return this.gain;
  }

  update(rms: number): number {
    const target = 0.2;
    const desired = target / (rms + 0.006);
    const rate = rms > 0.14 ? 0.16 : 0.07;
    this.gain = this.gain * (1 - rate) + desired * rate;
    this.gain = Math.max(1, Math.min(14, this.gain));
    return this.gain;
  }

  applyForDisplay(raw: Uint8Array, out: Uint8Array): void {
    const n = Math.min(raw.length, out.length);
    const g = this.gain;
    for (let i = 0; i < n; i++) {
      const centered = ((raw[i]! - 128) / 128) * g;
      const clamped = Math.max(-1, Math.min(1, centered));
      out[i] = Math.round(clamped * 127 + 128);
    }
  }

  reset(): void {
    this.gain = 1;
  }
}

export function waveformRms(raw: Uint8Array): number {
  if (raw.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < raw.length; i++) {
    const c = (raw[i]! - 128) / 128;
    sumSq += c * c;
  }
  return Math.sqrt(sumSq / raw.length);
}
