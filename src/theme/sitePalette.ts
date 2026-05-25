import * as THREE from "three";

export const SITE = {
  void: "#0a0a12",
  nebula: "#1a1030",
  star: "#e8e4f0",
  accent: "#a78bfa",
  gold: "#fbbf24",
  cosmic: "#6366f1",
} as const;

export type AxisSlot = "yes" | "no" | "good" | "bad" | "maybe";

/** Site tokens per rim slot (gold / cosmic / accent / star / accent). */
export const AXIS_SITE: Record<AxisSlot, string> = {
  yes: SITE.gold,
  no: SITE.cosmic,
  good: SITE.accent,
  bad: SITE.star,
  maybe: SITE.accent,
};

const SLOT_ORDER: AxisSlot[] = ["yes", "no", "good", "bad", "maybe"];

export function axisSlotForIndex(slot: 0 | 1 | 2 | 3 | 4): AxisSlot {
  return SLOT_ORDER[slot]!;
}

export type SectorHue = AxisSlot;

export function hueForAxisSlot(slot: 0 | 1 | 2 | 3 | 4): AxisSlot {
  return axisSlotForIndex(slot);
}

export function hexFromHsl(h: number, s: number, l: number): string {
  const c = new THREE.Color();
  c.setHSL(h / 360, s / 100, l / 100);
  return `#${c.getHexString()}`;
}

export function blendHex(a: string, b: string, t: number): string {
  const out = new THREE.Color(a);
  out.lerp(new THREE.Color(b), Math.max(0, Math.min(1, t)));
  return `#${out.getHexString()}`;
}

/** @deprecated */
export function axisHex(slot: AxisSlot): string {
  return AXIS_SITE[slot];
}

export function axisGlowHex(slot: AxisSlot): string {
  return blendHex(AXIS_SITE[slot], SITE.star, 0.22);
}

/** Scene layers — keep BG and FG separate so nothing washes together */
export const SCENE_LAYERS = {
  bg: {
    discColor: hexFromHsl(258, 38, 9),
    discOpacity: 0.18,
    rimColor: hexFromHsl(258, 45, 18),
    rimOpacity: 0.32,
    centerRingOpacity: 0.28,
    kaleidoscopeOpacityScale: 0.085,
    kaleidoscopeSaturation: 0.32,
    kaleidoscopeLightness: 0.11,
  },
  fg: {
    pastelMix: 0.62,
    labelOpacityMin: 0.55,
    labelOpacityMax: 1,
    guideOpacityMin: 0.42,
    guideOpacityMax: 1,
  },
} as const;

/** Map accumulated axis share (~0.25 idle) to 0–1 display emphasis. */
export function displayStrengthFromShare(share: number): number {
  return Math.max(0, Math.min(1, (share - 0.17) / 0.38));
}

/** Pastel site hue at low strength → full site token at high strength. */
export function labelColorForAxis(slot: AxisSlot, share: number): string {
  const t = displayStrengthFromShare(share);
  const site = AXIS_SITE[slot];
  const pastel = blendHex(site, SITE.nebula, SCENE_LAYERS.fg.pastelMix);
  return blendHex(pastel, site, t);
}

export function labelOpacityForStrength(share: number): number {
  const t = displayStrengthFromShare(share);
  const fg = SCENE_LAYERS.fg;
  return (
    fg.labelOpacityMin + t * (fg.labelOpacityMax - fg.labelOpacityMin)
  );
}

export function guideColorForAxis(slot: AxisSlot, share: number): string {
  return labelColorForAxis(slot, share);
}

export function guideOpacityForStrength(share: number): number {
  const t = displayStrengthFromShare(share);
  const fg = SCENE_LAYERS.fg;
  return (
    fg.guideOpacityMin + t * (fg.guideOpacityMax - fg.guideOpacityMin)
  );
}

export function kaleidoscopeBgHex(h: number, s: number): string {
  const bg = SCENE_LAYERS.bg;
  return hexFromHsl(
    h,
    s * bg.kaleidoscopeSaturation,
    bg.kaleidoscopeLightness * 100,
  );
}

export const KALEIDOSCOPE_BASE_HUES: { h: number; s: number; l: number }[] = [
  { h: 43, s: 96, l: 58 },
  { h: 239, s: 84, l: 66 },
  { h: 258, s: 94, l: 74 },
  { h: 220, s: 30, l: 72 },
  { h: 25, s: 80, l: 55 },
  { h: 285, s: 75, l: 60 },
];

export const DISPLAY_FONT_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5.2.8/files/orbitron-latin-600-normal.woff";
