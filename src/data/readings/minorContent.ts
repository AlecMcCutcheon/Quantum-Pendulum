import type { ReadingText } from "../../types/reading";
import type { Suit, TarotCard } from "../../types/deck";
import { getMinorPipSource } from "./minorLateral";
import { getMinorVertical } from "./minorVertical";
import {
  buildMinorReversed,
  buildMinorUpright,
  type SuitMeta,
} from "./minorReadingBuilder";
import { enrichMinorLateralExpand } from "./minorReadingEnrich";

type Orientations = {
  upright: ReadingText;
  reversed: ReadingText;
  transverse: ReadingText;
  conjugate: ReadingText;
};

const SUIT_META: Record<Suit, SuitMeta> = {
  wands: {
    element: "fire",
    domain: "creativity, ambition, passion, and enterprise",
    quantum: "Photons",
    lens:
      "Photons carry energy in discrete packets—initiation, visibility, and risk of burnout when intensity has no medium to absorb it.",
  },
  cups: {
    element: "water",
    domain: "emotion, relationships, intuition, and the inner life",
    quantum: "Waves",
    lens:
      "Waves rise, crest, and carry feeling through the medium—emotion propagates, builds, and breaks on boundaries; denial creates interference that eventually finds release.",
  },
  swords: {
    element: "air",
    domain: "thought, conflict, truth, and decisive communication",
    quantum: "Operators",
    lens:
      "Operators transform states—words, decisions, and arguments act on the mind’s configuration; clarity cuts, but blunt force decoheres understanding.",
  },
  pentacles: {
    element: "earth",
    domain: "work, body, money, craft, and material security",
    quantum: "Lattice",
    lens:
      "Lattice structures bind nodes into stability—habits, assets, skills, and health compound through repeated bonds; weak links threaten the whole grid.",
  },
};

function buildOrientations(
  suit: Suit,
  card: TarotCard,
): Orientations {
  const meta = SUIT_META[suit];
  const pipBase = getMinorPipSource(card.id);
  if (!pipBase) {
    throw new Error(`Missing minor pip research: ${card.id}`);
  }
  const vertical = getMinorVertical(card.id);
  const pip = vertical
    ? { ...pipBase, vertical: { ...pipBase.vertical, ...vertical } }
    : pipBase;

  return {
    upright: buildMinorUpright(card, pip, meta),
    reversed: buildMinorReversed(card, pip, meta),
    transverse: enrichMinorLateralExpand(card.id, "transverse", pip.transverse),
    conjugate: enrichMinorLateralExpand(card.id, "conjugate", pip.conjugate),
  };
}

export function getMinorReading(card: TarotCard): Orientations | null {
  if (card.arcana !== "minor" || !card.suit) return null;
  return buildOrientations(card.suit, card);
}
