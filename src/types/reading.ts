import type { Orientation } from "./deck";

export interface PersonalReading {
  hook: string;
  sections: Array<{ heading: string; body: string }>;
  protocol: {
    steps: Array<{ heading: string; body: string }>;
  };
  takeaway: string;
}

export interface ReadingText {
  summary: string;
  detail: string;
  guidance: string;
  personal?: PersonalReading;
}

export interface CardReading {
  cardId: string;
  upright: ReadingText;
  reversed: ReadingText;
  transverse: ReadingText;
  conjugate: ReadingText;
}

export type ReadingByOrientation = Record<Orientation, ReadingText>;
