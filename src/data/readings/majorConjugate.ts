import type { ReadingText } from "../../types/reading";

/**
 * Conjugate pole: second lateral face per card (see docs/ORIENTATION_RESEARCH.md).
 * Derived from each major’s traditional reversed / crossing themes — not a global
 * “wrong flank” algorithm. Pair with transverse in majorContent.ts.
 */
export const MAJOR_CONJUGATE: Record<string, ReadingText> = {
  "major-00": {
    summary:
      "Conjugate Observer—recklessness crosses the path, or control masquerades as caution.",
    detail:
      "Traditional Fool reversed names two distinct blocks: holding back, and reckless risk-taking (Biddy Tarot). Where transverse often marks the cliff’s edge without commitment, conjugate names the active crossing: you may leap without regard for consequence—partners, money, or body dragged into the experiment—or tighten control until spontaneity dies. The white dog’s loyalty cannot guide you if you sprint past it. This is not generic “bad timing”; it is the Fool’s own shadow as obstacle.",
    guidance:
      "Before a leap, name who shares the fall. If you have been frozen, distinguish prudence from fear—then move once, measurably.",
  },
  "major-01": {
    summary:
      "Conjugate Catalyst—manipulation or misdirected craft crosses the work.",
    detail:
      "Magician reversed traditionally includes manipulation and poor planning, beside untapped talent (Biddy). Conjugate is the table used for persuasion, not creation: words without follow-through, tools for image, catalyst aimed at the wrong reaction. The crossing is ethical—skill without honest aim. Quantumally, the apparatus runs but transformation serves a hidden aim.",
    guidance:
      "Deliver one promised outcome before new promises. If influence feels slick, ask what cannot be said aloud.",
  },
  "major-02": {
    summary:
      "Conjugate Superposition—the veil pressed from outside—demand to decide before ready.",
    detail:
      "This is not High Priestess reversed (inner disconnect, intuition drowned, secrets spilled by you). Conjugate is the second lateral crossing: the world knocks on the temple—deadlines, interrogations, partners insisting on an answer, gossip seeking what was held in confidence, or hot takes that force symbolic material into verdicts before it ripens. RW’s scroll and veil are for study, not extraction under glare. Superposition is collapsed by external vector, not because inner signal failed.",
    guidance:
      "Name what is being demanded and by whom. Buy time ethically; share one bounded truth without full collapse. Restore privacy after the push.",
  },
  "major-03": {
    summary:
      "Conjugate Field—dependence or smothering crosses growth.",
    detail:
      "Empress reversed: creative block and dependence on others (Biddy). Conjugate is nurture turned binding—giving to be needed, comparison that poisons soil, or consuming comfort without refill. The Field still holds life, but the crossing is relational: growth choked by who tends it and why.",
    guidance:
      "Separate care from control. Restore your own nourishment before tending another plot.",
  },
  "major-04": {
    summary:
      "Conjugate Constant—domination or brittle order crosses the realm.",
    detail:
      "Emperor reversed: domination, excessive control, lack of discipline, inflexibility (Biddy). Conjugate is authority as obstacle—rules without soul, punishment dressed as protection, or chaos where structure was owed. The throne blocks the road when fear governs the ram.",
    guidance:
      "One rule softened, one boundary enforced—both in proportion. Lead by example, not surveillance.",
  },
  "major-05": {
    summary:
      "Conjugate Axiom—hollow tradition or rebellion without ground crosses belief.",
    detail:
      "Hierophant reversed (Biddy): personal beliefs, freedom, challenging the status quo—you are your own teacher; wisdom sought within rather than from external approval alone. RW shows two followers initiated, keys at his feet for conscious/subconscious balance, Papal Cross raised—conjugate is the wrong doorway: hollow conformity (ritual without heart, group identity without conscience) or rebellion without grammar (iconoclasm that leaves no ethics). Biddy warns of running on autopilot, questioning whether ‘how we do things’ matches your values, and performative breaks with parents or authorities. Distinct from transverse corridor between teachings: conjugate is an active false exit—mentors misread, communities used to avoid inner work.",
    guidance:
      "Examine inherited rules against lived values. If you leave a tradition, name what replaces it—practice, mentor, or axiom you can keep. Keep the moral lesson; drop performance.",
  },
  "major-06": {
    summary:
      "Conjugate The Entangled—values misaligned; disharmony crosses the bond.",
    detail:
      "Lovers reversed: self-love needed, disharmony, imbalance, misalignment of values (Biddy). Conjugate is the crossing in relationship—promises out of phase, ethics announced but not lived, triangulation. Correlation here is noisy, not intimacy.",
    guidance:
      "Write what you will not compromise. One conversation that names misalignment before ritual.",
  },
  "major-07": {
    summary:
      "Conjugate Trajectory—opposition and fractured will cross the chariot.",
    detail:
      "Chariot reversed: self-discipline issues, opposition, lack of direction (Biddy). Conjugate is conflict on the road—sphinxes pulling apart, campaigns that burn fuel sideways. Motion without vector becomes the obstacle itself.",
    guidance:
      "Resolve one opposition before accelerating. Align inner yes/no before outer speed.",
  },
  "major-08": {
    summary:
      "Conjugate Coherence—self-doubt or raw force crosses gentle strength.",
    detail:
      "Strength reversed: inner strength tested, self-doubt, low energy, raw emotion (Biddy). Conjugate is resonance mistuned—lion ungentle, lamb unheard. The crossing is somatic: force when patience would move more, collapse when speech is owed.",
    guidance:
      "Regulate breath before the hard talk. One boundary with warmth, not armor.",
  },
  "major-09": {
    summary:
      "Conjugate Soliton—isolation crosses the lantern path.",
    detail:
      "Hermit reversed: isolation, loneliness, withdrawal (Biddy). Conjugate is exile without insight—cave as punishment, or company that prevents one true thought. The stable pulse never forms because solitude and noise alternate without choice.",
    guidance:
      "Choose retreat or return for seven days. Carry one question; return with one sentence of answer.",
  },
  "major-10": {
    summary:
      "Conjugate Phase Wheel—resistance to the turn crosses fate.",
    detail:
      "Wheel reversed: bad luck, resistance to change, breaking cycles poorly (Biddy). Conjugate is fighting the spoke—clinging to peak identity, humiliation without lesson, luck blamed for habit. The crossing is temporal: you refuse the phase you are already in.",
    guidance:
      "Act from the sector you occupy, not the one you mourn. Release one identity whose season ended.",
  },
  "major-11": {
    summary:
      "Conjugate Symmetry—unfairness or dishonesty crosses justice.",
    detail:
      "Justice reversed: unfairness, lack of accountability, dishonesty (Biddy). Conjugate is the tilted scale—contracts as weapons, prejudice, apology that extracts. The crossing is legal-moral: truth deferred until cost lands elsewhere.",
    guidance:
      "List facts before narrative. If you judge, place your weight on the scale in writing.",
  },
  "major-12": {
    summary:
      "Conjugate Inverted Frame—stalling without surrender crosses the pause.",
    detail:
      "Hanged Man reversed: delays, resistance, stalling, indecision (Biddy)—distinct from willing suspension upright. Conjugate is pose without revelation—suffering displayed, help refused, lesson known but unintegrated. The crossing is stuckness, not sacred invert.",
    guidance:
      "End performance of pause. One action that breaks the hang, even if insight is partial.",
  },
  "major-13": {
    summary:
      "Conjugate Entropy—resistance to necessary ending crosses transition.",
    detail:
      "Death reversed: resistance to change, inner purging incomplete (Biddy). Conjugate is the corpse cherished—role, story, or object kept past honesty. The crossing is thermodynamic: energy spent preserving a closed chapter.",
    guidance:
      "Name what ended. One ritual of release before recruiting new life into old shape.",
  },
  "major-14": {
    summary:
      "Conjugate Mixer—imbalance and excess cross temperance.",
    detail:
      "Temperance reversed: imbalance, excess, re-alignment needed (Biddy). Conjugate is wrong recipe—splash not blend, binge after restriction, diplomacy that dodges truth. The angel’s flow chokes on one cup dominating.",
    guidance:
      "Separate incompatible inputs for a week. One measured pour; observe before mixing again.",
  },
  "major-15": {
    summary:
      "Conjugate Bound State—loose chains worn anyway; shadow defended.",
    detail:
      "The Devil upright: attachment, addiction, shadow self (Biddy); RW shows loose collars the figures could remove. Conjugate crossing is bondage chosen—‘no control’ performed while payoff remains. Instant gratification sells long-term wellbeing (Biddy). Bound State deepens: you orbit the well because escape energy goes to drama, not exit.",
    guidance:
      "Name the payoff of staying bound. Remove one access point; tell one witness the truth about the chain.",
  },
  "major-16": {
    summary:
      "Conjugate Cascade Failure—denial of cracks crosses the structure.",
    detail:
      "Tower reversed: fear of change, averting disaster while facade holds (Biddy). Conjugate is lightning deferred—secrets, brittle pride, rebuild on fault. The crossing is preventable strike ignored until narrative breaks.",
    guidance:
      "Repair one known crack. Speak one truth before weather chooses the hour.",
  },
  "major-17": {
    summary:
      "Conjugate Guiding Quanta—despair and disconnection cross hope.",
    detail:
      "Star reversed: lack of faith, despair, self-trust lost, disconnection (Biddy). Conjugate is the beam refused—you pour for others while starving, or cynicism masks grief after Tower. The crossing is spiritual dehydration, not absence of stars.",
    guidance:
      "Receive one kindness without explaining it away. Rest before you guide.",
  },
  "major-18": {
    summary:
      "Conjugate Dark Sector—inner confusion; buried emotion crosses the path.",
    detail:
      "Moon reversed: release of fear possible, but also repressed emotion, inner confusion, misread intuition (Biddy). Conjugate is the crayfish pulled under—projecting history onto neutral facts, psychic noise obeyed over evidence, jealousy and rumor as navigation. Distinct from transverse half-light: here the crossing is active mis-reading of the dark.",
    guidance:
      "Verify one fear against daylight. Dream journal without ultimatums from symbols alone.",
  },
  "major-19": {
    summary:
      "Conjugate Full Emission—joy blocked; wounded inner child crosses radiance.",
    detail:
      "Sun reversed: inner child hurt, feeling down, overly optimistic bypass (Biddy). Conjugate is occlusion—shame after visibility, warmth refused, performance of joy. The crossing is not dim dawn but refusal to stand in earned light.",
    guidance:
      "Body first: sleep, food, sun. Honor one accomplishment your critic denies.",
  },
  "major-20": {
    summary:
      "Conjugate Measurement—self-doubt; ignored call crosses judgement.",
    detail:
      "Judgement reversed: self-doubt, inner critic, ignoring the call (Biddy). Conjugate is trumpet heard as attack—verdict without amends, or accountability dodged through spiritual language. The crossing is vocational: you measure others and exempt yourself.",
    guidance:
      "One proportionate amend. Answer the muted call with a dated action, not a vow.",
  },
  "major-21": {
    summary:
      "Conjugate Closed System—short-cuts and refusal of closure cross completion.",
    detail:
      "World reversed: seeking personal closure, short-cuts, delays (Biddy). Conjugate is the last five percent sabotaged—perfectionism, new project to avoid grief of ending, external done / internal leaking. The wreath is near but uncrossed.",
    guidance:
      "Finish one visible loose end. Let a witness see completion without apology.",
  },
};
