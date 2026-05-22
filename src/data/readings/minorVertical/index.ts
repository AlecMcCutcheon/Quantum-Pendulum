import type { MinorVerticalEntry } from "./types";
import { CUPS_VERTICAL } from "./cups";
import { PENTACLES_VERTICAL } from "./pentacles";
import { SWORDS_VERTICAL } from "./swords";
import { WANDS_VERTICAL } from "./wands";

export type { MinorVerticalEntry } from "./types";

const MINOR_VERTICAL: Record<string, MinorVerticalEntry> = {
  ...WANDS_VERTICAL,
  ...CUPS_VERTICAL,
  ...SWORDS_VERTICAL,
  ...PENTACLES_VERTICAL,
};

export function getMinorVertical(cardId: string): MinorVerticalEntry | undefined {
  return MINOR_VERTICAL[cardId];
}
