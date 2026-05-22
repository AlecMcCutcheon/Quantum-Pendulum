import type { ReadingText } from "../../types/reading";

type Expand = { detail?: string; guidance?: string };

function append(base: ReadingText, extra: Expand): ReadingText {
  return {
    summary: base.summary,
    detail: extra.detail ? `${base.detail} ${extra.detail}` : base.detail,
    guidance: extra.guidance
      ? `${base.guidance} ${extra.guidance}`
      : base.guidance,
  };
}

/** Second-pass substance from docs/ORIENTATION_RESEARCH.md §3 — merged at build time. */
const TRANSVERSE_EXPAND: Record<string, Expand> = {
  "major-00": {
    detail:
      "RW imagery matters: cliff, white dog, light pack—the crossing is at the edge, not in the meadow. Relationship and career readings often show a visible opportunity with invisible commitment; the obstacle is naming which fear is yours versus inherited.",
    guidance:
      "Tell one ally what you are postponing. If you choose wait, make it a decision with an end date—not drift.",
  },
  "major-01": {
    detail:
      "The Magician’s table is not empty—you may be over-equipped and under-aimed. In creative work this is the pitch deck without prototype; in spirituality, technique without sincerity.",
    guidance:
      "Sequence operators: intent, then tool, then measurement. Discard one clever trick that does not serve the aim.",
  },
  "major-02": {
    detail:
      "Between the pillars, the scroll is yours to read when ready. Health readings favor rest and cycle-tracking; legal readings favor silence until counsel—not secrecy from cowardice, but timing.",
    guidance:
      "If pressured to decide, offer a bounded update, not full disclosure. Restore sleep before you interpret symbols.",
  },
  "major-03": {
    detail:
      "Fallow is not failure—the Empress reversed cluster includes dependence and comparison, but transverse here is pause. Projects ripen underground; forcing harvest uproots roots.",
    guidance:
      "Nourish the body that will create later. Say no to one performance of abundance.",
  },
  "major-04": {
    detail:
      "Throne forming can look like imposter syndrome in leaders or children testing new rules at home. The crossing is legitimacy negotiated, not denied.",
    guidance:
      "Publish one rule and one mercy. Accept that authority feels awkward before it feels natural.",
  },
  "major-05": {
    detail:
      "Corridor between teachings shows in deconstruction phases—leaving a faith, a field, or a political tribe without a replacement yet. Anxiety is normal; false certainty would be worse.",
    guidance:
      "Keep a private notebook of what still rings true. Avoid debating before you can articulate your own axiom.",
  },
  "major-06": {
    detail:
      "Chemistry with open terms appears in almost-relationships, co-founder handshakes, or values alignment before merger. The crossing is ethical visibility before contract.",
    guidance:
      "Write non-negotiables. Ask one question you have been romanticizing away.",
  },
  "major-07": {
    detail:
      "Engine without map is common in hustle culture—metrics up, meaning flat. The chariot’s sphinxes are not yoked; wins in one lane fund losses in another.",
    guidance:
      "Cancel one commitment that does not point toward the written destination. Rest is part of steering.",
  },
  "major-08": {
    detail:
      "Training arc crossing: therapy early, leadership under fire, recovery regimens. Coherence is forming—do not confuse fragility with unfitness.",
    guidance:
      "Log one moment you regulated instead of exploded. Strength is proven in repetition, not declaration.",
  },
  "major-09": {
    detail:
      "Partial pilgrimage: remote work from the cabin, sabbatical days in a busy job, caregiver solitude. Insight forms when the lantern moves, not only when you arrive.",
    guidance:
      "Protect two hours weekly without performance. Return with one sentence others can use.",
  },
  "major-10": {
    detail:
      "Hinge seasons: promotion letter pending, diagnosis in review, reputation shifting. You feel the spoke move—do not spend identity before the wheel lands.",
    guidance:
      "Strengthen buffers without catastrophizing. Avoid vows made in vertigo.",
  },
  "major-11": {
    detail:
      "Trial in progress suits disputes, audits, and conscience reviews. Symmetry is approaching—act as if the scale will soon be public.",
    guidance:
      "Behave transparently with allies. Do not destroy evidence of good faith.",
  },
  "major-12": {
    detail:
      "Chosen invert supports sabbatical, perspective shift in grief, or creative breakthrough via surrender. Different from martyrdom: you should feel insight accumulating.",
    guidance:
      "Set an end to suspension. One act of service without resentment tests whether pause is holy or stuck.",
  },
  "major-13": {
    detail:
      "Chrysalis crossing: divorce papers drafted, role ending, identity molting. Discomfort is phase change—grief and relief may alternate hourly.",
    guidance:
      "Tend sleep and food. Do not demand the next chapter’s title while the old one is still dissolving.",
  },
  "major-14": {
    detail:
      "Blend underway: blended families, medication adjustments, long therapy arcs. The angel pours between cups—ratio matters more than speed.",
    guidance:
      "Change one ingredient at a time. Stress-test harmony under mild conflict before you announce peace.",
  },
  "major-15": {
    detail:
      "Metastable bond: almost leaving addiction, affair, debt spiral, or status game. RW chains are loose—awareness flickers before energy to exit.",
    guidance:
      "Pre-write your refusal script. Remove one trigger from arm’s reach tonight.",
  },
  "major-16": {
    detail:
      "Pre-strike: cracks in trust, structural debt, health warnings. Lightning has not struck—use the interval to reinforce or evacuate honestly.",
    guidance:
      "Back up documents and relationships. Have the conversation you deferred.",
  },
  "major-17": {
    detail:
      "Fragile recovery after Tower or Moon—hope real, navigation incomplete. Pouring water is gentle regimen, not spectacle.",
    guidance:
      "Measure progress in weeks. Let someone witness small restoration without grading it.",
  },
  "major-18": {
    detail:
      "Half-light path: projection, rumor, incomplete labs, attraction layered with fantasy. Symbols are loud—verify before irreversible contracts.",
    guidance:
      "Reality-check with a grounded ally. Track mood across two weeks before major commits.",
  },
  "major-19": {
    detail:
      "Dawn bend: optimism rising, outcomes approaching. Not zenith—impatience can waste the recovery arc.",
    guidance:
      "Keep habits that brought light. Share good news with someone free of envy.",
  },
  "major-20": {
    detail:
      "Audit approaching: vocation felt, identity updating, amends forming. Trumpet heard—answer not yet spoken aloud.",
    guidance:
      "Draft the response. Resolve one small debt before formal reckoning.",
  },
  "major-21": {
    detail:
      "Graduation adjacent: visa pending, launch done internally, grief under celebration. Honor ending without launching distraction from feeling.",
    guidance:
      "Rest intentionally. One witness hears what you completed.",
  },
};

const CONJUGATE_EXPAND: Record<string, Expand> = {
  "major-00": {
    detail:
      "Reckless leap vs control-as-caution are Fool-specific—partners and budgets dragged into ‘experiments’ without consent, or prudence that kills aliveness. The dog cannot guide if you sprint past it.",
    guidance:
      "If leaping, name who shares consequences. If frozen, run one reversible trial.",
  },
  "major-01": {
    detail:
      "Manipulation crossing: slick influence, tools on wrong problem, quantum apparatus serving hidden aim. Ethical breach, not mere disorganization.",
    guidance:
      "Ship one honest deliverable before new promises. Ask what cannot be said aloud.",
  },
  "major-02": {
    detail:
      "External collapse: deadlines, interrogations, partners demanding verdicts, gossip mining secrets. Scroll studied under glare, not ripeness.",
    guidance:
      "Buy time ethically. One bounded truth; restore privacy after.",
  },
  "major-03": {
    detail:
      "Smothering or dependence crosses growth—giving to be needed, comparison poisoning soil. Field alive but relational pattern chokes.",
    guidance:
      "Nourish yourself first. Separate care from control in one relationship.",
  },
  "major-04": {
    detail:
      "Domination or brittle order—punishment as protection, chaos where structure was owed. Fear on the throne blocks the road.",
    guidance:
      "Soften one rule; enforce one boundary—both proportionate.",
  },
  "major-05": {
    detail:
      "Biddy reversed deepens: you may reject rigid structures and dogma while reclaiming personal power—test ideas you were taught as ‘truth,’ including anti-institutional reflex that still borrows its shape from what it hates. RW Hierophant between temple pillars is not the Priestess’s veil: this crossing is social initiation gone wrong—belonging without belief, or belief without belonging.",
  },
  "major-06": {
    detail:
      "Misaligned values, triangulation, promises out of phase. Noisy correlation mistaken for intimacy.",
    guidance:
      "Write non-negotiables. Name misalignment before ritual deepens it.",
  },
  "major-07": {
    detail:
      "Opposition on the road—sphinxes pull apart, fuel burned sideways. Motion without vector is the obstacle.",
    guidance:
      "Resolve one opposition before accelerating. Inner yes/no before outer speed.",
  },
  "major-08": {
    detail:
      "Resonance mistuned—force when patience would move, collapse when speech is owed. Somatic crossing.",
    guidance:
      "Regulate breath before hard talk. One warm boundary.",
  },
  "major-09": {
    detail:
      "Exile without insight—noise and solitude alternate without choice. Lantern path blocked.",
    guidance:
      "Choose retreat or return for seven days. Return with one sentence of answer.",
  },
  "major-10": {
    detail:
      "Fighting the spoke—clinging to peak identity, luck blamed for habit. Temporal refusal.",
    guidance:
      "Act from the sector you occupy. Release one expired identity.",
  },
  "major-11": {
    detail:
      "Unfairness or dishonesty crosses—bias, evaded consequences, rigged systems. Mirror tilted.",
    guidance:
      "Gather facts calmly. Repair your slice of asymmetry without melodrama.",
  },
  "major-12": {
    detail:
      "Martyrdom or stalling without insight—suffering for applause, pause that avoids pivot. Hanging without learning.",
    guidance:
      "End date on suspension. One action that breaks the pose.",
  },
  "major-13": {
    detail:
      "Resistance to ending or frozen mid-passage—ghost order, thermodynamic denial. Half-alive arrangements consume vitality.",
    guidance:
      "Name what you fear will scatter. One irreversible step toward closure or honest renewal.",
  },
  "major-14": {
    detail:
      "Excess or incompatible mix—reactants that explode, performed calm while resentment ferments. No third substance.",
    guidance:
      "Remove one excess. Apologize where tone fractured harmony.",
  },
  "major-15": {
    detail:
      "Chain defended or shame bond—loose RW chains gripped anyway. Stable low-energy mistaken for only ground.",
    guidance:
      "Name payoff of staying bound. One daily refusal of the old bargain.",
  },
  "major-16": {
    detail:
      "Denial until strike—facades hold, stress offstage. Postponed cascade not prevented.",
    guidance:
      "Inspect cracks. One repair before weather turns.",
  },
  "major-17": {
    detail:
      "Cannot receive healing—hope mocked, beam poured outward only. Burnout after giving light away.",
    guidance:
      "One kind act toward yourself. Limit voices that ridicule sincerity.",
  },
  "major-18": {
    detail:
      "Projection or mis-read intuition—fear scripted onto neutral facts, psychic noise preferred to body signal. Crossing confuses symbol with verdict.",
    guidance:
      "Separate fear from evidence on paper. Address sleep and safety first.",
  },
  "major-19": {
    detail:
      "Joy blocked or performative—inner child wounded, shame after visibility. Emission occluded, not gone.",
    guidance:
      "Body first: sleep, food, sunlight. Name one accomplishment critics erase.",
  },
  "major-20": {
    detail:
      "Trumpet muted—self-judgment paralyzes or call refused. Cynicism about redemption stalls growth.",
    guidance:
      "Ship imperfect honesty. One proportionate amend.",
  },
  "major-21": {
    detail:
      "Last five percent sabotage—perfectionism, loose ends, fear of arrival. System leaks because chapter won’t seal.",
    guidance:
      "Finish the visible last step. Allow rest without starting a rival project.",
  },
};

export function enrichMajorTransverse(
  id: string,
  base: ReadingText,
): ReadingText {
  const extra = TRANSVERSE_EXPAND[id];
  return extra ? append(base, extra) : base;
}

export function enrichMajorConjugate(id: string, base: ReadingText): ReadingText {
  const extra = CONJUGATE_EXPAND[id];
  return extra ? append(base, extra) : base;
}

/** Expand thin vertical majors (guidance/detail) where below peer substance. */
const VERTICAL_EXPAND: Record<
  string,
  Partial<Record<"upright" | "reversed", Expand>>
> = {
  "major-06": {
    upright: {
      detail:
        "RW Lovers imagery is choice under angelic witness—Adam/Eve, mountain between. In business, brand partnerships; in love, defining exclusivity and ethics before chemistry decides for you.",
      guidance:
        "Integrate head and heart before signing. If single, clarify what you are available for.",
    },
    reversed: {
      detail:
        "Triangulation and self-betrayal for approval keep the bond noisy—values announced but not lived. The crossing is ethical debt accruing interest.",
      guidance:
        "Stop triangulating. If a choice is overdue, set a humane deadline. Repair with one specific boundary or apology—not both vague promises.",
    },
  },
  "major-03": {
    upright: {
      guidance:
        "Tend something living weekly. Pleasure with consent; rest with rhythm. Create before you critique the draft.",
    },
    reversed: {
      guidance:
        "Restore body before metaphor. Delegate one task you absorbed to be needed. Comparison is not a growth strategy.",
    },
  },
  "major-02": {
    reversed: {
      guidance:
        "Reduce destabilizing input. Name one truth you avoid. Rebuild intuition before major contracts or public vows.",
    },
  },
  "major-04": {
    reversed: {
      guidance:
        "Ask whether control is fear. If you have abdicated, take one lawful action that restores order without humiliation.",
    },
  },
  "major-05": {
    reversed: {
      guidance:
        "Leave institutions with clarity, not spite. If you teach, invite dissent. One belief updated beats ten performed.",
    },
  },
  "major-01": {
    reversed: {
      guidance:
        "Cancel one distraction. Lead with evidence before charm. The real experiment is the one you finish.",
    },
  },
  "major-11": {
    upright: {
      guidance:
        "If you are the decision-maker, document dissenting views. If wronged, seek remedy without vengeance.",
    },
    reversed: {
      detail:
        "Internal dishonesty counts—rationalized harm, selective memory. External injustice and inner bias may both be present.",
      guidance:
        "Ask what you would accept if roles reversed. Repair proportionally.",
    },
  },
  "major-14": {
    reversed: {
      detail:
        "Binge/purge cycles, forced blend, mediator burnout. Foam is not synthesis.",
      guidance:
        "Remove one reactant from the mix. Rest before mediating again.",
    },
  },
  "major-16": {
    reversed: {
      detail:
        "Internalized lightning—panic without external event, or structural denial while life looks fine.",
      guidance:
        "Invite one honest inspector you trust. Small repairs prevent theatrical collapse.",
    },
  },
  "major-19": {
    reversed: {
      detail:
        "Temporary gloom after visibility, shame about needing joy, burnout from leadership cheer.",
      guidance:
        "Sunlight literally and figuratively. Private celebration is valid.",
    },
  },
  "major-20": {
    upright: {
      guidance:
        "If called to testify, tell the whole truth. If called to heal, accept help.",
    },
  },
  "major-21": {
    reversed: {
      guidance:
        "List loose ends; close one per day for a week. Identity catches up to fact.",
    },
  },
  "major-00": {
    reversed: {
      detail:
        "Health and money readings often show the reversed Fool as ‘almost starting’—visible opportunity, invisible follow-through. The white dog still signals allyship; use one trusted witness before you reframe avoidance as spirituality.",
      guidance:
        "Tell one ally what you are postponing. If you choose wait, calendar the next review—drift is not the same as discernment.",
    },
    upright: {
      detail:
        "Career and creative readings: the Observer favors launches where you admit unknowns aloud—investors, collaborators, and bodies trust honesty more than false certainty.",
    },
  },
};

export function enrichMajorVertical(
  id: string,
  pole: "upright" | "reversed",
  base: ReadingText,
): ReadingText {
  const extra = VERTICAL_EXPAND[id]?.[pole];
  return extra ? append(base, extra) : base;
}
