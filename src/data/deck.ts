import type { Suit, TarotCard } from "../types/deck";
import { toRoman } from "../lib/romanNumerals";

const SUIT_QUANTUM: Record<Suit, string> = {
  wands: "Particles",
  cups: "Waves",
  swords: "Operators",
  pentacles: "Lattices",
};

const SUIT_CLASSIC: Record<Suit, string> = {
  wands: "Wands",
  cups: "Cups",
  swords: "Swords",
  pentacles: "Pentacles",
};

const MAJOR: Array<{
  classic: string;
  quantum: string;
  roman: string;
  rank: number;
}> = [
  { classic: "The Fool", quantum: "The Observer", roman: "0", rank: 0 },
  { classic: "The Magician", quantum: "The Catalyst", roman: "I", rank: 1 },
  { classic: "The High Priestess", quantum: "The Superposition", roman: "II", rank: 2 },
  { classic: "The Empress", quantum: "The Field", roman: "III", rank: 3 },
  { classic: "The Emperor", quantum: "The Constant", roman: "IV", rank: 4 },
  { classic: "The Hierophant", quantum: "The Axiom", roman: "V", rank: 5 },
  { classic: "The Lovers", quantum: "The Entangled", roman: "VI", rank: 6 },
  { classic: "The Chariot", quantum: "The Trajectory", roman: "VII", rank: 7 },
  { classic: "Strength", quantum: "Coherence", roman: "VIII", rank: 8 },
  { classic: "The Hermit", quantum: "The Soliton", roman: "IX", rank: 9 },
  { classic: "Wheel of Fortune", quantum: "The Phase Wheel", roman: "X", rank: 10 },
  { classic: "Justice", quantum: "Symmetry", roman: "XI", rank: 11 },
  { classic: "The Hanged Man", quantum: "Inverted Frame", roman: "XII", rank: 12 },
  { classic: "Death", quantum: "Entropy", roman: "XIII", rank: 13 },
  { classic: "Temperance", quantum: "The Mixer", roman: "XIV", rank: 14 },
  { classic: "The Devil", quantum: "The Bound State", roman: "XV", rank: 15 },
  { classic: "The Tower", quantum: "Cascade Failure", roman: "XVI", rank: 16 },
  { classic: "The Star", quantum: "The Guiding Quanta", roman: "XVII", rank: 17 },
  { classic: "The Moon", quantum: "The Dark Sector", roman: "XVIII", rank: 18 },
  { classic: "The Sun", quantum: "Full Emission", roman: "XIX", rank: 19 },
  { classic: "Judgement", quantum: "The Measurement", roman: "XX", rank: 20 },
  { classic: "The World", quantum: "The Closed System", roman: "XXI", rank: 21 },
];

const COURT_QUANTUM: Record<string, string> = {
  page: "Initiate",
  knight: "Propagator",
  queen: "Eigenstate",
  king: "Sovereign",
};

const COURT_CLASSIC: Record<string, string> = {
  page: "Page",
  knight: "Knight",
  queen: "Queen",
  king: "King",
};

function buildMinors(): TarotCard[] {
  const suits: Suit[] = ["wands", "cups", "swords", "pentacles"];
  const cards: TarotCard[] = [];
  let index = 22;

  for (const suit of suits) {
    const qSuit = SUIT_QUANTUM[suit];
    const cSuit = SUIT_CLASSIC[suit];

    cards.push({
      id: `${suit}-ace`,
      index: index++,
      classicName: `Ace of ${cSuit}`,
      quantumName: `Singularity of ${qSuit}`,
      arcana: "minor",
      suit,
      rank: "ace",
      romanLabel: toRoman(1),
    });

    for (let n = 2; n <= 10; n++) {
      const word = ["", "", "Pair", "Triplet", "Quartet", "Quintet", "Sextet", "Septet", "Octet", "Nonet", "Decet"][n];
      cards.push({
        id: `${suit}-${String(n).padStart(2, "0")}`,
        index: index++,
        classicName: `${n === 2 ? "Two" : n === 3 ? "Three" : n === 4 ? "Four" : n === 5 ? "Five" : n === 6 ? "Six" : n === 7 ? "Seven" : n === 8 ? "Eight" : n === 9 ? "Nine" : "Ten"} of ${cSuit}`,
        quantumName: `${word} of ${qSuit}`,
        arcana: "minor",
        suit,
        rank: n,
        romanLabel: toRoman(n),
      });
    }

    for (const court of ["page", "knight", "queen", "king"] as const) {
      cards.push({
        id: `${suit}-${court}`,
        index: index++,
        classicName: `${COURT_CLASSIC[court]} of ${cSuit}`,
        quantumName: `${COURT_QUANTUM[court]} of ${qSuit}`,
        arcana: "minor",
        suit,
        rank: court,
        romanLabel: COURT_CLASSIC[court],
      });
    }
  }

  return cards;
}

function buildMajors(): TarotCard[] {
  return MAJOR.map((m, i) => ({
    id: `major-${String(m.rank).padStart(2, "0")}`,
    index: i,
    classicName: m.classic,
    quantumName: m.quantum,
    arcana: "major" as const,
    suit: null,
    rank: m.rank,
    romanLabel: toRoman(m.rank),
  }));
}

export const DECK: TarotCard[] = [...buildMajors(), ...buildMinors()];
export const DECK_SIZE = DECK.length;

export function getCardById(id: string): TarotCard | undefined {
  return DECK.find((c) => c.id === id);
}

export { SUIT_QUANTUM, SUIT_CLASSIC };
