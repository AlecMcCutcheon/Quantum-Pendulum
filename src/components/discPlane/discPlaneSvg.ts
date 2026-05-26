import { WORLD } from "../pendulum3d/constants";
import {
  KALEIDOSCOPE_BASE_HUES,
  kaleidoscopeBgHex,
} from "../../theme/sitePalette";
import {
  guideColorForAxis,
  guideOpacityForStrength,
  type AxisSlot,
} from "../../theme/sitePalette";

export interface DiscPatternShape {
  kind: "path" | "circle";
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  fill: string;
  opacity: number;
}

function rosePath(cx: number, cy: number, scale: number, petals: number): string {
  let d = "";
  for (let t = 0; t <= Math.PI * 2; t += 0.055) {
    const rad = scale * Math.cos(petals * t);
    const x = cx + rad * Math.cos(t);
    const y = cy + rad * Math.sin(t);
    d += `${t === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return `${d}Z`;
}

function regularPolygon(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  rotation = -Math.PI / 2,
): string {
  const pts: string[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i * 2 * Math.PI) / sides;
    pts.push(`${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

/**
 * Filled geometric shapes (tarot card BG style) — circles, roses, hexes, soft lattice.
 * No line-heavy kaleidoscope wedges.
 */
export function buildDiscGeometricPattern(
  cx: number,
  cy: number,
  discR: number,
): DiscPatternShape[] {
  const hues = [
    KALEIDOSCOPE_BASE_HUES[0]!,
    KALEIDOSCOPE_BASE_HUES[2]!,
    KALEIDOSCOPE_BASE_HUES[4]!,
  ];
  const c = (i: number) => kaleidoscopeBgHex(hues[i % hues.length]!.h, hues[i % hues.length]!.s);
  const shapes: DiscPatternShape[] = [];

  let ringR = discR * 0.78;
  for (let i = 0; i < 5; i++) {
    shapes.push({
      kind: "circle",
      cx,
      cy,
      r: ringR,
      fill: c(0),
      opacity: 0.045 + i * 0.018,
    });
    ringR *= 0.68;
  }

  shapes.push({
    kind: "path",
    d: rosePath(cx, cy, discR * 0.36, 5),
    fill: c(1),
    opacity: 0.07,
  });
  shapes.push({
    kind: "path",
    d: rosePath(cx, cy, discR * 0.22, 3),
    fill: c(2),
    opacity: 0.05,
  });

  shapes.push({
    kind: "path",
    d: regularPolygon(cx, cy, discR * 0.55, 6, Math.PI / 6),
    fill: c(1),
    opacity: 0.04,
  });
  shapes.push({
    kind: "path",
    d: regularPolygon(cx, cy, discR * 0.38, 6, 0),
    fill: c(0),
    opacity: 0.035,
  });

  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    shapes.push({
      kind: "circle",
      cx: cx + Math.cos(a) * discR * 0.52,
      cy: cy + Math.sin(a) * discR * 0.52,
      r: discR * 0.09,
      fill: c(i % 3),
      opacity: 0.055,
    });
  }

  shapes.push({
    kind: "path",
    d: regularPolygon(cx, cy, discR * 0.12, 8),
    fill: c(2),
    opacity: 0.045,
  });

  for (let q = 0; q < 4; q++) {
    const cornerA = (q * Math.PI) / 2 + Math.PI / 4;
    shapes.push({
      kind: "circle",
      cx: cx + Math.cos(cornerA) * discR * 0.62,
      cy: cy + Math.sin(cornerA) * discR * 0.62,
      r: discR * 0.12,
      fill: c(q % 2),
      opacity: 0.05,
    });
  }

  return shapes;
}

export function axisGuideVisual(strength: number): {
  opacity: number;
  lineWidth: number;
  glowWidth: number;
} {
  const t = Math.max(0, Math.min(1, strength));
  const opacity = guideOpacityForStrength(t);
  const lineWidth = 1.8 + t * 3.2;
  return {
    opacity,
    lineWidth,
    glowWidth: lineWidth + 5 + t * 3,
  };
}

export interface AxisGuideSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  opacity: number;
  lineWidth: number;
  glowWidth: number;
}

export function buildFourAxisGuides(
  cx: number,
  cy: number,
  r: number,
  axis: { yes: number; no: number; good: number; bad: number },
  slots: { yes: { hue: AxisSlot }; no: { hue: AxisSlot }; good: { hue: AxisSlot }; bad: { hue: AxisSlot } },
): AxisGuideSegment[] {
  const RIM = 0.9;
  const DIAG = RIM * 0.72;
  const inner = r * 0.28;
  const outer = r * RIM;
  const dIn = r * DIAG * 0.4;
  const dOut = r * DIAG * 0.95;

  const mk = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    hue: AxisSlot,
    strength: number,
  ): AxisGuideSegment => {
    const v = axisGuideVisual(strength);
    return {
      x1,
      y1,
      x2,
      y2,
      color: guideColorForAxis(hue, strength),
      opacity: v.opacity,
      lineWidth: v.lineWidth,
      glowWidth: v.glowWidth,
    };
  };

  return [
    mk(cx, cy - inner, cx, cy - outer, slots.yes.hue, axis.yes),
    mk(cx, cy + inner, cx, cy + outer, slots.yes.hue, axis.yes),
    mk(cx - inner, cy, cx - outer, cy, slots.no.hue, axis.no),
    mk(cx + inner, cy, cx + outer, cy, slots.no.hue, axis.no),
    mk(cx + dIn, cy - dIn, cx + dOut, cy - dOut, slots.good.hue, axis.good),
    mk(cx - dIn, cy + dIn, cx - dOut, cy + dOut, slots.good.hue, axis.good),
    mk(cx - dIn, cy - dIn, cx - dOut, cy - dOut, slots.bad.hue, axis.bad),
    mk(cx + dIn, cy + dIn, cx + dOut, cy + dOut, slots.bad.hue, axis.bad),
  ];
}

export function centerRingRadius(discR: number): number {
  return discR * (WORLD.discCenterRadius / WORLD.discRadius);
}
