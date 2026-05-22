import type { ReadingText } from "../../../types/reading";

/** Per-pip sources: Biddy Tarot keywords + researched lateral poles (see docs/ORIENTATION_RESEARCH.md §4). */
export interface MinorPipSource {
  biddyUpright: string;
  biddyReversed: string;
  transverse: ReadingText;
  conjugate: ReadingText;
  /** Optional full vertical copy; replaces generic builder text when set. */
  vertical?: Partial<
    Record<"upright" | "reversed", { detail: string; guidance?: string }>
  >;
}

export type MinorLateralMap = Record<string, MinorPipSource>;
