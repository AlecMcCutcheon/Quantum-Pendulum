export const TRAIL = {
  maxPoints: 480,
  durationMs: 5800,
  minDist: 0.001,
  minIntervalMs: 6,
  /** Max gap between rendered vertices (world units) — fills dotted segments */
  maxRenderSegment: 0.006,
  /** Screen-space width (drei Line / Line2) */
  lineWidth3d: 2.35,
  lineWidth3dGlow: 4.5,
  lineWidth2d: 2.4,
} as const;

/** Newest segment kept at full opacity; fade runs over the rest of the trail. */
const FADE_START_AGE = 0.08;
const FADE_POWER = 0.72;

export interface TrailPoint {
  x: number;
  z: number;
  at: number;
}

export interface TrailRenderVertex {
  x: number;
  y: number;
  z: number;
  color: [number, number, number, number];
}

export function createTrailBuffer(): TrailPoint[] {
  return [];
}

export function recordTrailPoint(
  buffer: TrailPoint[],
  x: number,
  z: number,
  now: number,
): TrailPoint[] {
  const last = buffer[buffer.length - 1];
  if (last) {
    const moved = Math.hypot(x - last.x, z - last.z);
    const elapsed = now - last.at;
    if (moved < TRAIL.minDist && elapsed < TRAIL.minIntervalMs) {
      return pruneTrail(buffer, now);
    }
  }

  let next = [...buffer, { x, z, at: now }];
  if (next.length > TRAIL.maxPoints) {
    next = next.slice(next.length - TRAIL.maxPoints);
  }
  return pruneTrail(next, now);
}

export function pruneTrail(buffer: TrailPoint[], now: number): TrailPoint[] {
  const cutoff = now - TRAIL.durationMs;
  return buffer.filter((p) => p.at >= cutoff);
}

/** RGBA 0–1: bright gold head → violet tail; long gentle alpha tail-off */
export function trailColorForAge(age01: number): [number, number, number, number] {
  const t = Math.max(0, Math.min(1, age01));
  const fresh = 1 - t;
  const fadeT =
    t < FADE_START_AGE
      ? 0
      : (t - FADE_START_AGE) / (1 - FADE_START_AGE);
  const fade = Math.pow(fadeT, FADE_POWER);
  const alpha = 0.94 * (1 - fade * 0.9);
  return [
    1 * fresh + 0.78 * t,
    0.86 * fresh + 0.62 * t,
    0.28 * fresh + 0.98 * t,
    alpha,
  ];
}

/** Densify samples + per-vertex age colors for a continuous line strip */
export function buildTrailRenderVertices(
  buffer: TrailPoint[],
  planeY: number,
  now: number,
): TrailRenderVertex[] {
  if (buffer.length < 2) return [];

  const oldest = buffer[0]!.at;
  const span = Math.max(TRAIL.durationMs, now - oldest);
  const out: TrailRenderVertex[] = [];

  const push = (x: number, z: number, at: number) => {
    const age01 = (now - at) / span;
    const [r, g, b, a] = trailColorForAge(age01);
    out.push({ x, y: planeY, z, color: [r, g, b, a] });
  };

  push(buffer[0]!.x, buffer[0]!.z, buffer[0]!.at);

  for (let i = 1; i < buffer.length; i++) {
    const a = buffer[i - 1]!;
    const b = buffer[i]!;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const dist = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(dist / TRAIL.maxRenderSegment));

    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      push(a.x + dx * t, a.z + dz * t, a.at + (b.at - a.at) * t);
    }
  }

  return out;
}

export function trailColorCss(age01: number): string {
  const [r, g, b, a] = trailColorForAge(age01);
  return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a.toFixed(3)})`;
}

export interface TrailSvgSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
}

/** 2D disc trail segments (same densification + colors as the 3D line strip). */
export function buildTrailSvgSegments(
  buffer: TrailPoint[],
  now: number,
  project: (x: number, z: number) => { x: number; y: number },
): TrailSvgSegment[] {
  const verts = buildTrailRenderVertices(buffer, 0, now);
  if (verts.length < 2) return [];

  const segments: TrailSvgSegment[] = [];
  for (let i = 1; i < verts.length; i++) {
    const a = verts[i - 1]!;
    const b = verts[i]!;
    const p1 = project(a.x, a.z);
    const p2 = project(b.x, b.z);
    const [r, g, bl, alpha] = a.color;
    segments.push({
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y,
      stroke: `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(bl * 255)},${alpha.toFixed(3)})`,
      strokeWidth: TRAIL.lineWidth2d,
    });
  }
  return segments;
}
