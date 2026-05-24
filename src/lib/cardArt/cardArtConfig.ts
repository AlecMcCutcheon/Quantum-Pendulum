import type { TarotCard } from "../../types/deck";
import type {
  CardArtBundle,
  CardArtProfile,
  CourtGlyphId,
  GlyphSpec,
  MajorGlyphId,
} from "./types";

const DEFAULT_PROFILE: CardArtProfile = {
  backgroundOpacity: 0.38,
  patternDensity: "medium",
  glyphScale: 1,
  glyphStrokeWidth: 2,
  showHalo: true,
  showConnectorLines: false,
};

/** Customize individual cards: merge partial profiles and glyph hints. */
export const CARD_ART_OVERRIDES: Partial<
  Record<string, Partial<CardArtProfile> & { glyphScale?: number }>
> = {
  // Example: emphasize Nine of Waves (Nine of Cups)
  "cups-09": {
    glyphScale: 1.15,
    backgroundOpacity: 0.32,
    showConnectorLines: false,
  },
};

const MAJOR_GLYPH_IDS: MajorGlyphId[] = [
  "observer",
  "catalyst",
  "superposition",
  "field",
  "constant",
  "axiom",
  "entanglement",
  "trajectory",
  "coherence",
  "soliton",
  "phaseWheel",
  "symmetry",
  "invertedFrame",
  "decay",
  "mixer",
  "trapWell",
  "cascade",
  "guidingQuanta",
  "darkSector",
  "fullEmission",
  "measurement",
  "closedSystem",
];

const COURT_MAP: Record<string, CourtGlyphId> = {
  page: "initiate",
  knight: "propagator",
  queen: "eigenstate",
  king: "sovereign",
};

function pipCount(rank: TarotCard["rank"]): number {
  if (rank === "ace") return 1;
  if (typeof rank === "number") return rank;
  return 1;
}

function glyphForCard(card: TarotCard): GlyphSpec {
  if (card.arcana === "major") {
    const idx = typeof card.rank === "number" ? card.rank : 0;
    return { kind: "major", majorId: MAJOR_GLYPH_IDS[idx] ?? "observer" };
  }
  const suit = card.suit!;
  if (typeof card.rank === "string" && card.rank !== "ace") {
    return {
      kind: "court",
      suit,
      court: COURT_MAP[card.rank] ?? "initiate",
    };
  }
  const count = pipCount(card.rank);
  if (count === 1) return { kind: "single", suit };
  return { kind: "pips", suit, count };
}

export function getCardArtBundle(card: TarotCard): CardArtBundle {
  const override = CARD_ART_OVERRIDES[card.id];
  const profile: CardArtProfile = {
    ...DEFAULT_PROFILE,
    ...override,
  };
  return { profile, glyph: glyphForCard(card) };
}

export function densityLayers(density: CardArtProfile["patternDensity"]): number {
  switch (density) {
    case "low":
      return 2;
    case "high":
      return 4;
    default:
      return 3;
  }
}
