import type { DivinationSector, SwingCircleSectors } from "../types/pendulum";
import type { AxisSlot } from "../theme/sitePalette";
import { hueForAxisSlot } from "../theme/sitePalette";
import type { SwingReading } from "./swingMotion";

export interface ParsedSwingCircle {
  yes: DivinationSector & { hue: AxisSlot };
  no: DivinationSector & { hue: AxisSlot };
  good: DivinationSector & { hue: AxisSlot };
  bad: DivinationSector & { hue: AxisSlot };
  maybe: DivinationSector & { hue: AxisSlot };
}

const SLOT_BY_READING: Record<SwingReading, number> = {
  yes: 0,
  no: 1,
  good: 2,
  bad: 3,
  maybe: 4,
};

function withHue(sector: DivinationSector, slot: 0 | 1 | 2 | 3 | 4) {
  return { label: sector.label, hue: hueForAxisSlot(slot) };
}

export function parseSwingCircle(sectors: SwingCircleSectors): ParsedSwingCircle {
  return {
    yes: withHue(sectors[0], 0),
    no: withHue(sectors[1], 1),
    good: withHue(sectors[2], 2),
    bad: withHue(sectors[3], 3),
    maybe: withHue(sectors[4], 4),
  };
}

export function labelForReading(
  reading: SwingReading,
  sectors: SwingCircleSectors,
): string {
  return sectors[SLOT_BY_READING[reading] as 0 | 1 | 2 | 3 | 4]?.label ?? "—";
}

export function sectorIndexForReading(
  reading: SwingReading,
  _sectors: SwingCircleSectors,
): number {
  return SLOT_BY_READING[reading] ?? 4;
}
