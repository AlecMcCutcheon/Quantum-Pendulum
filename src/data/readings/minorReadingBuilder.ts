import type { ReadingText } from "../../types/reading";
import type { Rank, TarotCard } from "../../types/deck";
import type { MinorPipSource } from "./minorLateral/types";

export interface SuitMeta {
  element: string;
  domain: string;
  quantum: string;
  lens: string;
}

function rankKey(rank: Rank): string {
  if (typeof rank === "number") return String(rank);
  return rank;
}

const RANK_HOOK: Record<
  string,
  { upright: string; reversed: string; crossing: string }
> = {
  ace: {
    upright:
      "Aces are pure suit voltage—seed impulse before story complicates it.",
    reversed:
      "The ace misfires or turns inward—potential present, channel blocked.",
    crossing:
      "At the crossing, the ace’s theme is loud but uncollapsed—initiation without follow-through yet.",
  },
  "2": {
    upright: "Twos weigh polarity—partnership, debate, or balance forming.",
    reversed: "The pair decoheres—stalemate, hidden imbalance, or refusal to choose.",
    crossing: "The crossing is the tension between two options or two people still unmerged.",
  },
  "3": {
    upright: "Threes expand the plot—growth, pain, or collaboration becomes visible.",
    reversed: "The triangle fractures—communication, grief, or teamwork snags.",
    crossing: "The crossing is the third point entering—crowd, wound, or result approaching.",
  },
  "4": {
    upright: "Fours rest or consolidate—structure, truce, or inventory.",
    reversed: "Rest becomes cage—boredom, stagnation, or retreat that overstays.",
    crossing: "The crossing is pause with purpose unclear—recovery vs avoidance.",
  },
  "5": {
    upright: "Fives introduce conflict or loss—ego hit, grief, or competition.",
    reversed: "The fight resolves or turns inward—reconciliation, shame, or hollow victory.",
    crossing: "The crossing is the argument on the road—humiliation, exile, or rivalry active.",
  },
  "6": {
    upright: "Sixes tilt toward harmony or return—nostalgia, generosity, victory in sight.",
    reversed: "Charity sours or memory lies—strings attached, clinging, empty win.",
    crossing: "The crossing is almost home—help offered, past visiting, transition unfinished.",
  },
  "7": {
    upright: "Sevens test nerve—strategy, faith, or defiance under uncertainty.",
    reversed: "Strategy leaks—self-doubt, paranoia, or retreat from the long game.",
    crossing: "The crossing is the long shot in play—bluff, vigilance, or endurance tested.",
  },
  "8": {
    upright: "Eights accelerate—movement, mastery, or pressure intensifies.",
    reversed: "Motion jams—scattered force, delayed news, or power misused.",
    crossing: "The crossing is momentum with friction—messages, work, or will crossing paths.",
  },
  "9": {
    upright: "Nines near completion—anxiety, satisfaction, or solitary vigil.",
    reversed: "The finish line wavers—nightmares, regret, or relief blocked.",
    crossing: "The crossing is the last mile emotional—almost done, not at peace yet.",
  },
  "10": {
    upright: "Tens culminate the suit—burden, family, or end of a cycle.",
    reversed: "Culmination breaks—overload, fracture, or refusal to put the bundle down.",
    crossing: "The crossing is the weight of the ending—responsibility heavy, exit near.",
  },
  page: {
    upright: "Pages are messages and apprenticeships—curiosity, study, fresh angle.",
    reversed: "The student stumbles—immaturity, blocked news, or self-sabotaged learning.",
    crossing: "The crossing is the herald at the gate—news arriving, role not embodied.",
  },
  knight: {
    upright: "Knights charge—pursuit, campaign, or conflict in motion.",
    reversed: "The charge falters—haste, cynicism, or stalled crusade.",
    crossing: "The crossing is the rider on the road—passion moving, steering uncertain.",
  },
  queen: {
    upright: "Queens mature the suit—receptive mastery, care, inner authority.",
    reversed: "Mastery clouds—smothering, insecurity, or wisdom withheld.",
    crossing: "The crossing is sovereignty forming—presence tested, throne not final.",
  },
  king: {
    upright: "Kings govern the suit—command, stewardship, public consequence.",
    reversed: "Command warps—tyranny, rigidity, or abdication.",
    crossing: "The crossing is the ruler’s judgment on the path—law offered, realm unsettled.",
  },
};

function hook(rank: Rank, mode: keyof (typeof RANK_HOOK)["ace"]): string {
  return RANK_HOOK[rankKey(rank)]?.[mode] ?? RANK_HOOK.ace![mode];
}

function pipApplies(
  card: TarotCard,
  pip: MinorPipSource,
  meta: SuitMeta,
  mode: "upright" | "reversed",
): string {
  const kw = mode === "upright" ? pip.biddyUpright : pip.biddyReversed;
  return `In ${meta.domain}, the ${card.classicName} often appears when ${kw.toLowerCase()} is the live issue—not background noise. Watch one arena (work, body, bond, or belief) where the ${meta.element} element is loudest this week.`;
}

export function buildMinorUpright(
  card: TarotCard,
  pip: MinorPipSource,
  meta: SuitMeta,
): ReadingText {
  const custom = pip.vertical?.upright;
  const defaultDetail = `Traditionally upright, the ${card.classicName} emphasizes ${pip.biddyUpright.toLowerCase()} (Biddy Tarot / Rider–Waite line). ${hook(card.rank, "upright")} ${pipApplies(card, pip, meta, "upright")} ${meta.lens} This pip is immediate weather in the ${meta.quantum} suit—not a fate card, but a precise pressure you can respond to while it is active.`;
  const defaultGuidance = `Name what you want from this ${meta.element} domain in one sentence. Take one step aligned with the upright keyword—not habit, audience, or old defense. ${hook(card.rank, "upright")} If outcomes matter, set a check-in within seven days rather than assuming the energy will stay.`;
  return {
    summary: `${card.quantumName} (${card.classicName}) — ${pip.biddyUpright}. ${hook(card.rank, "upright")}`,
    detail: custom?.detail ?? defaultDetail,
    guidance: custom?.guidance ?? defaultGuidance,
  };
}

export function buildMinorReversed(
  card: TarotCard,
  pip: MinorPipSource,
  meta: SuitMeta,
): ReadingText {
  const custom = pip.vertical?.reversed;
  const defaultDetail = `Traditionally reversed, the ${card.classicName} signals ${pip.biddyReversed.toLowerCase()} (Biddy Tarot). Reversal may block, delay, internalize, or invert the upright lesson depending on context—not a universal “bad” pole. ${hook(card.rank, "reversed")} ${pipApplies(card, pip, meta, "reversed")} ${meta.lens} Ask whether the lesson is private (inner correction) or public (behavior others can name).`;
  const defaultGuidance = `Slow the reaction. Correct dosage: less force where gentleness restores flow, more honesty where silence bred confusion. ${hook(card.rank, "reversed")} One conversation or one boundary, proportionate to the pip—avoid both dramatic purge and polite denial.`;
  return {
    summary: `Reversed, ${card.quantumName} — ${pip.biddyReversed}. ${hook(card.rank, "reversed")}`,
    detail: custom?.detail ?? defaultDetail,
    guidance: custom?.guidance ?? defaultGuidance,
  };
}

export function enrichMinorLateral(
  base: ReadingText,
  card: TarotCard,
  pip: MinorPipSource,
  meta: SuitMeta,
  pole: "transverse" | "conjugate",
): ReadingText {
  const kw =
    pole === "transverse" ? pip.biddyUpright : pip.biddyReversed;
  const poleLabel =
    pole === "transverse"
      ? "Transverse names the first lateral crossing—this pip blocking or stretching the path while its upright lesson is still unfolding."
      : "Conjugate names the second lateral face—drawn from this pip’s reversed keyword cluster, not “more reversed” than vertical inversion.";

  return {
    summary: base.summary,
    detail: `${base.detail} ${poleLabel} ${hook(card.rank, "crossing")} ${pipApplies(card, pip, meta, pole === "transverse" ? "upright" : "reversed")} Biddy anchor for this face: ${kw}. ${meta.lens}`,
    guidance: `${base.guidance} Keep the reading concrete: one person, one deadline, one body signal. Revisit after the crossing shifts—lateral poles change faster than major archetypes.`,
  };
}
