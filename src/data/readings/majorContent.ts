import type { ReadingText } from "../../types/reading";

type Orientations = {
  upright: ReadingText;
  reversed: ReadingText;
};

/**
 * Each entry starts from standard Rider-Waite / traditional tarot meaning,
 * then reframes it through this card’s quantum name and theme.
 */
export const MAJOR_CONTENT: Record<string, Orientations> = {
  "major-00": {
    upright: {
      summary:
        "The Observer steps onto the path without a fixed outcome—pure potential before the first measurement.",
      detail:
        "In traditional tarot, The Fool marks beginnings, trust, and the courage to start before you have all the answers. As The Observer, you are invited to treat life as an open experiment rather than a solved equation. This is not recklessness for its own sake; it is willingness to learn in public, to be changed by what you discover, and to carry only what you truly need. Relationships, work, and inner growth all benefit when you admit you do not yet know the final state—and move anyway.",
      guidance:
        "Take one concrete step toward something new while staying honest about what you do not know. Pack light emotionally: release one assumption that keeps you frozen.",
    },
    reversed: {
      summary:
        "The wave fails to collapse—hesitation, denial, or leaps without grounding.",
      detail:
        "Fool reversed in Biddy Tarot names two distinct failures, not one generic ‘bad start’: holding back from fear of the unknown, and reckless risk-taking with disregard for consequence. Rider–Waite keeps the cliff, the white dog, and the light pack—the lesson is at the edge, not in the meadow. As The Observer reversed, measurement goes wrong: you force a collapse before context is gathered, or you refuse to observe at all and call that wisdom. Fear may dress as prudence—postponing a move, relationship, or creative birth because identity feels safer in the old story. The flip side is impulsivity dressed as freedom—partners, budgets, or health dragged into an ‘experiment’ without consent, the loyal dog left behind while you sprint. Spontaneity without feedback becomes avoidance of responsibility; control without curiosity becomes a cage. In work, the pitch ships before the prototype; in love, commitment is promised in spirit but avoided in calendar; in inner life, you perform openness while dodging the one question that would change the reading.",
      guidance:
        "Pause before a big commitment, but set an end date on the pause so it is a decision, not drift. Name one ignored risk and one overstated fear on paper. If you are leaping, list who shares consequences and what you will measure in seven days. If you are frozen, run one small, reversible trial—one conversation, one application, one hour of honest inventory—instead of an all-or-nothing gamble.",
    },
  },
  "major-01": {
    upright: {
      summary:
        "The Catalyst aligns will, skill, and tools—what you focus on can be brought into form.",
      detail:
        "The Magician traditionally signifies resourcefulness, communication, and translating vision into action—all tools on the table. As The Catalyst, you spark change through sequenced catalysis: knowledge, speech, timing, and craft acting on what is possible. Intention is the first spark; discipline is the second. This card favors launches, pitches, teaching, and recommitment to work that channels energy rather than leaking it.",
      guidance:
        "Define one outcome for two weeks. Gather literal tools—time, words, materials—and apply them in one focused session.",
    },
    reversed: {
      summary:
        "Catalyst misapplied—scattered talent, manipulation, or plans without execution.",
      detail:
        "Magician reversed signals blocked channel, trickster shadow, or confidence without substance. The Catalyst sequence is wrong: you have pieces but not order, or you persuade without delivering. Ideas stay in superposition forever—never measured into action.",
      guidance:
        "Simplify to one priority. Cancel a focus-draining commitment. Lead with evidence, not charm.",
    },
  },
  "major-02": {
    upright: {
      summary:
        "The Superposition favors stillness, intuition, and knowledge beneath the surface.",
      detail:
        "The High Priestess traditionally governs mystery, inner knowing, cycles, and what is not yet spoken—the veil between seen and unseen. As The Superposition, multiple truths coexist in probability until observation collapses them into words. Dreams, body signals, and quiet pattern recognition outweigh loud opinion now. Forcing premature clarity destroys information. This supports study, spiritual practice, therapy, and discernment over speed.",
      guidance:
        "Reduce noise: less scrolling, more listening. Record dreams or hunches. Before a hard conversation, sit with what you already know but have not admitted.",
    },
    reversed: {
      summary:
        "Superposition collapsed from within—intuition lost, secrecy twisted.",
      detail:
        "High Priestess reversed traditionally: disconnected from intuition, secrets, withdrawal (Biddy)—the vertical invert. You may drown inner signal in noise, perform mystery without depth, or spill what needed containment. This is not the same as transverse (valid inner pause) or conjugate (outer world forcing an answer). Reversed is your relationship to the veil broken from inside.",
      guidance:
        "Reduce destabilizing input. Name one truth you avoid. Rebuild intuition before major contracts.",
    },
  },
  "major-03": {
    upright: {
      summary:
        "The Field is fertile—creation, nurture, and abundance want expression.",
      detail:
        "The Empress traditionally embodies growth, sensuality, comfort, and generative nature—the fertile sovereign of embodiment. As The Field, you cultivate the medium in which life grows: beauty, food, art, parenting, gardens, teams. A field is not one plant but the conditions for many. This favors pleasure with consent, rest with rhythm, projects that ripen over seasons. Force harvest too early and you uproot what needed more time.",
      guidance:
        "Tend something living. Invest in comfort that sustains, not escapes. Create before you critique.",
    },
    reversed: {
      summary:
        "The Field parched or flooded—neglect, smothering, or creative drought.",
      detail:
        "Empress reversed: dependency, comparison, self-care collapse, overgiving without refill. The Field cannot yield if you starve it—or if you drown seedlings with control. Examine performed abundance masking depletion.",
      guidance:
        "Restore basics: sleep, food, movement. Set one time boundary. Delegate if you absorb every need.",
    },
  },
  "major-04": {
    upright: {
      summary:
        "The Constant offers structure, sovereignty, and a stable reference frame.",
      detail:
        "The Emperor traditionally represents authority, strategy, boundaries, fathering in the broad sense—the throne earned by protection, not ornament. As The Constant, you provide a reference frame others can navigate by: rules that protect, decisions that hold, architecture legal/financial/emotional that survives stress. Constants are not frozen; they are reliable. This supports order after chaos, leadership that structures rather than dominates for vanity.",
      guidance:
        "Make one postponed decision. Document agreements. Strengthen a boundary that benefits everyone long-term.",
    },
    reversed: {
      summary:
        "The Constant warps—tyranny, rigidity, or abdicated authority.",
      detail:
        "Emperor reversed: micromanagement, brittle control, or chaos from refusing to govern yourself. The reference frame tilts—people navigate by fear, or there is no frame and predation enters. Power without empathy burns trust.",
      guidance:
        "Ask if control is fear. If passive too long, take one lawful action to restore order.",
    },
  },
  "major-05": {
    upright: {
      summary:
        "The Axiom points to tradition, teaching, and shared systems of meaning.",
      detail:
        "The Hierophant traditionally symbolizes institutions, mentorship, spiritual lineage, conventional wisdom—the bridge between mystery and teachable form. As The Axiom, shared assumptions make community possible: rituals, ethics, grammar of the sacred. Axioms are not prisons when chosen consciously; they are starting equations you may extend. Formal study, elders, rites of passage are favored—learn the rules before you rewrite them.",
      guidance:
        "Seek teacher, text, or practice with depth. Join community aligned with your ethics. Teach only what you have earned.",
    },
    reversed: {
      summary:
        "Axioms challenged—dogma, hollow ritual, or rebellion without compass.",
      detail:
        "Hierophant reversed: breaking harmful rules or breaking rules from fear of belonging. The equation no longer fits lived truth. Distinguish liberation from contrarianism; leave institutions with clarity, not spite.",
      guidance:
        "Question one inherited belief. Keep moral core; discard performance. If you teach, invite dialogue.",
    },
  },
  "major-06": {
    upright: {
      summary:
        "The Entangled highlights union, values aligned, and choices of the heart.",
      detail:
        "The Lovers traditionally concern partnership, ethics in love, meaningful choice—not only romance but values made visible. As The Entangled, states correlate: what you admire or resent in another may be coupled to your own configuration. Distance does not always decouple—patterns repeat until observed. This favors honest attraction, conscious commitment, integrating head with heart before you sign the contract.",
      guidance:
        "State values before negotiating. Have the postponed conversation. Choose alignment over convenience.",
    },
    reversed: {
      summary:
        "The Entangled strained—disharmony, secrecy, or self-betrayal for approval.",
      detail:
        "Lovers reversed: breakup energy, triangulation, split between paths unable to commit. The bond decoheres—perhaps needed, perhaps avoided. Name what staying divided protects you from facing.",
      guidance:
        "Stop triangulating. Set a deadline if choice is due. Repair with one specific apology or boundary.",
    },
  },
  "major-07": {
    upright: {
      summary:
        "The Trajectory advances—will, victory, and disciplined forward motion along a chosen vector.",
      detail:
        "The Chariot traditionally signifies triumph through focus, opposing forces mastered, and travel or progress—the driver holds reins over instinct and pavement. As The Trajectory, your life has a direction again: momentum is not noise but vector, the sum of choices pointing somewhere. Competing pulls can be yoked if you steer deliberately. Relocation, campaigns, competition, and ambitious projects are supported when ethics stay in the frame—speed without integrity leaves debris on the road. Physics reminds you: work depends on path; fighting lateral drag drains the same fuel that could move you forward.",
      guidance:
        "Write the destination in plain language. Remove one distraction that pulls you off-axis. Celebrate a win, then aim the next push along the same vector.",
    },
    reversed: {
      summary:
        "The Trajectory scatters—braking and accelerating at once, or refusing to move.",
      detail:
        "Chariot reversed traditionally signals lost direction, aggression without strategy, or stalemate from stubbornness. The Trajectory breaks: you may fight on too many fronts, confuse motion with progress, or stall from spite. Internal roadblocks—fear, unprocessed anger—steer from the back seat. Fuel burns while the odometer barely moves.",
      guidance:
        "Stop until you can name where you are going. Identify whether the block is skill, fear, or a goal you no longer want. Take one small leg of the journey only.",
    },
  },
  "major-08": {
    upright: {
      summary:
        "Coherence is quiet power—inner phases aligned under stress.",
      detail:
        "Strength traditionally is fortitude, gentle mastery of instinct, and influence without domination—the lion met without cruelty. As Coherence, mind and body, passion and restraint oscillate in phase rather than cancel. You can hold intensity without shattering: healing, regulating fear, leading through steadiness. In groups, coherent presence calms decoherence in others. This is not suppression; it is tuned resonance—power that does not need to shout because it is not fighting itself.",
      guidance:
        "Respond rather than react. Use breath, movement, animals, or art to restore phase alignment. Persist with soft firmness; let others feel your calm before your argument.",
    },
    reversed: {
      summary:
        "Decoherence—self-doubt, repression, or raw impulse shatters the center.",
      detail:
        "Strength reversed traditionally marks self-doubt, explosive anger, or numbing. Coherence fails: signals interfere—people-pleasing warps with control, appetite with shame. You may feel weak when you are only out of tune, or loud when you mistake volume for strength. Rebuild phase alignment in small, repeatable proofs.",
      guidance:
        "Shrink today's challenge to a winnable size. Seek support if shame isolates you. One regulated hour counts more than a dramatic vow.",
    },
  },
  "major-09": {
    upright: {
      summary:
        "The Soliton carries truth through noise—a stable pulse in solitary travel.",
      detail:
        "The Hermit traditionally signifies introspection, withdrawal for wisdom, and guidance earned through solitude—the lantern is earned, not borrowed. As The Soliton, you are a wave that keeps its shape while crossing disturbance: stepping back clarifies what crowds obscured. In physics a soliton persists without spreading into chaos; here, one insight, ethic, or question remains sharp while life gets loud. Mentors may appear as inner voice rather than external hero. This favors sabbatical, research, grief processing, and any honest inventory that requires distance from performance.",
      guidance:
        "Take solitude without punishment. Reduce commitments that exist only to avoid hearing yourself. Answer one question you have been outsourcing to opinion polls.",
    },
    reversed: {
      summary:
        "The Soliton disperses—isolation turns bitter, or retreat is refused when needed.",
      detail:
        "Hermit reversed can be loneliness, hiding, or spiritual bypassing dressed as wisdom. Without a stable inner signal, solitude becomes echo chamber or exile. Conversely, you may refuse necessary pause, letting noise destroy the one insight you needed to carry. Loud company cannot replace honest inventory.",
      guidance:
        "If stranded, reach for one healthy connection. If over-socialized, cancel plans and listen for the signal under the static.",
    },
  },
  "major-10": {
    upright: {
      summary:
        "The Phase Wheel turns—cycles, fate, and turning points you cannot fully freeze.",
      detail:
        "Wheel of Fortune traditionally marks luck, destiny, and change beyond total control—the wheel lifts some, lowers others, teaches humility at the rim. As the Phase Wheel, you occupy a sector in motion whether you cooperate or not: seasons of career, health, reputation, and inner weather rotate. Upswings invite gratitude and preparation, not arrogance; downswings invite resilience, not identity collapse. Physics offers the humbling image: phases repeat; interference patterns shift. Your task is to dance with period, not pretend you own the axle.",
      guidance:
        "Do not cling to a peak or dramatize a valley. Invest when up; learn when down. Notice repeating patterns—you may be circling the same lesson in new costumes.",
    },
    reversed: {
      summary:
        "Fighting the wheel—resistance to change, bad timing, or blame disguised as fate.",
      detail:
        "Wheel reversed often signals resisting inevitabilities, clinging to expired luck, or learned helplessness. The Phase Wheel jams when you deny rotation: superstition without reflection, or agency refused because randomness once hurt you. Break the spell without denying real constraints.",
      guidance:
        "Change one habit that perpetuates the loop. Accept what is not yours to steer; act where your hand actually touches the rudder.",
    },
  },
  "major-11": {
    upright: {
      summary:
        "Symmetry demands truth, accountability, and proportion restored.",
      detail:
        "Justice traditionally governs law, ethics, cause and effect, and decisions that must be seen clearly—the sword points up, the scales level. As Symmetry, imbalance seeks correction: contracts, courts, karma, and honest self-assessment. What was distorted—favoritism, self-deception, exploitation—cannot hold once the mirror is flat. This card is less about punishment than about making the equation true so everyone knows the terms.",
      guidance:
        "Document facts before story. Make amends where owed. If deciding for others, remove personal bias as if you were an impartial observer.",
    },
    reversed: {
      summary:
        "Symmetry broken—bias, dishonesty, or evaded consequences warp the scale.",
      detail:
        "Justice reversed signals injustice external or internal: rationalized harm, refusal to see your part, systems rigged against you. The mirror tilts. Repair begins by naming asymmetry without melodrama—who gained unfairly, who paid unfairly, what you will do about your slice of it.",
      guidance:
        "Consult an impartial ally. If wronged, gather evidence calmly. If you wronged, act before you are forced—symmetry restored by choice costs less than by verdict.",
    },
  },
  "major-12": {
    upright: {
      summary:
        "Inverted Frame suspends the usual view—surrender that recalibrates perspective.",
      detail:
        "The Hanged Man traditionally indicates voluntary pause, sacrifice of control, enlightenment through reversal—the figure sees the world upside down by choice. As Inverted Frame, you change reference coordinates: what looked like loss may be data, waiting becomes active if it alters how you measure success. Not all problems are solved by pushing harder; some yield when you stop forcing the old basis. Spiritual and creative breakthroughs often arrive here, after ego releases its grip on timing.",
      guidance:
        "Stop forcing the obsolete method. Offer help without resentment. Let insight arrive; write it before you snap back to the old angle.",
    },
    reversed: {
      summary:
        "The frame stuck—martyrdom, performative pause, or refusal to pivot.",
      detail:
        "Hanged Man reversed warns stalling masquerading as wisdom, suffering for applause, or refusing necessary sacrifice. Inverted Frame without insight is just hanging—if nothing internal shifts, the pause has become avoidance. Set a limit on suspension.",
      guidance:
        "Give your waiting an end date. Take one action that breaks the pose. Ask whether you are holy or simply stuck.",
    },
  },
  "major-13": {
    upright: {
      summary:
        "Entropy closes one ordered chapter so the universe can move on—not annihilation, but irreversible change.",
      detail:
        "Death in traditional tarot is transformation, endings, and the harvest of what is finished—rarely literal death. The skeleton and scythe are memento mori: everything structured eventually yields. Reframed as Entropy, the emphasis shifts from drama to physics: closed systems trend toward disorder; what was tightly organized—habits, roles, relationships, identities—releases energy when it finally lets go. You cannot unscramble the egg. That is not cruelty; it is the law that makes room for new configurations. Grief still belongs here—you are watching useful order dissipate. But fighting every loss wastes the heat you could carry into the next experiment. In love or work, something has completed its arc; clinging preserves a façade of form after the function has changed.",
      guidance:
        "Identify what is finished versus what is merely uncomfortable. Mark the ending cleanly—conversation, ritual, archived files—so you are not maintaining ghost order. Before rebuilding, rest in the open state; new structure needs honest ground.",
    },
    reversed: {
      summary:
        "You resist the inevitable dissipation—false permanence, stalled transition, or denial of what has already unraveled.",
      detail:
        "Death reversed traditionally signals resistance to necessary endings, or change frozen mid-passage. Through Entropy, the shadow is the fantasy of perpetual stability: reheating the same closed loop, policing disorder with control, or mourning a past layout while refusing to spend the energy elsewhere. Half-alive arrangements—jobs, bonds, stories—consume vitality keeping entropy at bay. Sometimes reversal also means local reordering is possible: you are rebuilding discipline after chaos; discern whether you are healing structure or denying the scythe.",
      guidance:
        "Name what you are afraid will scatter if you stop gripping it. Take one irreversible step toward closure or toward honest renewal—not both at once. If exhausted, you may be spending all your energy on thermodynamic denial.",
    },
  },
  "major-14": {
    upright: {
      summary:
        "The Mixer harmonizes opposites—patience, moderation, and healing blend.",
      detail:
        "Temperance traditionally shows an angel blending waters between cups—alchemy, integration, and sane proportion. As The Mixer, you reconcile forces that felt incompatible: head and heart, ambition and rest, two families of obligation, or recovery and ambition. This is not bland neutrality; it is skilled combination that creates a third quality neither side held alone. Diplomacy, therapy, collaborative art, and harm-reduction approaches thrive. Rushing the blend ruins it; respect timing.",
      guidance:
        "Combine strengths from two sides instead of forcing a winner. Pace yourself—one adjustment per domain at a time. Hydrate, literally and metaphorically; restore flow before you scale.",
    },
    reversed: {
      summary:
        "The Mixer overflows—excess, impatience, incompatible elements forced together.",
      detail:
        "Temperance reversed: binge and purge, zealotry, conflict without repair. You pour reactants that explode, then call it synthesis. False balance performs calm while resentment ferments—no third substance forms, only foam.",
      guidance:
        "Remove one excess this week. Apologize where tone fractured harmony. Step back from mediating until neutral.",
    },
  },
  "major-15": {
    upright: {
      summary:
        "The Bound State—confined by bonds you have mistaken for identity.",
      detail:
        "The Devil in traditional tarot is not only malevolence; it is bondage, appetite, material fixation, and the shadow bargain—chains that hang loose in Rider–Waite because you could remove them (Biddy: shadow self, attachment, addiction). Etymologically, diabolos means “one who throws across,” a divider: you are separated from freedom, integrity, or sobriety by a story that says you cannot leave. As The Bound State, that separation is the physics image: a system trapped in a configuration that is stable but not free. In quantum terms, a bound state is localized—held by the potential unless enough energy arrives to break loose. Addiction, shame, debt, status games, or intensity mistaken for love can all be bound states: familiar, low-energy, and mistaken for the only possible ground. Awareness does not ionize you instantly, but it shows the chains were never welded.",
      guidance:
        "Name the bond in plain words—what you get from staying bound and what it costs. Reduce access to triggers. Ask for help; escaping a bound state takes real energy, not shame.",
    },
    reversed: {
      summary:
        "Ionization—breaking bonds, truth-telling, or recovery gaining energy.",
      detail:
        "Devil reversed traditionally signals liberation: seeing through illusion, ending toxic contracts, refusing the old hook. The Bound State gains enough energy to become unbound—honesty about desire, debt, or codependency; leaving the cult of comfort. You may still feel backward pull; transition states are messy. Freedom is not mood; it is a different configuration.",
      guidance:
        "Celebrate one refusal of the old bargain. Reinforce boundaries daily. Do not romanticize the bound state because unbound life feels unfamiliar.",
    },
  },
  "major-16": {
    upright: {
      summary:
        "Cascade Failure shatters false towers—sudden clarity through upheaval.",
      detail:
        "The Tower traditionally depicts lightning striking a crown tower—revelation, disruption, and structures that cannot stand on false foundations. As Cascade Failure, what was unstable falls so a truer architecture can remain. Shock is real: job loss, exposed secrets, health alarms, or beliefs that collapse overnight. The card is not punishment for living—it is physics catching up with denial. After impact, prioritize safety and honest inventory. Rebuilding on ornament before structure is tested invites repeat lightning.",
      guidance:
        "Prioritize physical and emotional safety first. Tell the truth quickly to people who must act on it. Rebuild minimally—one load-bearing habit, one honest ally—before decoration.",
    },
    reversed: {
      summary:
        "Cascade delayed or internalized—cracks ignored, shock absorbed in silence.",
      detail:
        "Tower reversed: dodging necessary collapse, facades holding while structure weakens. Cascade Failure postponed is not prevented—stress accumulates offstage. Sometimes reversal means integrating after the strike; discern avoidance from recovery.",
      guidance:
        "Inspect aestheticized cracks. Make one repair before weather turns. Seek skilled support if trauma surfaces.",
    },
  },
  "major-17": {
    upright: {
      summary:
        "The Guiding Quanta restore hope—healing, inspiration, and gentle direction.",
      detail:
        "The Star traditionally follows upheaval with faith, renewal, and naked authenticity—often depicted as water poured onto land and pool, one foot in each realm. As Guiding Quanta, you are invited to pour energy back into the long game: creative work, service, recovery programs, spiritual practice, or mentorship that outlasts mood. Hope here is not naive; it is calibrated after weathering the Tower. Vulnerability without spectacle heals—you do not need an audience to be sincere. This card favors transparency about wounds that are closing, and generosity that does not bankrupt you.",
      guidance:
        "Share one true thing with someone safe. Commit to a simple regimen—walk, hydration, prayer, studio hour—that rebuilds trust in tomorrow. Donate skill, not only sympathy.",
    },
    reversed: {
      summary:
        "Guiding Quanta dim—despair, cynicism, or burnout after giving light away.",
      detail:
        "Star reversed: hope mocked to preempt disappointment, healing compared unfavorably, wellness performed while starving inside. The quanta are not gone—you stopped receiving your own beam. Burnout from pouring without refill is common after Tower or Moon passages.",
      guidance:
        "One kind act today, including toward yourself. Limit voices that ridicule sincerity. Let returning inspiration be quiet before you announce it.",
    },
  },
  "major-18": {
    upright: {
      summary:
        "The Dark Sector rules dreams, mystery, and the unconscious tide.",
      detail:
        "The Moon traditionally governs illusion, anxiety, intuition, and the territory where reason alone cannot navigate. In classic imagery, the path between twin towers leads past a dog and wolf toward distant peaks—instinct and wildness escort you through twilight. As the Dark Sector, not everything is as it seems: projections, incomplete information, and emotional undertow may color work, love, or health. This is not a verdict of danger so much as a reminder that you are moving by feeling and symbol. Psychic sensitivity heightens; dreams, moods, and synchronicities speak loudly. Test hunches against evidence, but do not flatten the symbolic layer into cynicism. In love, attraction may be layered with fantasy; in career, agendas may be hidden; with money, verify before you commit. The task is to sit with uncertainty without forcing premature answers.",
      guidance:
        "Keep a dream log for two weeks. Before major decisions, write what you fear and what you hope—see which is evidence-based. Walk familiar routes with attention; reduce stimulation at night. Ask one trusted person to reality-check a story you keep retelling.",
    },
    reversed: {
      summary:
        "Fog lifts—secrets surface, confusion eases, nightmares lose grip.",
      detail:
        "Reversed, the Moon’s fog thins: deceptions may be exposed, self-gaslighting ends, or anxiety that swelled in the dark returns to proportion. You may finally name what frightened you, receive an honest answer, or stop chasing phantoms in a situation that was never as catastrophic as it felt at 3 a.m. Sometimes reversal instead marks refusal to face truth—clarity offered but declined—so check whether you are integrating insight or dodging it. When integration is real, shame about past confusion can dissolve; you see how fear distorted neutral facts.",
      guidance:
        "State the fear in plain language on paper. Verify one rumor or assumption before acting. If nightmares persist, address body safety and sleep hygiene first—clarity is physical as well as mental.",
    },
  },
  "major-19": {
    upright: {
      summary:
        "Full Emission—joy, vitality, success, and radiant clarity.",
      detail:
        "The Sun traditionally shows a child on a white horse beneath a radiant sun—celebration, vitality, truth visible, and life force without guile. As Full Emission, warmth is shareable: achievements acknowledged, creative work seen, holidays with chosen family, leadership that does not need masks. Shame shrinks in this light; you are allowed to be uncomplicatedly glad. In readings, it often follows confusion (Moon) or upheaval (Tower), signaling that clarity and energy return. Avoid performative positivity—this is embodied brightness, not a slogan.",
      guidance:
        "Express openly what you have completed. Play in a way that feels childlike, not escapist. Let success be witnessed without apology or immediate next mountain.",
    },
    reversed: {
      summary:
        "Emission blocked or scattered—confidence dimmed, joy delayed, ego burned.",
      detail:
        "Sun reversed: temporary gloom, difficulty receiving good news, shame after visibility. Full Emission is occluded—not extinguished. Old scripts say you do not deserve warmth; weather passes, source remains.",
      guidance:
        "Restore body first—sleep, food, actual sunlight. Celebrate privately if needed. Name one accomplishment your critic erases.",
    },
  },
  "major-20": {
    upright: {
      summary:
        "The Measurement calls you to awakening, reckoning, and answered vocation.",
      detail:
        "Judgement traditionally shows figures rising at a trumpet’s call—review, forgiveness, vocation, and the moment you respond to what life has taught. As The Measurement, you weigh who you were against who you are becoming without cruel distortion. Apologies offered and received, announcements that change lineage, second chances with terms, and spiritual wake-ups belong here. This is not petty scoring; it is alignment between conscience and action. You may feel summoned to a role—parent, artist, whistleblower, healer—that fits your scars and gifts.",
      guidance:
        "Answer the call you keep muting with one concrete step. Forgive to be free, not to erase accountability. If you owe amends, name the harm specifically before asking trust back.",
    },
    reversed: {
      summary:
        "Self-judgment harsh or avoided—hearing the call but not responding.",
      detail:
        "Reversed, guilt paralyzes or evaluation is refused. You may hear the trumpet and cover your ears, or judge yourself so harshly that movement stops. Cynicism about redemption—yours or others’—stalls growth. Sometimes this is protective delay; still, the measurement will return.",
      guidance:
        "Separate remorse from punishment. Take one step toward amends proportionate to the harm. If you are waiting for perfect readiness, ship imperfect honesty instead.",
    },
  },
  "major-21": {
    upright: {
      summary:
        "The Closed System completes a cycle—wholeness inside a finished boundary.",
      detail:
        "The World traditionally is fulfillment, travel’s end, mastery, cosmic yes—the dancer inside the wreath, four corners witnessed. As the Closed System, a chapter completes with dignity: exchanges with the outside world taper; what mattered is now internalized. In thermodynamic terms, you have returned to equilibrium after work was done—lessons from the entire journey (Observer through Entropy, Tower through Measurement) are conserved inside the boundary. Celebration is appropriate because the orbit finished, not because you will never move again. The next cycle will open the system anew; for now, honor closure.",
      guidance:
        "Mark completion visibly—ritual, announcement, rest. Share credit. Plan the next orbit from wisdom, not restlessness that fears stillness.",
    },
    reversed: {
      summary:
        "Closure incomplete—loose ends, fear of arrival, or refusal to step inside success.",
      detail:
        "World reversed traditionally signals almost there: paperwork, visas, self-sabotage, perfectionism blocking the last five percent. The Closed System leaks—energy disperses because you will not seal the chapter. You may be free in fact but not in identity.",
      guidance:
        "Finish the last visible step. Release the fantasy that another achievement will finally make you allowed to rest.",
    },
  },
};
