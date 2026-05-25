import type { DivinationCircle } from "../types/pendulum";

/**
 * Every circle uses the same axis layout:
 * [0] N–S · [1] E–W · [2] TR↔BL · [3] TL↔BR · [4] center (unsettled)
 * Colors follow axis slot site-wide (gold / cosmic / accent / star / accent).
 */
export const DIVINATION_CIRCLES: DivinationCircle[] = [
  {
    id: "yes-no-maybe",
    name: "Yes · No · Good · Bad",
    description: "",
    sectors: [
      { label: "Yes" },
      { label: "No" },
      { label: "Good" },
      { label: "Bad" },
      { label: "Maybe" },
    ],
  },
  {
    id: "elements",
    name: "Elements",
    description: "",
    sectors: [
      { label: "Fire" },
      { label: "Water" },
      { label: "Air" },
      { label: "Earth" },
      { label: "Spirit" },
    ],
  },
  {
    id: "emotions",
    name: "Emotions",
    description: "",
    sectors: [
      { label: "Joy" },
      { label: "Calm" },
      { label: "Love" },
      { label: "Fear" },
      { label: "Mixed" },
    ],
  },
  {
    id: "path",
    name: "Path",
    description: "",
    sectors: [
      { label: "Go" },
      { label: "Turn" },
      { label: "Stay" },
      { label: "Wait" },
      { label: "Unsure" },
    ],
  },
  {
    id: "time",
    name: "Timing",
    description: "",
    sectors: [
      { label: "Now" },
      { label: "Soon" },
      { label: "Later" },
      { label: "Not yet" },
      { label: "Open" },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    description: "",
    sectors: [
      { label: "Charge" },
      { label: "Rest" },
      { label: "Rise" },
      { label: "Fall" },
      { label: "Steady" },
    ],
  },
  {
    id: "truth",
    name: "Truth",
    description: "",
    sectors: [
      { label: "True" },
      { label: "False" },
      { label: "Partly" },
      { label: "Doubt" },
      { label: "Unknown" },
    ],
  },
  {
    id: "relationship",
    name: "Connection",
    description: "",
    sectors: [
      { label: "Closer" },
      { label: "Space" },
      { label: "Harmony" },
      { label: "Tension" },
      { label: "Unclear" },
    ],
  },
  {
    id: "self",
    name: "Self",
    description: "",
    sectors: [
      { label: "Act" },
      { label: "Pause" },
      { label: "Grow" },
      { label: "Release" },
      { label: "Reflect" },
    ],
  },
];

/** Rim labels in axis order: N–S · E–W · TR↔BL · TL↔BR · center */
export function circleDirectionsLabel(circle: DivinationCircle): string {
  return circle.sectors.map((s) => s.label).join(" · ");
}

export function getCircleById(id: string): DivinationCircle {
  return (
    DIVINATION_CIRCLES.find((c) => c.id === id) ?? DIVINATION_CIRCLES[0]!
  );
}
