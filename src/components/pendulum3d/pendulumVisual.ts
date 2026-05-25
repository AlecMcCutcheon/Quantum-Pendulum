import { AXIS_SITE, SITE, axisGlowHex } from "../../theme/sitePalette";

export const PENDULUM_PALETTE = {
  gold: AXIS_SITE.yes,
  goldGlow: axisGlowHex("yes"),
  accent: AXIS_SITE.good,
  accentGlow: axisGlowHex("good"),
  cosmic: AXIS_SITE.no,
  cosmicGlow: axisGlowHex("no"),
  star: SITE.star,
  void: SITE.void,
} as const;

export const BOB_MATERIAL = {
  color: PENDULUM_PALETTE.gold,
  emissive: PENDULUM_PALETTE.goldGlow,
  emissiveIntensity: 0.68,
  metalness: 0.58,
  roughness: 0.2,
} as const;

export const PIVOT_MATERIAL = {
  color: PENDULUM_PALETTE.accent,
  emissive: PENDULUM_PALETTE.accentGlow,
  emissiveIntensity: 0.72,
  metalness: 0.65,
  roughness: 0.18,
} as const;

export const ROD_MATERIAL = {
  color: "#d4d0e8",
  emissive: PENDULUM_PALETTE.accentGlow,
  emissiveIntensity: 0.28,
  metalness: 0.72,
  roughness: 0.24,
} as const;

export const MOUNT_RING_MATERIAL = {
  color: PENDULUM_PALETTE.cosmic,
  emissive: PENDULUM_PALETTE.cosmicGlow,
  emissiveIntensity: 0.55,
  metalness: 0.48,
  roughness: 0.28,
} as const;

export const MOUNT_CAP_MATERIAL = {
  color: PENDULUM_PALETTE.accent,
  emissive: PENDULUM_PALETTE.goldGlow,
  emissiveIntensity: 0.5,
  metalness: 0.75,
  roughness: 0.18,
} as const;

export function tetherVertexColors(): [
  [number, number, number, number],
  [number, number, number, number],
] {
  return [
    [0.4, 0.42, 0.95, 0.62],
    [1, 0.88, 0.35, 0.96],
  ];
}
