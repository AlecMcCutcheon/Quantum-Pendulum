export interface MajorVerticalEntry {
  upright?: { detail: string; guidance?: string; summary?: string };
  reversed?: { detail: string; guidance?: string; summary?: string };
}

/**
 * Full vertical copy for major arcana (Rider–Waite / Biddy Tarot research).
 * Replaces thin defaults in majorContent.ts at build time.
 */
export const MAJOR_VERTICAL: Record<string, MajorVerticalEntry> = {
  "major-00": {
    upright: {
      detail:
        "Rider–Waite’s Fool stands at the cliff’s edge, white rose, small pack, white dog at heel, sun behind—beginnings, innocence, spontaneity, free spirit (Biddy). As The Observer, the reading is epistemic: you are before the first measurement, allowed not to know. Traditional tarot honors trust in the path; quantum framing honors that observation changes outcome—so honesty about uncertainty is power, not weakness. The dog is allyship; the pack is what you chose to carry—travel light emotionally. Career: prototype before pitch, apprentice before expert pose. Love: curiosity without contract yet. Health: listen to body as instrument, not verdict. This is not carte blanche for harm—consent and consequence still apply—but paralysis dressed as wisdom is also a choice. The cliff is real; the lesson is that some leaps are experiments with reversible scope.",
      guidance:
        "Take one reversible step toward the new thing. Tell one ally what you do not know yet. Pack light: drop one assumption that only protected image.",
    },
  },
  "major-01": {
    upright: {
      detail:
        "The Magician in Rider–Waite raises the wand to heaven, hand to earth—‘as above, so below’—with cup, sword, pentacle, and wand on the table (Biddy: manifestation, resourcefulness, inspired action, power). As The Catalyst, you have the full toolkit; the work is sequencing catalysis through the right channel. Intention without action leaves reality in superposition; action without intention scatters force. Communication, craft, timing, and ethics are not accessories—they are the transform. This card supports launches, teaching, negotiation, and any season where you must become the person who can hold the outcome. In relationships, words must match follow-through; in money, skill must meet ledger; in spirit, ritual must meet sincerity. The table is not a prop—it is inventory. Inventory honestly before you perform.",
      guidance:
        "Write one outcome for fourteen days. List tools you actually have (time, skills, allies). One focused session that applies a single tool to that outcome—measure result.",
    },
    reversed: {
      detail:
        "Magician reversed traditionally lists manipulation, poor planning, untapped talents, and scattered power (Biddy). As The Catalyst miswired, you may persuade without delivery, collect skills without synthesis, or charm rooms while the real experiment stalls. Trickster shadow is not only malice—it is performance substituting for transformation, secrecy about motives, or using spiritual language to avoid material accountability. Untapped talent hurts because you feel the gap between image and evidence. Poor planning shows up as many tabs, many pitches, no shipped artifact. In love, words outrun behavior; in work, vision decks replace prototypes; in inner life, you study transformation instead of undergoing it. Reversal asks for fewer tricks, clearer aim—what is this energy actually for?",
      guidance:
        "Ship one small proof before the next promise. Cancel one distraction that flatters ego. If influence feels slick, ask what you are avoiding saying aloud.",
    },
  },
  "major-02": {
    upright: {
      detail:
        "The High Priestess sits between pillars, scroll of hidden law, crescent moon at her feet, veil behind (Biddy: intuition, sacred knowledge, divine feminine, subconscious). As The Superposition, multiple truths coexist until you choose observation. Dreams, cycles, somatic signals, and pattern recognition outweigh hot takes now. Forcing premature disclosure collapses information you needed to integrate privately—therapy, creative incubation, grief, and discernment all need the veil. This is not passivity; it is disciplined non-interference with what is still forming. Relationships may require patience before labels; legal or medical paths may need second opinions; spiritual practice favors listening over broadcasting. The scroll is yours to read when ready—not when an audience is bored.",
      guidance:
        "Reduce noise input for seventy-two hours. Record dreams or body signals without editing. Before a hard conversation, write what you already know but have not admitted.",
    },
    reversed: {
      detail:
        "High Priestess reversed: disconnected from intuition, secrets spilled or hoarded wrongly, withdrawal that is not sacred (Biddy). Superposition collapses from inside—you may drown signal in scrolling, perform mystery without depth, or leak confidence to manage anxiety. Secrecy twisted can mean oversharing trauma for intimacy, or hiding what partners need for consent. Withdrawal without practice becomes isolation; intuition without boundaries becomes paranoia. This differs from transverse (legitimate pause) and conjugate (external pressure to decide)—reversed is your relationship to the inner temple broken. Rebuild by restoring rhythm: sleep, moon cycles, honest journaling, one mentor who does not sensationalize.",
      guidance:
        "Name one truth you avoid. Reduce destabilizing feeds. Rebuild intuition before contracts, vows, or public statements you cannot revise.",
    },
  },
  "major-03": {
    upright: {
      detail:
        "The Empress in Rider–Waite is the fertile sovereign—wheat, forest, Venus shield, flowing robe (Biddy: femininity, beauty, nature, abundance, nurturing). As The Field, you tend conditions, not only outcomes: soil, team culture, home, body, creative studio. Abundance is seasonal—plant, tend, harvest, rest. Sensuality with consent, comfort that sustains rather than numbs, and art that ripens are favored. Parenting, gardening, hospitality, and leadership through nurture belong here. Over-control uproots seedlings; neglect parches the plot. Comparison to others’ harvest is poison—your field has its own climate. Enterprise grows when people feel safe enough to create; love deepens when care is reciprocal, not performative.",
      guidance:
        "Tend something living weekly. Invest in comfort that restores (sleep, food, touch, beauty). Create before you critique the draft.",
    },
    reversed: {
      detail:
        "Empress reversed: creative block, dependence, smothering, comparison, self-care collapse (Biddy). The Field floods or dries—overgiving to be needed, or starving the plot while performing abundance on social media. Dependency may be financial, emotional, or aesthetic—living in someone else’s taste. Smothering love confuses control with care. Creative drought often follows harsh inner critic or burnout from carrying everyone’s weather. Reversed asks whether you are cultivating or auditioning for the role of nurturer. Body signals matter: menstrual health, hormones, fatigue—metaphor is not excuse to ignore medicine.",
      guidance:
        "Restore basics before metaphor. Delegate one absorbed task. Separate care from control in one relationship.",
    },
  },
  "major-04": {
    upright: {
      detail:
        "The Emperor on his stone throne, ram heads, scepter and orb, mountains behind (Biddy: authority, structure, control, father figure, stability). As The Constant, you offer a reference frame—rules that protect, decisions that hold, architecture that survives stress. Authority earned by stewardship, not volume: budgets, boundaries, schedules, and truth spoken calmly. This supports recovery after chaos, parenting with consistency, legal clarity, and strategy that names tradeoffs. Constants evolve—this is not rigidity for its own sake—but reliability is the gift. Teams need to know what will not shift weekly; partners need to know where they stand; your inner child needs a grown voice that does not abandon under fire.",
      guidance:
        "Make one postponed decision this week. Document an agreement in writing. Strengthen one boundary that protects everyone long-term.",
    },
    reversed: {
      detail:
        "Emperor reversed: domination, rigidity, lack of discipline, abdication, tyranny in soft voice (Biddy). The Constant warps—micromanagement, brittle rules, or vacuum where leadership was owed. Fear governs the throne: punishment dressed as protection, chaos invited by refusing to govern yourself. Abdication may look like ‘go with the flow’ while resentment builds. In families, either the iron fist or the ghost parent; in work, either bully boss or absent owner. Reversed demands honesty about control: are you gripping from panic, or releasing from laziness? Restore proportion—one mercy, one enforcement.",
      guidance:
        "Ask whether control is fear. If you have abdicated, take one lawful action that restores order without humiliation.",
    },
  },
  "major-05": {
    upright: {
      detail:
        "The Hierophant between pillars, triple crown, crossed keys, two acolytes (Biddy: spiritual wisdom, tradition, conformity, institutions, mentorship). As The Axiom, shared grammar makes community possible—rituals, ethics, lineage, teachable form of mystery. Formal study, rites of passage, and learning rules before you rewrite them are favored. This is not automatic obedience: chosen axioms stabilize the soul. Mentors, texts, and communities aligned with your ethics can save years of wandering. In business, standard operating procedures; in law, precedent; in love, explicit agreements about values. The crossing between personal revelation and public language happens here—find words that do not betray the inner fact.",
      guidance:
        "Seek one teacher, text, or practice with depth. Join community you can respect when tested. Teach only what you have lived.",
    },
    reversed: {
      detail:
        "Hierophant reversed: personal beliefs, freedom, challenging status quo, hollow ritual, rebellion without ethics (Biddy). Axioms crack—institutions may fail you, or you may perform belonging without belief. Liberation is real when you leave harmful rules; contrarianism is hollow when it only defines you by opposition. Running on autopilot in family scripts, workplace cultures, or spiritual cosplay wastes life. Reversed asks: what do you actually practice when no one applauds? If you break with tradition, name the moral core you keep—freedom without grammar becomes noise.",
      guidance:
        "Update one inherited belief with evidence from your life. Leave institutions with clarity, not spite. If you teach, invite dissent.",
    },
  },
  "major-06": {
    upright: {
      detail:
        "Rider–Waite’s Lovers show a man and woman, angel above, sun behind, mountain between—love, harmony, relationships, values alignment, choice (Biddy). As The Entangled, states correlate: attraction reveals configuration; conflict reveals hidden values. This is not only romance—business partners, collaborators, and conscience choices use the same architecture. Chemistry without ethics fails; ethics without chemistry may be friendship, not partnership. The angel witnesses: choices made in awareness bless or haunt. Integrate head and heart before signing—contracts, vows, exclusivity, or merger. In readings about forks, this card names the ethical visible branch versus the convenient one.",
      guidance:
        "State non-negotiable values before negotiating terms. Have the postponed conversation. Choose alignment over convenience.",
    },
    reversed: {
      detail:
        "Lovers reversed: self-love needed, disharmony, imbalance, misalignment of values, breakup energy (Biddy). The Entangled decoheres—triangulation, secrecy, promises out of phase, or self-betrayal for approval. You may stay divided to avoid grief, or perform union while values diverge. Self-love is not narcissism here—it is prerequisite to honest bond. Misalignment may be sexual, financial, spiritual, or logistical; name the axis. Sometimes reversal blesses ending what was mislabeled love. Sometimes it demands repair with specificity, not roses.",
      guidance:
        "Stop triangulating. Write misalignment plainly. Set a humane deadline for choice. One boundary or one apology—specific, not vague.",
    },
  },
  "major-07": {
    upright: {
      detail:
        "The Chariot: armored driver, sphinxes, city behind, wand as will (Biddy: control, willpower, success, action, determination). As The Trajectory, momentum becomes vector—direction plus force. Opposing instincts can be yoked if you steer; otherwise fuel burns in place. Relocation, campaigns, competition, and ambitious projects are supported when integrity stays in frame. Speed without ethics leaves debris; ethics without speed misses the window. Physics reminder: work depends on path—fighting lateral drag wastes the same energy that could move you forward. Celebrate wins, then aim the next push along the same axis.",
      guidance:
        "Write destination in plain language. Remove one distraction from the axle. One win logged, then next leg planned.",
    },
    reversed: {
      detail:
        "Chariot reversed: lack of direction, aggression without strategy, opposition, self-discipline issues (Biddy). Trajectory scatters—busy but not arriving, winning skirmishes while losing war, or stalled from spite. Internal roadblocks—unprocessed anger, fear of success, fear of visibility—steer from back seat. Opposing sphinxes pull apart; partners, teams, or inner parts fight the driver. Reversed is not ‘never travel’—it is fix the map before pressing accelerator.",
      guidance:
        "Stop until you can name where you are going. Identify block: skill, fear, or unwanted goal. One small leg only, after alignment.",
    },
  },
  "major-08": {
    upright: {
      detail:
        "Strength shows a woman gently closing a lion’s jaws, infinity above, flowers and landscape (Biddy: courage, persuasion, influence, compassion, inner strength). As Coherence, passion and restraint oscillate in phase—power without cruelty, influence without domination. You can hold intensity without shattering: regulating fear, leading through steadiness, healing through presence. In groups, coherent calm reduces panic contagion. This is not suppression—it is tuned resonance. Animals, breath, movement, and art restore phase alignment. Sexuality, appetite, and anger are energies to integrate, not exile.",
      guidance:
        "Respond rather than react today. Use breath or movement before hard talk. Persist with soft firmness—let calm land first.",
    },
    reversed: {
      detail:
        "Strength reversed: self-doubt, raw emotion, weakness felt, inner strength untested (Biddy). Coherence fails—people-pleasing fights control, appetite fights shame, volume mistaken for power. You may feel weak when out of tune, or loud when fragile. Rebuild with small repeatable proofs: one boundary kept, one apology made, one hour regulated. Seek support if shame isolates you—decoherence is not identity.",
      guidance:
        "Shrink challenge to winnable size. One regulated hour beats dramatic vow. Ask for help if isolation deepens.",
    },
  },
  "major-09": {
    upright: {
      detail:
        "The Hermit stands on a peak, lantern, staff, snow (Biddy: soul-searching, introspection, being alone, inner guidance). As The Soliton, insight keeps shape crossing noise—withdrawal clarifies what crowds obscured. Sabbatical, research, grief inventory, and spiritual honesty favor this card. The lantern is earned: you are not borrowing another’s map. Mentors may appear as inner voice. Solitude is method, not punishment—tell one ally you are excavating so isolation does not become exile.",
      guidance:
        "Block protected alone time. Reduce performative commitments. Answer one question you outsourced to polls.",
    },
    reversed: {
      detail:
        "Hermit reversed: loneliness, isolation, withdrawal refused, paranoia, spiritual bypass (Biddy). Soliton disperses—cave without insight, or noise without pause. Loneliness differs from chosen retreat; check which you have. Refusing needed pause destroys the one insight you needed. Loud company cannot replace inventory. Bypass uses wisdom vocabulary to avoid feeling.",
      guidance:
        "If stranded, one healthy connection. If over-socialized, cancel plans and listen. Choose retreat or return for seven days—deliberately.",
    },
  },
  "major-10": {
    upright: {
      detail:
        "Wheel of Fortune: sphinx, tetramorph, rising and falling figures (Biddy: good luck, karma, life cycles, destiny, turning point). As the Phase Wheel, you occupy a moving sector—career seasons, health chapters, reputation tides. Upswings invite gratitude and preparation, not arrogance; downswings invite resilience, not identity collapse. You cannot freeze the axle; you can learn the period. Patterns repeat until observed—same lesson, new costume. Humility at the rim is wisdom.",
      guidance:
        "Do not cling to peak or dramatize valley. Invest when up; learn when down. Note one repeating pattern.",
    },
    reversed: {
      detail:
        "Wheel reversed: bad luck, resistance to change, breaking cycles poorly, clinging to expired fortune (Biddy). Fighting the wheel wastes energy—superstition without reflection, or agency refused because randomness once hurt. Learned helplessness and blame-as-fate stall growth. Sometimes reversal means you are re-entering a cycle consciously—discern healing from repetition compulsion.",
      guidance:
        "Change one habit feeding the loop. Act where your hand touches rudder; release what you cannot steer.",
    },
  },
  "major-11": {
    upright: {
      detail:
        "Justice: figure with sword and scales, purple veil, pillars (Biddy: justice, fairness, truth, cause and effect, law). As Symmetry, imbalance seeks correction—contracts, courts, conscience, karma. Sword points up: truth before punishment; scales level: proportion. Less about revenge than making the equation true. Document facts; remove personal bias as if impartial observer. In relationships, repair what you broke; in systems, advocate without melodrama.",
      guidance:
        "Write facts before story. Make proportionate amends. If deciding for others, document dissenting views.",
    },
    reversed: {
      detail:
        "Justice reversed: unfairness, dishonesty, lack of accountability, bias (Biddy). Symmetry broken—external injustice or internal rationalization. You may be wronged and need evidence calmly, or wrong and need to act before verdict. Internal dishonesty counts: selective memory, harm dressed as honesty. Repair begins naming asymmetry without theater.",
      guidance:
        "Consult impartial ally. If wronged, gather facts. If wrong, act before forced—restore symmetry by choice.",
    },
  },
  "major-12": {
    upright: {
      detail:
        "The Hanged Man hangs by one foot, halo, serene face, crossed legs (Biddy: pause, surrender, letting go, new perspectives). As Inverted Frame, you change coordinates—what looked like loss may be data; waiting becomes active if it alters how you measure success. Voluntary sacrifice of control supports creative breakthrough, spiritual insight, and strategic surrender of obsolete methods. Not all problems yield to force; some release when you stop pushing the old basis. Set limits so pause does not become avoidance.",
      guidance:
        "Stop forcing obsolete method. Journal one assumption turned upside down. Give help without resentment.",
    },
    reversed: {
      detail:
        "Hanged Man reversed: stalling, martyrdom, fear of sacrifice, refusal to pivot (Biddy). Inverted Frame stuck—pose without insight, suffering for applause, delay dressed as wisdom. If nothing internal shifts, you are hanging, not contemplating. Martyrdom invites rescuers instead of change. Reversed demands end date on suspension.",
      guidance:
        "Set end date on pause. One action breaking the pose. Ask: holy stillness or stuckness?",
    },
  },
  "major-13": {
    upright: {
      detail:
        "Death rides a white horse, banner with rose, bishop and child, sun between towers (Biddy: endings, change, transformation, transition). As Entropy, closed chapters release energy—habits, roles, relationships, identities that completed their arc. Rarely literal death; memento mori for structures. You cannot unscramble the egg; grief is real while room forms for new configuration. Mark endings cleanly so ghost order does not drain vitality.",
      guidance:
        "Separate finished from merely uncomfortable. Ritualize ending. Rest in open state before rebuilding.",
    },
    reversed: {
      detail:
        "Death reversed: resistance to change, stagnation, inability to move on (Biddy). Entropy denied—thermodynamic fantasy of permanent stability, half-alive arrangements, energy spent policing disorder. Sometimes reversal means local reordering after chaos—discern denial from disciplined rebuild.",
      guidance:
        "Name what you fear will scatter. One step toward closure or honest renewal—not both. Notice energy spent on denial.",
    },
  },
  "major-14": {
    upright: {
      detail:
        "Temperance: angel pouring between cups, foot on land and water, path to sun (Biddy: balance, moderation, patience, purpose, meaning). As The Mixer, opposites integrate into third quality—therapy, blended families, recovery, diplomacy, art that holds tension. Not bland neutrality—skilled proportion. Rushing ruins blend; one adjustment at a time. Hydration literal and metaphorical restores flow.",
      guidance:
        "Combine strengths from two sides. Pace adjustments—one domain at a time. Restore flow before scaling.",
    },
    reversed: {
      detail:
        "Temperance reversed: imbalance, excess, self-healing needed, conflict without repair (Biddy). Mixer overflows—binge/purge, zealotry, incompatible elements forced, performed calm over fermenting resentment. No third substance—only foam. Mediator burnout common.",
      guidance:
        "Remove one excess. Apologize where tone fractured harmony. Step back from mediating until neutral.",
    },
  },
  "major-15": {
    upright: {
      detail:
        "The Devil: Baphomet, chained lovers with loose collars, inverted pentagram (Biddy: shadow self, attachment, addiction, restriction, sexuality). As The Bound State, familiar configuration mistaken for identity—addiction, shame loops, debt, status games, intensity as love. RW chains are loose: awareness shows exit possible; escape still costs energy. Name bond, payoff, and price. Bound states feel stable; ionization requires help and plan.",
      guidance:
        "Name bond in plain words. Reduce trigger access. Ask for support—freedom needs energy, not shame.",
    },
    reversed: {
      detail:
        "Devil reversed: freedom, release, restoring control, breaking addiction (Biddy). Ionization—seeing illusion, ending toxic contracts, refusing hook. Transition messy; backward pull normal. Freedom is configuration change, not mood. Do not romanticize bond because unbound life feels empty at first.",
      guidance:
        "Celebrate one refusal of old bargain. Daily boundary reinforcement. Build life that does not need the chain.",
    },
  },
  "major-16": {
    upright: {
      detail:
        "The Tower: lightning, crown struck, figures falling, flames (Biddy: sudden change, upheaval, chaos, revelation, awakening). As Cascade Failure, unstable structure falls so truer architecture can remain. Shock is real—job loss, exposed secret, health alarm, belief collapse. Not punishment for living—physics catching denial. After impact: safety, truth to stakeholders, minimal rebuild before ornament.",
      guidance:
        "Safety first. Tell truth quickly to those who must act. Rebuild one load-bearing habit and one ally.",
    },
    reversed: {
      detail:
        "Tower reversed: fear of change, disaster avoided, internalized upheaval (Biddy). Cascade delayed—cracks ignored, facades hold, stress offstage. Postponed collapse accumulates. Sometimes integrating after strike—discern avoidance from recovery.",
      guidance:
        "Inspect known cracks. One repair before weather turns. Skilled support if trauma surfaces.",
    },
  },
  "major-17": {
    upright: {
      detail:
        "The Star: naked figure pouring water, one foot in pool and land, eight stars, bird (Biddy: hope, faith, purpose, renewal, spirituality). As Guiding Quanta, pour energy into long game after upheaval—recovery, service, art, mentorship. Hope calibrated, not naive. Vulnerability without spectacle heals. Transparency about closing wounds; generosity that does not bankrupt you.",
      guidance:
        "Share one true thing with someone safe. Simple regimen—walk, water, studio hour. Donate skill, not only sympathy.",
    },
    reversed: {
      detail:
        "Star reversed: lack of faith, despair, disconnection, discouragement (Biddy). Quanta dim—hope mocked, healing compared, wellness performed while starving inside. Burnout from pouring without refill after Tower or Moon. Beam not gone—you stopped receiving it.",
      guidance:
        "One kindness toward yourself today. Limit cynical voices. Let inspiration return quietly.",
    },
  },
  "major-18": {
    upright: {
      detail:
        "The Moon: path between towers, dog and wolf, crayfish from water, distant peaks (Biddy: illusion, fear, anxiety, subconscious, intuition). As the Dark Sector, reason alone cannot navigate—projections, hidden agendas, emotional undertow color work, love, money. Psychic sensitivity high; dreams loud. Test hunches against evidence without flattening symbol into cynicism. Half-light path: verify before irreversible contracts.",
      guidance:
        "Dream log two weeks. Write fear and hope before big decisions. Reality-check one story with grounded ally.",
    },
    reversed: {
      detail:
        "Moon reversed: release of fear, clarity emerging, repressed emotion surfacing (Biddy). Fog thins—deceptions exposed, self-gaslighting ends, anxiety returns to proportion. Sometimes clarity offered but declined—check integration vs dodge. Shame about past confusion can dissolve when facts seen plainly.",
      guidance:
        "State fear on paper. Verify one assumption. Address sleep and safety—clarity is physical.",
    },
  },
  "major-19": {
    upright: {
      detail:
        "The Sun: child on white horse, sunflowers, wall, banner (Biddy: positivity, fun, warmth, success, vitality). As Full Emission, warmth shareable—achievements seen, creative work celebrated, leadership without masks. Often follows Moon or Tower; clarity and energy return. Embodied brightness, not slogan positivity. Shame shrinks in honest light.",
      guidance:
        "Express completed work openly. Play childlike, not escapist. Let success be witnessed without immediate next mountain.",
    },
    reversed: {
      detail:
        "Sun reversed: inner child wounded, temporary depression, success delayed, joy blocked (Biddy). Emission occluded—not extinguished. Difficulty receiving good news, shame after visibility, performing joy while flat inside. Old scripts deny warmth; weather passes.",
      guidance:
        "Restore body: sleep, food, sunlight. Private celebration valid. Name one accomplishment critic erases.",
    },
  },
  "major-20": {
    upright: {
      detail:
        "Judgement: angel with trumpet, figures rising from coffins, mountains and water (Biddy: judgement, rebirth, inner calling, absolution). As The Measurement, conscience meets action—review without cruel distortion, apologies, vocation, second chances with terms. Summoned to roles fitting scars and gifts. Not petty scoring—alignment between who you were and who you become.",
      guidance:
        "Answer muted call with one concrete step. Forgive to be free, not to erase accountability. Specific amends before trust requests.",
    },
    reversed: {
      detail:
        "Judgement reversed: self-doubt, ignored call, harsh self-judgement, fear of reckoning (Biddy). Trumpet heard as attack—or ignored. Guilt paralyzes; cynicism about redemption stalls growth. Protective delay possible; measurement returns.",
      guidance:
        "Separate remorse from punishment. One proportionate amend. Ship imperfect honesty instead of waiting for perfect readiness.",
    },
  },
  "major-21": {
    upright: {
      detail:
        "The World: dancer in wreath, tetramorph corners, purple sash (Biddy: completion, integration, accomplishment, travel). As the Closed System, chapter completes with dignity—lessons conserved inside boundary. Equilibrium after work done. Celebration because orbit finished, not because you will never move again. Next cycle opens later; now honor closure and credit shared.",
      guidance:
        "Mark completion ritually. Share credit. Plan next orbit from wisdom, not restlessness fearing stillness.",
    },
    reversed: {
      detail:
        "World reversed: incomplete closure, shortcuts, fear of success, last steps avoided (Biddy). System leaks—perfectionism, paperwork, self-sabotage at threshold. Externally done, internally not; or free in fact but not in identity.",
      guidance:
        "Finish one visible last step. Close one loose end per day for a week. Rest without launching distraction from grief.",
    },
  },
};
