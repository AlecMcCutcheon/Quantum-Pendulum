
import type { SwingCircleSectors } from "../types/pendulum";
import { labelForReading, sectorIndexForReading } from "./swingCircle";

export type SwingReading = "yes" | "no" | "good" | "bad" | "maybe";

export type AxisReading = Exclude<SwingReading, "maybe">;

/** Per-axis motion share for rim labels / guide lines (independent of Maybe). */
export type AxisStrengths = Record<AxisReading, number>;

export interface SwingConfidence {
  yes: number;
  no: number;
  good: number;
  bad: number;
  maybe: number;
}

interface MotionSample {
  /** Bob on divination disc (world x/z, mount-centered). */
  planarX: number;
  planarZ: number;
  /** Planar velocity relative to pivot (world bob vel minus pivot vel). */
  velX: number;
  velZ: number;
  spin: number;
}

/** Swing path in the disc plane — thin oval ≈ axis; round oval / circle ≈ maybe. */
interface OrbitShape {
  /** λ_min/λ_max — 1 ≈ circular, 0 ≈ line-like. */
  thinness: number;
  /** 1 − thinness — how elongated the path is. */
  elongation: number;
  /** Soft sector weights for oval major-axis angle. */
  axisAlign: Record<AxisReading, number>;
  magnitude: number;
}

interface AxisAccum {
  dwell: Record<AxisReading, number>;
  strength: Record<AxisReading, number>;
  axisSwitches: number;
  loop: number;
  orbit: OrbitShape | null;
}

const BUFFER_LEN = 120;
const MIN_SAMPLES = 22;
const SAMPLE_DT = 1 / 60;
const SMOOTH_ALPHA = 0.14;

/** Weighted seconds on winning axis before leaving Maybe */
const MIN_WINNER_DWELL_S = 0.55;
/** Share of trail ink on winning axis */
const MIN_WINNER_STRENGTH_SHARE = 0.13;
/** Winner must lead runner-up by this much (combined score) */
const MIN_WINNER_MARGIN = 0.055;

const AXIS_KEYS: AxisReading[] = ["yes", "no", "good", "bad"];

/** Rim order around the disc — adjacent hops are normal, not “maybe”. */
const AXIS_RING: AxisReading[] = ["no", "bad", "yes", "good"];

function areAdjacentAxes(a: AxisReading, b: AxisReading): boolean {
  if (a === b) return true;
  const i = AXIS_RING.indexOf(a);
  const j = AXIS_RING.indexOf(b);
  const d = Math.abs(i - j);
  return d === 1 || d === 3;
}

function circularityXZ(samples: MotionSample[]): number {
  let sum = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]!;
    const b = samples[i]!;
    const dx = b.planarX - a.planarX;
    const dz = b.planarZ - a.planarZ;
    sum += Math.abs(dx * b.planarZ - dz * b.planarX);
  }
  return sum / Math.max(1, samples.length - 1);
}

/**
 * Rim highlight only — same axisWeights() as the analyzer, current frame (no trail buffer).
 */
export function instantaneousAxisStrengths(
  planarX: number,
  planarZ: number,
  velX: number,
  velZ: number,
): AxisStrengths {
  return axisWeights(planarX, planarZ, velX, velZ);
}

const POS_AXIS_WEIGHT = 0.5;
const VEL_AXIS_WEIGHT = 0.5;
/** Pull axis shares toward uniform to counter slow session drift. */
const AXIS_PRIOR_BLEND = 0.1;
const AXIS_DRIFT_ALPHA = 0.035;
const AXIS_DRIFT_CORRECTION = 0.85;
const ELLIPSE_COMBINED_WEIGHT = 0.3;
const PLANAR_IDLE_R = 0.04;
const PLANAR_IDLE_SPEED = 0.07;
const MIN_ORBIT_VARIANCE = 0.00035;
const MIN_ORBIT_ECCENTRICITY = 0.32;

/**
 * Rim directions in the disc plane (atan2(planarZ, planarX)):
 * E–W = no · TL↔BR = bad · N–S = yes · TR↔BL = good.
 * Each owns a ~90° soft sector; midpoints blend neighbors (e.g. yes↔bad).
 */
const AXIS_ANGLE: Record<AxisReading, number> = {
  no: 0,
  bad: Math.PI / 4,
  yes: Math.PI / 2,
  good: -Math.PI / 4,
};

/** Angular radius of one axis cone (to midpoint with neighbor). */
const SECTOR_RADIUS = Math.PI / 4;

function wrapAngle(theta: number): number {
  const t = theta % (2 * Math.PI);
  return t < 0 ? t + 2 * Math.PI : t;
}

function angularDistance(a: number, b: number): number {
  const da = wrapAngle(a);
  const db = wrapAngle(b);
  let d = Math.abs(da - db);
  if (d > Math.PI) d = 2 * Math.PI - d;
  return d;
}

/** cos² falloff — 1 on-axis, 0 at sector edge, ~0.5 between two axes. */
function sectorWeight(theta: number, axisAngle: number): number {
  const d = angularDistance(theta, axisAngle);
  if (d >= SECTOR_RADIUS) return 0;
  const x = (d / SECTOR_RADIUS) * (Math.PI / 2);
  const c = Math.cos(x);
  return c * c;
}

function normalizeAxisWeights(
  raw: Record<AxisReading, number>,
): Record<AxisReading, number> {
  const sum = AXIS_KEYS.reduce((s, k) => s + raw[k], 0);
  if (sum < 1e-8) {
    return { yes: 0.25, no: 0.25, good: 0.25, bad: 0.25 };
  }
  return {
    yes: raw.yes / sum,
    no: raw.no / sum,
    good: raw.good / sum,
    bad: raw.bad / sum,
  };
}

const UNIFORM_AXIS: Record<AxisReading, number> = {
  yes: 0.25,
  no: 0.25,
  good: 0.25,
  bad: 0.25,
};

/** Soft angular sectors — direction is a range, not a line. */
function angularSectorWeights(theta: number): Record<AxisReading, number> {
  const raw: Record<AxisReading, number> = { yes: 0, no: 0, good: 0, bad: 0 };
  for (const k of AXIS_KEYS) {
    raw[k] = sectorWeight(theta, AXIS_ANGLE[k]);
  }
  return normalizeAxisWeights(raw);
}

function planarAngle(
  planarX: number,
  planarZ: number,
  velX: number,
  velZ: number,
): number | null {
  const r = Math.hypot(planarX, planarZ);
  const speed = Math.hypot(velX, velZ);
  if (r < PLANAR_IDLE_R && speed < PLANAR_IDLE_SPEED) return null;
  if (r >= PLANAR_IDLE_R * 0.55) return Math.atan2(planarZ, planarX);
  if (speed >= PLANAR_IDLE_SPEED) return Math.atan2(velZ, velX);
  return null;
}

/**
 * Axis share from angle of position + velocity in the disc plane.
 * Slightly off Yes still reads Yes; between Yes and Bad the mix transitions.
 */
function axisWeights(
  planarX: number,
  planarZ: number,
  velX: number,
  velZ: number,
): Record<AxisReading, number> {
  const speed = Math.hypot(velX, velZ);
  const posTheta = planarAngle(planarX, planarZ, 0, 0);
  const velTheta = planarAngle(0, 0, velX, velZ);
  const posW = posTheta === null ? UNIFORM_AXIS : angularSectorWeights(posTheta);
  const velW = velTheta === null ? UNIFORM_AXIS : angularSectorWeights(velTheta);
  const motionBoost = 0.38 + speed * 5.5;

  const raw: Record<AxisReading, number> = { yes: 0, no: 0, good: 0, bad: 0 };
  for (const k of AXIS_KEYS) {
    raw[k] =
      (posW[k] * POS_AXIS_WEIGHT + velW[k] * VEL_AXIS_WEIGHT) * motionBoost;
  }
  return normalizeAxisWeights(raw);
}

const MIN_ORBIT_SAMPLES = 10;
const MIN_ORBIT_MAGNITUDE = 0.012;

/** Fit covariance ellipse to recent bob positions in the disc plane. */
function analyzeOrbitShape(samples: MotionSample[]): OrbitShape | null {
  const n = samples.length;
  if (n < MIN_ORBIT_SAMPLES) return null;

  let mx = 0;
  let mz = 0;
  for (const s of samples) {
    mx += s.planarX;
    mz += s.planarZ;
  }
  mx /= n;
  mz /= n;

  let cxx = 0;
  let czz = 0;
  let cxz = 0;
  for (const s of samples) {
    const dx = s.planarX - mx;
    const dz = s.planarZ - mz;
    cxx += dx * dx;
    czz += dz * dz;
    cxz += dx * dz;
  }
  cxx /= n;
  czz /= n;
  cxz /= n;

  const trace = cxx + czz;
  const det = cxx * czz - cxz * cxz;
  const disc = Math.max(0, trace * trace - 4 * det);
  const root = Math.sqrt(disc);
  const lambdaMajor = Math.max(0, (trace + root) * 0.5);
  const lambdaMinor = Math.max(0, (trace - root) * 0.5);

  const totalVar = cxx + czz;
  if (
    lambdaMajor < MIN_ORBIT_MAGNITUDE * MIN_ORBIT_MAGNITUDE ||
    totalVar < MIN_ORBIT_VARIANCE
  ) {
    return null;
  }

  const thinness = Math.min(1, Math.sqrt(lambdaMinor / lambdaMajor));
  const elongation = 1 - thinness;
  const eccentricity = Math.sqrt(Math.max(0, 1 - lambdaMinor / lambdaMajor));
  if (eccentricity < MIN_ORBIT_ECCENTRICITY) {
    return null;
  }

  let vx = cxz;
  let vz = lambdaMajor - cxx;
  if (vx * vx + vz * vz < 1e-12) {
    vx = lambdaMajor - czz;
    vz = cxz;
  }
  const majorTheta = Math.atan2(vz, vx);
  const axisAlign = angularSectorWeights(majorTheta);

  return {
    thinness,
    elongation,
    axisAlign,
    magnitude: Math.sqrt(lambdaMajor),
  };
}

/** Rim shares from oval elongation + major-axis direction (not line crossings). */
function ellipseAxisShares(orbit: OrbitShape): Record<AxisReading, number> {
  const elong = orbit.elongation;
  if (elong < 0.14) {
    return { yes: 0.25, no: 0.25, good: 0.25, bad: 0.25 };
  }

  const raw: Record<AxisReading, number> = { yes: 0, no: 0, good: 0, bad: 0 };
  for (const k of AXIS_KEYS) {
    raw[k] = elong * orbit.axisAlign[k] + (1 - elong) * 0.25;
  }
  return normalizeAxisWeights(raw);
}

function dominantOrbitAxis(orbit: OrbitShape): AxisReading | null {
  if (orbit.elongation < 0.32) return null;
  const best = dominantAxis(orbit.axisAlign);
  return orbit.axisAlign[best] >= 0.38 ? best : null;
}

/** Tie-break rotates with sample index so no axis wins every equal-weight frame. */
function dominantAxis(
  weights: Record<AxisReading, number>,
  tieOffset = 0,
): AxisReading {
  const start = ((tieOffset % 4) + 4) % 4;
  const order = AXIS_RING.slice(start).concat(AXIS_RING.slice(0, start));
  let best = order[0]!;
  let v = -1;
  for (const k of order) {
    if (weights[k] > v) {
      v = weights[k];
      best = k;
    }
  }
  return best;
}

function blendAxisPrior(
  shares: Record<AxisReading, number>,
): Record<AxisReading, number> {
  const raw: Record<AxisReading, number> = { yes: 0, no: 0, good: 0, bad: 0 };
  for (const k of AXIS_KEYS) {
    raw[k] = shares[k] * (1 - AXIS_PRIOR_BLEND) + 0.25 * AXIS_PRIOR_BLEND;
  }
  return normalizeAxisWeights(raw);
}

function correctAxisDrift(
  shares: Record<AxisReading, number>,
  drift: Record<AxisReading, number>,
): Record<AxisReading, number> {
  const raw: Record<AxisReading, number> = { yes: 0, no: 0, good: 0, bad: 0 };
  for (const k of AXIS_KEYS) {
    raw[k] = Math.max(0.02, shares[k] - (drift[k] - 0.25) * AXIS_DRIFT_CORRECTION);
  }
  return normalizeAxisWeights(raw);
}

function updateAxisDrift(
  drift: Record<AxisReading, number>,
  shares: Record<AxisReading, number>,
): void {
  for (const k of AXIS_KEYS) {
    drift[k] = drift[k] * (1 - AXIS_DRIFT_ALPHA) + shares[k] * AXIS_DRIFT_ALPHA;
  }
}

function accumulateAxes(samples: MotionSample[]): AxisAccum {
  const dwell: Record<AxisReading, number> = {
    yes: 0,
    no: 0,
    good: 0,
    bad: 0,
  };
  const strength: Record<AxisReading, number> = {
    yes: 0,
    no: 0,
    good: 0,
    bad: 0,
  };
  let axisSwitches = 0;
  let prevAxis: AxisReading | null = null;

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i]!;
    const w = axisWeights(s.planarX, s.planarZ, s.velX, s.velZ);
    const ink = s.spin + 0.0015;

    for (const k of AXIS_KEYS) {
      dwell[k] += SAMPLE_DT * w[k];
      strength[k] += ink * w[k];
    }

    const dom = dominantAxis(w, i);
    if (prevAxis && dom !== prevAxis && !areAdjacentAxes(prevAxis, dom)) {
      axisSwitches += 1;
    }
    prevAxis = dom;
  }

  return {
    dwell,
    strength,
    axisSwitches,
    loop: circularityXZ(samples),
    orbit: analyzeOrbitShape(samples),
  };
}

function combinedAxisScores(acc: AxisAccum): Record<AxisReading, number> {
  const totalDwell = AXIS_KEYS.reduce((s, k) => s + acc.dwell[k], 0);
  const totalStrength = AXIS_KEYS.reduce((s, k) => s + acc.strength[k], 0);
  const ellipse = acc.orbit
    ? ellipseAxisShares(acc.orbit)
    : { yes: 0.25, no: 0.25, good: 0.25, bad: 0.25 };
  const out: Record<AxisReading, number> = {
    yes: 0,
    no: 0,
    good: 0,
    bad: 0,
  };

  for (const k of AXIS_KEYS) {
    const dwellShare = totalDwell > 1e-8 ? acc.dwell[k] / totalDwell : 0.25;
    const strShare =
      totalStrength > 1e-8 ? acc.strength[k] / totalStrength : 0.25;
    const trail = dwellShare * 0.32 + strShare * 0.38;
    out[k] = trail * (1 - ELLIPSE_COMBINED_WEIGHT) + ellipse[k] * ELLIPSE_COMBINED_WEIGHT;
  }
  return blendAxisPrior(out);
}

/**
 * Maybe only when the path is genuinely round — thin pendulum ovals are not maybe.
 */
function rawMaybeScore(acc: AxisAccum, sampleCount: number): number {
  const loop = Math.min(0.28, acc.loop * 7);
  const switchRate = acc.axisSwitches / Math.max(1, sampleCount);
  const switchMaybe = Math.max(0, switchRate - 0.04) * 0.14;
  const orbit = acc.orbit;

  if (!orbit) {
    return Math.min(0.45, 0.18 + loop + switchMaybe);
  }

  const roundness = Math.max(0, (orbit.thinness - 0.58) / 0.42);
  let maybe = roundness * 0.4 + loop * 0.16 + switchMaybe;

  if (orbit.elongation > 0.18) {
    const orbitAxis = dominantOrbitAxis(orbit);
    const align = orbitAxis ? orbit.axisAlign[orbitAxis] : 0;
    const suppress = orbit.elongation * (0.65 + align * 0.35);
    maybe *= Math.max(0.06, 1 - suppress);
  }

  return Math.min(0.62, Math.max(0.05, maybe));
}

function capMaybeFromAxisLead(
  maybe: number,
  axisScores: Record<AxisReading, number>,
  orbit: OrbitShape | null,
): number {
  const lead = Math.max(
    axisScores.yes,
    axisScores.no,
    axisScores.good,
    axisScores.bad,
  );
  let cap = 0.1 + (1 - lead) * 0.32;
  if (orbit && orbit.elongation > 0.22) {
    cap *= Math.max(0.12, 1 - orbit.elongation * 0.85);
  }
  return Math.min(maybe, cap);
}

/** Center label / ring — tied to unsettled state, not raw maybe alone. */
export function maybeVisualStrength(
  confidence: SwingConfidence,
  axis: AxisStrengths,
): number {
  const rim = Math.max(axis.yes, axis.no, axis.good, axis.bad);
  return Math.max(0.1, Math.min(1, confidence.maybe * (1 - rim * 0.88)));
}

function isAxisSettled(acc: AxisAccum, combined: Record<AxisReading, number>): boolean {
  const totalDwell = AXIS_KEYS.reduce((s, k) => s + acc.dwell[k], 0);
  const totalStrength = AXIS_KEYS.reduce((s, k) => s + acc.strength[k], 0);
  if (totalDwell < MIN_WINNER_DWELL_S * 0.35) return false;

  const best = dominantAxis(combined);
  const bestScore = combined[best];
  let second = 0;
  for (const k of AXIS_KEYS) {
    if (k !== best && combined[k] > second) second = combined[k];
  }

  const orbitAxis = acc.orbit ? dominantOrbitAxis(acc.orbit) : null;
  const margin = MIN_WINNER_MARGIN;

  if (orbitAxis && acc.orbit && acc.orbit.elongation >= 0.34) {
    const ell = ellipseAxisShares(acc.orbit);
    const ellScore = ell[orbitAxis];
    if (
      ellScore >= 0.34 &&
      (ellScore >= bestScore - 0.05 || orbitAxis === best) &&
      bestScore - second >= margin * 0.6
    ) {
      return acc.dwell[orbitAxis] >= MIN_WINNER_DWELL_S * 0.75;
    }
  }

  if (acc.dwell[best] < MIN_WINNER_DWELL_S) return false;
  if (totalStrength > 1e-8 && acc.strength[best] / totalStrength < MIN_WINNER_STRENGTH_SHARE) {
    return false;
  }
  if (bestScore - second < margin) return false;

  return true;
}

function normalizeConfidence(c: SwingConfidence): SwingConfidence {
  const sum = c.yes + c.no + c.good + c.bad + c.maybe;
  if (sum < 1e-8) {
    return { yes: 0.05, no: 0.05, good: 0.05, bad: 0.05, maybe: 0.55 };
  }
  return {
    yes: c.yes / sum,
    no: c.no / sum,
    good: c.good / sum,
    bad: c.bad / sum,
    maybe: c.maybe / sum,
  };
}

function blendConfidence(
  prev: SwingConfidence,
  next: SwingConfidence,
  alpha: number,
): SwingConfidence {
  return normalizeConfidence({
    yes: prev.yes * (1 - alpha) + next.yes * alpha,
    no: prev.no * (1 - alpha) + next.no * alpha,
    good: prev.good * (1 - alpha) + next.good * alpha,
    bad: prev.bad * (1 - alpha) + next.bad * alpha,
    maybe: prev.maybe * (1 - alpha) + next.maybe * alpha,
  });
}

export function dominantReading(c: SwingConfidence): SwingReading {
  const axisOnly: Record<AxisReading, number> = {
    yes: c.yes,
    no: c.no,
    good: c.good,
    bad: c.bad,
  };
  const best = dominantAxis(axisOnly);
  const bestVal = axisOnly[best];
  if (c.maybe >= 0.5 && bestVal < c.maybe) return "maybe";
  return best;
}

export function isConfidenceUndetermined(c: SwingConfidence): boolean {
  return c.maybe >= 0.48;
}

export interface SwingDisplayState {
  confidence: SwingConfidence;
  /** Time-smoothed axis shares for rim labels / guides. */
  axisStrengths: AxisStrengths;
  verdictReady: boolean;
  verdictReading: SwingReading;
  /** 0–1 progress toward verdict threshold. */
  verdictProgress: number;
}

function bestAxisReading(combined: Record<AxisReading, number>): AxisReading {
  return dominantAxis(combined);
}

function verdictProgress(acc: AxisAccum, combined: Record<AxisReading, number>): number {
  const totalDwell = AXIS_KEYS.reduce((s, k) => s + acc.dwell[k], 0);
  const totalStrength = AXIS_KEYS.reduce((s, k) => s + acc.strength[k], 0);
  if (totalDwell < 1e-6) return 0;

  const best = bestAxisReading(combined);
  let second = 0;
  let bestScore = combined[best];
  for (const k of AXIS_KEYS) {
    if (k !== best && combined[k] > second) second = combined[k];
  }

  const dwellP = Math.min(1, acc.dwell[best] / MIN_WINNER_DWELL_S);
  const marginP = Math.min(
    1,
    Math.max(0, (bestScore - second) / MIN_WINNER_MARGIN),
  );
  const strP =
    totalStrength > 1e-8
      ? Math.min(1, acc.strength[best] / totalStrength / MIN_WINNER_STRENGTH_SHARE)
      : 0;
  const orbitP =
    acc.orbit && acc.orbit.elongation > 0.2
      ? Math.min(1, ellipseAxisShares(acc.orbit)[best] * acc.orbit.elongation * 1.15)
      : 0;

  return Math.min(
    1,
    dwellP * 0.42 + marginP * 0.3 + strP * 0.16 + orbitP * 0.12,
  );
}

export function formatVerdictLabel(
  state: SwingDisplayState,
  sectors?: SwingCircleSectors,
): string {
  if (!state.verdictReady) {
    if (sectors) return labelForReading("maybe", sectors);
    return swingReadingLabel("maybe");
  }
  if (sectors) return labelForReading(state.verdictReading, sectors);
  return swingReadingLabel(state.verdictReading);
}

export function formatDominantLabel(
  c: SwingConfidence,
  sectors?: SwingCircleSectors,
): string {
  const reading = dominantReading(c);
  if (sectors) return labelForReading(reading, sectors);
  return swingReadingLabel(reading);
}

/** @deprecated */
export function formatConfidenceLabel(c: SwingConfidence): string {
  return formatDominantLabel(c);
}

const AXIS_DISPLAY_ALPHA = 0.1;

export class SwingMotionAnalyzer {
  private buffer: MotionSample[] = [];
  private smoothed: SwingConfidence = {
    yes: 0.05,
    no: 0.05,
    good: 0.05,
    bad: 0.05,
    maybe: 0.55,
  };
  private axisSmoothed: AxisStrengths = {
    yes: 0.25,
    no: 0.25,
    good: 0.25,
    bad: 0.25,
  };
  private axisDrift: Record<AxisReading, number> = {
    yes: 0.25,
    no: 0.25,
    good: 0.25,
    bad: 0.25,
  };

  reset(): void {
    this.buffer = [];
    this.smoothed = {
      yes: 0.05,
      no: 0.05,
      good: 0.05,
      bad: 0.05,
      maybe: 0.55,
    };
    this.axisSmoothed = {
      yes: 0.25,
      no: 0.25,
      good: 0.25,
      bad: 0.25,
    };
    this.axisDrift = {
      yes: 0.25,
      no: 0.25,
      good: 0.25,
      bad: 0.25,
    };
  }

  /** Disc-plane bob position + pivot-relative planar velocity (matches trail x/z). */
  recordDiscPlanar(
    planarX: number,
    planarZ: number,
    velX: number,
    velZ: number,
  ): void {
    const planarR = Math.hypot(planarX, planarZ);
    const planarV = Math.hypot(velX, velZ);
    if (planarR < PLANAR_IDLE_R && planarV < PLANAR_IDLE_SPEED) {
      return;
    }

    const sample: MotionSample = {
      planarX,
      planarZ,
      velX,
      velZ,
      spin: planarV,
    };
    this.buffer.push(sample);
    if (this.buffer.length > BUFFER_LEN) {
      this.buffer.shift();
    }
    this.maybeRefreshAxisDrift();
  }

  /** @deprecated Use recordDiscPlanar — kept for legacy sim integrator. */
  recordFromRelative(
    relX: number,
    _relY: number,
    relZ: number,
    linvelX: number,
    _linvelY: number,
    linvelZ: number,
  ): void {
    this.recordDiscPlanar(relX, relZ, linvelX, linvelZ);
  }

  private debiasShares(
    shares: Record<AxisReading, number>,
  ): Record<AxisReading, number> {
    return correctAxisDrift(shares, this.axisDrift);
  }

  private maybeRefreshAxisDrift(): void {
    if (this.buffer.length < MIN_SAMPLES || this.buffer.length % 8 !== 0) {
      return;
    }
    updateAxisDrift(this.axisDrift, combinedAxisScores(accumulateAxes(this.buffer)));
  }

  analyzeConfidence(): SwingConfidence {
    const raw = this.computeRawScores();
    this.smoothed = blendConfidence(this.smoothed, raw, SMOOTH_ALPHA);
    return { ...this.smoothed };
  }

  /**
   * Rim highlight + verdict: axis strength builds over the trail buffer;
   * the shown answer only locks once isAxisSettled passes.
   */
  analyzeDisplayState(): SwingDisplayState {
    const confidence = this.analyzeConfidence();
    const rawAxis = this.computeAxisStrengthsRaw();

    for (const k of AXIS_KEYS) {
      this.axisSmoothed[k] =
        this.axisSmoothed[k] * (1 - AXIS_DISPLAY_ALPHA) +
        rawAxis[k] * AXIS_DISPLAY_ALPHA;
    }

    let verdictReady = false;
    let verdictReading: SwingReading = "maybe";
    let progress = 0;

    if (this.buffer.length >= MIN_SAMPLES) {
      const acc = accumulateAxes(this.buffer);
      const combined = this.debiasShares(combinedAxisScores(acc));
      progress = verdictProgress(acc, combined);
      verdictReady = isAxisSettled(acc, combined);
      if (verdictReady) {
        verdictReading = bestAxisReading(combined);
      }
    }

    return {
      confidence,
      axisStrengths: { ...this.axisSmoothed },
      verdictReady,
      verdictReading,
      verdictProgress: progress,
    };
  }

  /** Trail-buffer axis shares (no display smoothing). */
  analyzeAxisStrengths(): AxisStrengths {
    return this.computeAxisStrengthsRaw();
  }

  analyze(): SwingReading {
    const state = this.analyzeDisplayState();
    return state.verdictReady ? state.verdictReading : "maybe";
  }

  private computeAxisStrengthsRaw(): AxisStrengths {
    if (this.buffer.length < MIN_SAMPLES) {
      return { yes: 0.25, no: 0.25, good: 0.25, bad: 0.25 };
    }
    const acc = accumulateAxes(this.buffer);
    return this.debiasShares(combinedAxisScores(acc));
  }

  private computeRawScores(): SwingConfidence {
    if (this.buffer.length < MIN_SAMPLES) {
      return {
        yes: 0.05,
        no: 0.05,
        good: 0.05,
        bad: 0.05,
        maybe: 0.55,
      };
    }

    const acc = accumulateAxes(this.buffer);
    const combined = this.debiasShares(combinedAxisScores(acc));
    const settled = isAxisSettled(acc, combined);
    let maybe = rawMaybeScore(acc, this.buffer.length);
    const orbitAxis = acc.orbit ? dominantOrbitAxis(acc.orbit) : null;
    const axisScale = settled ? 1 : 0.9;

    const axisScores: Record<AxisReading, number> = {
      yes: combined.yes * axisScale,
      no: combined.no * axisScale,
      good: combined.good * axisScale,
      bad: combined.bad * axisScale,
    };

    if (orbitAxis && acc.orbit) {
      const boost = settled ? 1.12 : 1.16;
      axisScores[orbitAxis] *= boost * (0.88 + acc.orbit.elongation * 0.2);
    }

    maybe = capMaybeFromAxisLead(maybe, axisScores, acc.orbit);

    return normalizeConfidence({
      yes: axisScores.yes,
      no: axisScores.no,
      good: axisScores.good,
      bad: axisScores.bad,
      maybe,
    });
  }

  /** @deprecated Canvas integrator */
  record(sim: import("./pendulumPhysics").SimState3D): void {
    const L = 1;
    const u = sim.rod.u;
    const o = sim.rod.omega;
    this.recordFromRelative(
      u.x * L,
      u.y * L,
      u.z * L,
      o.x,
      o.y,
      o.z,
    );
  }
}

export function swingReadingLabel(reading: SwingReading): string {
  if (reading === "yes") return "Yes";
  if (reading === "no") return "No";
  if (reading === "good") return "Good";
  if (reading === "bad") return "Bad";
  return "Maybe";
}

export function swingReadingToSectorIndex(
  reading: SwingReading,
  sectors: SwingCircleSectors,
): number {
  return sectorIndexForReading(reading, sectors);
}
