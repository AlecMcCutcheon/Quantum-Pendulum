import type { MinorLateralMap } from "./types";

/** Biddy Tarot Suit of Cups keywords + per-pip lateral research. */
export const CUPS_LATERAL: MinorLateralMap = {
  "cups-ace": {
    biddyUpright: "Love, new relationships, compassion, creativity",
    biddyReversed: "Self-love, intuition, repressed emotions",
    transverse: {
      summary:
        "Transverse Singularity—cup overflows; feeling offered, bond not sealed.",
      detail:
        "Ace of Cups upright: divine love beginning, emotional spring (Biddy). Transverse crossing is the heart opening—compassion rising, relationship or art not yet in form.",
      guidance:
        "Receive feeling without forcing shape. Create one honest expression.",
    },
    conjugate: {
      summary:
        "Conjugate—repressed emotion crosses the spring.",
      detail:
        "Reversed Ace: self-love work, repressed emotions (Biddy). The crossing dams the cup—love present but unspoken, creativity blocked by uncried tears.",
      guidance:
        "Move emotion through body. One safe person or page for truth.",
    },
  },
  "cups-02": {
    biddyUpright: "Unified love, partnership, mutual attraction",
    biddyReversed: "Self-love, break-ups, disharmony, distrust",
    transverse: {
      summary:
        "Transverse Pair—attraction mutual; contract still forming.",
      detail:
        "Two of Cups upright: meeting, reciprocity (Biddy). Transverse is partnership crossing—chemistry visible, trust still calibrating.",
      guidance:
        "Name reciprocity you need. One vulnerable exchange without scorekeeping.",
    },
    conjugate: {
      summary:
        "Conjugate—disharmony and distrust cross union.",
      detail:
        "Reversed Two: break-ups, disharmony, distrust (Biddy). The crossing splits the chalice—mirrors misaligned, love questioned.",
      guidance:
        "Address distrust with specifics, not surveillance. Self-love if union is done.",
    },
  },
  "cups-03": {
    biddyUpright:
      "Celebration, friendship, creativity, collaborations",
    biddyReversed:
      "Independence, alone time, hardcore partying, three's a crowd",
    transverse: {
      summary:
        "Transverse Triplet—friendship lifts; third presence unsettled.",
      detail:
        "Three of Cups upright: communal joy (Biddy). Transverse crossing is celebration in motion—collaboration fertile, roles still sorting.",
      guidance:
        "Celebrate without excess. Include the quiet friend.",
    },
    conjugate: {
      summary:
        "Conjugate—three's a crowd or isolation crosses joy.",
      detail:
        "Reversed Three: independence, alone time, or three's a crowd (Biddy). The crossing is triangulation—party that excludes, or loneliness amid noise.",
      guidance:
        "Choose intimacy or crowd deliberately. Exit performative fun.",
    },
  },
  "cups-04": {
    biddyUpright:
      "Meditation, contemplation, apathy, reevaluation",
    biddyReversed: "Retreat, withdrawal, checking in for alignment",
    transverse: {
      summary:
        "Transverse Quartet—offer ignored; contemplation crosses the mood.",
      detail:
        "Four of Cups upright: reevaluation, apathy toward new cup (Biddy). Transverse is emotional pause crossing—you are asked to look inward before accepting more.",
      guidance:
        "Sit with what feels flat. Decline one distraction; notice hidden offer.",
    },
    conjugate: {
      summary:
        "Conjugate—withdrawal without alignment crosses feeling.",
      detail:
        "Reversed Four: retreat, withdrawal (Biddy). The crossing is numb escape—not sacred pause but disengagement that deepens thirst.",
      guidance:
        "Distinguish retreat from avoidance. One alignment check-in with body.",
    },
  },
  "cups-05": {
    biddyUpright:
      "Regret, failure, disappointment, pessimism",
    biddyReversed: "Personal setbacks, self-forgiveness, moving on",
    transverse: {
      summary:
        "Transverse Quintet—mourning the spill; two cups still behind you.",
      detail:
        "In Rider–Waite, the cloaked figure fixates on three overturned cups while two remain upright behind—classic ‘focus on loss, miss remaining resource’ (Biddy: regret, disappointment). Transverse crossing is active grief: failure feels total while recovery is spatially present but not yet turned toward. Waves pool at the feet; the wave has not chosen whether to keep mourning or receive what still stands.",
      guidance:
        "Honor what spilled without denying the two cups. Turn physically—literally change view—before you decide the story is finished.",
    },
    conjugate: {
      summary:
        "Conjugate—pessimism as habit crosses moving on.",
      detail:
        "Reversed Five of Cups invites self-forgiveness and moving on (Biddy). Conjugate is the crossing when release is refused—staying cloaked, rehearsing setback, or performing recovery before grief lands. The lesson is not ‘cheer up’; it is that identity fused to disappointment blocks the upright cups from refilling.",
      guidance:
        "One grief session with a timer; then one action toward the standing cups—call, walk, apology, or creation.",
    },
  },
  "cups-06": {
    biddyUpright:
      "Revisiting the past, childhood memories, innocence, joy",
    biddyReversed:
      "Living in the past, forgiveness, lacking playfulness",
    transverse: {
      summary:
        "Transverse Sextet—memory crosses the present road.",
      detail:
        "Six of Cups upright: nostalgia, innocence exchanged (Biddy). Transverse is the past as crossing—kindness from history visiting, not yet integrated.",
      guidance:
        "Receive a gift from memory. Ask what belongs now vs then.",
    },
    conjugate: {
      summary:
        "Conjugate—living in the past crosses joy.",
      detail:
        "Reversed Six: living in the past, lacking playfulness (Biddy). The crossing traps you in childhood story—comfort that prevents adult love.",
      guidance:
        "Thank the past; act as adult you. Play once in present tense.",
    },
  },
  "cups-07": {
    biddyUpright:
      "Opportunities, choices, wishful thinking, illusion",
    biddyReversed:
      "Alignment, personal values, overwhelmed by choices",
    transverse: {
      summary:
        "Transverse Septet—many cups on the table; desire unfocused.",
      detail:
        "Seven of Cups upright: fantasy options (Biddy). Transverse crossing is illusion buffet—opportunities vivid, values not yet sorting signal from mirage.",
      guidance:
        "Limit options to three. Sleep before you vow.",
    },
    conjugate: {
      summary:
        "Conjugate—overwhelmed by choices crosses clarity.",
      detail:
        "Reversed Seven: alignment work, overwhelmed by choices (Biddy). The crossing is paralysis by fantasy—you know values but drown in images.",
      guidance:
        "Write top three values. Eliminate one cup that violates them.",
    },
  },
  "cups-08": {
    biddyUpright:
      "Disappointment, abandonment, withdrawal, escapism",
    biddyReversed:
      "Trying one more time, indecision, aimless drifting, walking away",
    transverse: {
      summary:
        "Transverse Octet—walking away begun; shore still in sight.",
      detail:
        "Eight of Cups upright: leaving incomplete cups (Biddy). Transverse is departure crossing—disappointment named, path away opening, not finished.",
      guidance:
        "Confirm what you leave and why. Travel light.",
    },
    conjugate: {
      summary:
        "Conjugate—aimless drift crosses decisive walk.",
      detail:
        "Reversed Eight: indecision, drifting, or walking away unresolved (Biddy). The crossing is half-exit—escapism without meaning, or return loop.",
      guidance:
        "Choose leave or stay for one month. Stop haunting the shore.",
    },
  },
  "cups-09": {
    biddyUpright:
      "Contentment, satisfaction, gratitude, wish come true",
    biddyReversed:
      "Inner happiness, materialism, dissatisfaction, indulgence",
    transverse: {
      summary:
        "Transverse Nonet—wish forming; satisfaction not yet embodied.",
      detail:
        "Nine of Cups upright: emotional wish, smug contentment (Biddy). Transverse crossing is pleasure approaching—gratitude building, wish not fully lived.",
      guidance:
        "Enjoy without entitlement. Share one portion of luck.",
    },
    conjugate: {
      summary:
        "Conjugate—dissatisfaction or indulgence crosses contentment.",
      detail:
        "Reversed Nine: inner happiness vs materialism, dissatisfaction, indulgence (Biddy). The crossing is empty feast—comfort that does not nourish, or greed for more.",
      guidance:
        "Ask if you are full or stuffed. Simplify one indulgence.",
    },
  },
  "cups-10": {
    biddyUpright:
      "Divine love, blissful relationships, harmony, alignment",
    biddyReversed:
      "Disconnection, misaligned values, struggling relationships",
    transverse: {
      summary:
        "Transverse Decet—rainbow over home; harmony near, stress tests ahead.",
      detail:
        "Ten of Cups upright: family bliss, emotional completion (Biddy). Transverse is communal love crossing—alignment visible, daily proof still assembling.",
      guidance:
        "Tend the small ritual that holds family. Do not perform perfection.",
    },
    conjugate: {
      summary:
        "Conjugate—misaligned values cross domestic peace.",
      detail:
        "Reversed Ten: disconnection, struggling relationships (Biddy). The crossing cracks the rainbow—values diverge, love strained under the same roof.",
      guidance:
        "Name the misalignment. One repair conversation before symbolic exit.",
    },
  },
  "cups-page": {
    biddyUpright:
      "Creative opportunities, intuitive messages, curiosity, possibility",
    biddyReversed:
      "New ideas, doubting intuition, creative blocks, emotional immaturity",
    transverse: {
      summary:
        "Transverse Initiate—intuitive splash; message half-read.",
      detail:
        "Page of Cups upright: fish from cup, curious art (Biddy). Transverse crossing is soft news arriving—imagination stirred, maturity catching up.",
      guidance:
        "Record the odd dream or idea. Respond with play, not panic.",
    },
    conjugate: {
      summary:
        "Conjugate—doubting intuition crosses the page.",
      detail:
        "Reversed Page: doubting intuition, creative blocks, immaturity (Biddy). The crossing mocks the message—you dismiss sensitivity as childish.",
      guidance:
        "Test intuition with one small action. Apologize if moodiness hurt someone.",
    },
  },
  "cups-knight": {
    biddyUpright:
      "Creativity, romance, charm, imagination, beauty",
    biddyReversed:
      "Overactive imagination, unrealistic, jealous, moody",
    transverse: {
      summary:
        "Transverse Propagator—romance approaches; heart in motion.",
      detail:
        "Knight of Cups upright: romantic offer (Biddy). Transverse is the suitor crossing—charm real, follow-through still proving.",
      guidance:
        "Enjoy poetry; verify consistency. Offer beauty without manipulation.",
    },
    conjugate: {
      summary:
        "Conjugate—jealousy and moodiness cross romance.",
      detail:
        "Reversed Knight: unrealistic fantasy, jealous, moody (Biddy). The crossing is fairy-tale crash—white horse, unstable rider.",
      guidance:
        "Ground one romantic claim in behavior. Regulate mood before ultimatums.",
    },
  },
  "cups-queen": {
    biddyUpright:
      "Compassionate, caring, emotionally stable, intuitive, in flow",
    biddyReversed:
      "Inner feelings, self-care, self-love, co-dependency",
    transverse: {
      summary:
        "Transverse Eigenstate—empathy deep; boundaries still tuning.",
      detail:
        "Queen of Cups upright: intuitive care (Biddy). Transverse crossing is mature feeling arriving—compassion strong, vessel not yet sealed.",
      guidance:
        "Care without absorbing. Water your own cup first.",
    },
    conjugate: {
      summary:
        "Conjugate—co-dependency crosses sovereignty.",
      detail:
        "Reversed Queen: self-care needed, co-dependency (Biddy). The crossing merges you with others' storms—healing given, self lost.",
      guidance:
        "Return one emotion to its owner. Schedule self-care as appointment.",
    },
  },
  "cups-king": {
    biddyUpright:
      "Emotionally balanced, compassionate, diplomatic",
    biddyReversed:
      "Self-compassion, inner feelings, moodiness, emotionally manipulative",
    transverse: {
      summary:
        "Transverse Sovereign—calm sea ruled; undercurrents present.",
      detail:
        "King of Cups upright: diplomatic mastery (Biddy). Transverse is emotional authority crossing—balance shown, depth still moving below.",
      guidance:
        "Lead with calm truth. Hold space without controlling outcomes.",
    },
    conjugate: {
      summary:
        "Conjugate—manipulation or moodiness cross diplomacy.",
      detail:
        "Reversed King: moodiness, emotional manipulation (Biddy). The crossing is king tides—feelings weaponized, calm performed while resentful.",
      guidance:
        "Name your feeling before strategy. Refuse to fish with guilt.",
    },
  },
};
