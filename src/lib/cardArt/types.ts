import type { Suit } from "../../types/deck";

export type PatternDensity = "low" | "medium" | "high";

/** Per-card overrides — edit CARD_ART_OVERRIDES to customize any card. */
export interface CardArtProfile {
  backgroundOpacity: number;
  patternDensity: PatternDensity;
  glyphScale: number;
  glyphStrokeWidth: number;
  showHalo: boolean;
  showConnectorLines: boolean;
}

export type MajorGlyphId =
  | "observer"
  | "catalyst"
  | "superposition"
  | "field"
  | "constant"
  | "axiom"
  | "entanglement"
  | "trajectory"
  | "coherence"
  | "soliton"
  | "phaseWheel"
  | "symmetry"
  | "invertedFrame"
  | "decay"
  | "mixer"
  | "trapWell"
  | "cascade"
  | "guidingQuanta"
  | "darkSector"
  | "fullEmission"
  | "measurement"
  | "closedSystem";

export type CourtGlyphId = "initiate" | "propagator" | "eigenstate" | "sovereign";

export interface GlyphLayoutSpec {
  kind: "major";
  majorId: MajorGlyphId;
}

export interface GlyphPipsSpec {
  kind: "pips";
  suit: Suit;
  count: number;
}

export interface GlyphCourtSpec {
  kind: "court";
  suit: Suit;
  court: CourtGlyphId;
}

export interface GlyphSingleSpec {
  kind: "single";
  suit: Suit;
}

export type GlyphSpec = GlyphLayoutSpec | GlyphPipsSpec | GlyphCourtSpec | GlyphSingleSpec;

export interface CardArtBundle {
  profile: CardArtProfile;
  glyph: GlyphSpec;
}

export type RankKey = string;
