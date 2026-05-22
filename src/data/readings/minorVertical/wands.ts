export interface MinorVerticalEntry {
  upright?: { detail: string; guidance?: string };
  reversed?: { detail: string; guidance?: string };
}

/** Biddy Tarot Suit of Wands keywords + Rider–Waite vertical research (Photons / fire). */
export const WANDS_VERTICAL: Record<string, MinorVerticalEntry> = {
  "wands-ace": {
    upright: {
      detail:
        "Rider–Waite shows a hand emerging from cloud, offering a wand still sprouting leaves while more foliage falls toward the ground—a living branch, not a finished staff (Biddy: inspiration, new opportunities, growth, potential). The castle on the hill confirms that worldly structure exists; the ace asks which gate your fire will illuminate first. In the Photons suit, this is discrete energy before it couples to a medium: ambition sensed as heat in the chest, a creative impulse that has not yet chosen its wire. Enterprise here is the courage to treat an idea as real before proof arrives. Passion is not performance; it is the body's vote for a new vector. This card favors beginnings you can name in one sentence—the prototype sketch, the honest conversation about what you want to build, the application sent before perfectionism wins. Mastery is not required; emission is.",
      guidance:
        "Capture the spark in one concrete line—a title, a deadline, or a first deliverable. Choose a single outlet this week so Photons lase instead of scatter. Treat the castle as reachable, not as permission to wait for certainty.",
    },
    reversed: {
      detail:
        "Reversed, the Ace of Wands inverts the cloud-born gift: inspiration present, channel blocked (Biddy: an emerging idea, lack of direction, distractions, delays). Rider–Waite's falling leaves suggest vitality leaking before it roots—many sparks, no hearth. Photons refract through notifications, self-doubt, or parallel projects that never receive finishing energy. You may feel creative urgency while refusing the boring middle work that turns impulse into enterprise. Delays are often disguised decisions: the idea stays sacred because acting would expose it to measurement. Distraction is not always laziness; sometimes it protects an identity that has not updated to include the new role. Reversed asks whether you are waiting for a sign when the sign was the restlessness itself. The ace still exists—only the aperture is wrong.",
      guidance:
        "Remove one distraction source for forty-eight hours and protect one hour for the idea alone. Finish a micro-deliverable—outline, email, ten-minute recording—before opening another tab. If direction is unclear, pick the smallest experiment that would prove the idea wants to live.",
    },
  },
  "wands-02": {
    upright: {
      detail:
        "The Two of Wands upright in Rider–Waite places a robed figure on the ramparts, wand in one hand and globe in the other, looking out over sea and distant hills (Biddy: future planning, progress, decisions, discovery). Fire has stabilized enough to survey territory—you are no longer merely ignited; you are choosing where to aim Photons next. Ambition becomes cartography: which market, relationship, craft, or migration deserves the next season of your life force. Progress here is strategic visibility, not hustle for its own sake. The globe is both privilege and responsibility; you already hold influence, even if it feels modest. Enterprise favors scouts over settlers at this stage—send the probe, price the trip, compare alliances. Passion cools into purposeful desire when you admit you cannot occupy every shore at once. Discovery is the reward for naming the decision you have postponed while pretending you are still gathering data.",
      guidance:
        "List two paths with honest costs—not only money, but identity and energy. Set a decision date and, until then, gather one new fact per path. Hold the globe without clutching; planning works when it serves motion.",
    },
    reversed: {
      detail:
        "Reversed Two of Wands turns the ramparts inward (Biddy: personal goals, inner alignment, fear of the unknown, lack of planning). The figure may still hold the world, but the gaze retreats—private ambition disconnected from a map, or fear of the unknown masquerading as prudence. Photons pool behind the eyes instead of crossing the sea. You might know what you want yet refuse to price the voyage, lest success change who you are allowed to be. Lack of planning is not always chaos; sometimes it is a strategy to keep options imaginary, where they cannot fail. Inner alignment work is legitimate here—reconcile the part that wants expansion with the part that wants safety. Reversed warns against using spirituality or 'going with the flow' to avoid the uncomfortable commitment that discovery requires. The unknown is not only danger; it is also the place your next chapter has not been measured yet.",
      guidance:
        "Name the fear in plain language—loss, visibility, wrong choice—and write what it protects. Take one scouting step into the unknown: a call, a visit, a published intention. Align personal goals with a calendar date, not only with mood.",
    },
  },
  "wands-03": {
    upright: {
      detail:
        "Rider–Waite's Three of Wands shows a figure on the cliff edge, back to the viewer, watching ships approach on bright water—enterprise already launched, results still in transit (Biddy: progress, expansion, foresight, overseas opportunities). Photons left the harbor earlier; now the work is reception and patience without shrinking vision. This is foresight rewarded: alliances, exports, creative launches, or long investments beginning to return signal. Ambition matures from spark to supply chain—you are not only the artist but the merchant awaiting cargo. Expansion can be geographic, digital, or relational; the image is about horizons widening because you planned beyond the first sale. Passion here steadies into confidence that the world can meet you. Creativity scales when you treat collaboration as infrastructure, not betrayal of purity. The card does not promise instant arrival; it confirms direction. Stand on the height and read the water honestly—are those your ships, or distractions dressed as opportunity?",
      guidance:
        "Prepare to receive results—clear inbox, capacity, and agreements before success arrives. Strengthen one partnership that shares the voyage rather than freeloading on your foresight. Measure progress by ships launched, not only by applause at the dock.",
    },
    reversed: {
      detail:
        "Reversed Three of Wands shrinks the horizon just as vessels approach (Biddy: playing small, lack of foresight, unexpected delays). The figure may still watch the sea, but interpretation turns pessimistic—delays become proof you were foolish to expand, or self-sabotage narrows what you allow yourself to receive. Photons dim through impostor reflex: playing small to avoid the responsibility of larger visibility. Lack of foresight can mean you shipped without logistics—no contracts, no buffers, no community—so legitimate delays feel like cosmic rejection. Unexpected setbacks are real; the reversal asks whether you confuse setback with verdict. Enterprise stalls when passion lacks stewardship—burning bright at launch, absent at maintenance. Reversed also flags envy of others' arriving ships while ignoring the fleet you already sent. Expansion requires nervous-system capacity; if you shrink, investigate whether the body needs rest or the story needs updating.",
      guidance:
        "Identify where you play small to stay safe and test one expansion you have been deferring. Address a concrete delay—follow up, fix a bottleneck—instead of treating timing as fate. Revisit foresight: what single preparation would make the next arrival survivable?",
    },
  },
  "wands-04": {
    upright: {
      detail:
        "The Four of Wands upright is Rider–Waite's garlanded archway—flower canopy, celebrants with raised wands, a castle home in the background (Biddy: celebration, joy, harmony, relaxation, homecoming). Photons settle into shared wavelength: enterprise pauses for integration, not abandonment. This is the milestone after effort—launch party, signed lease, reunion, creative season completed, team rhythm found. Ambition needs these thresholds; without them, fire becomes chronic stress. Harmony here is structural—a tent of agreements, rituals, and belonging that makes the next push sustainable. Homecoming can be literal or symbolic: returning to body, community, or values after a campaign. Passion expressed as joy is still passion; relaxation is not laziness when it cements loyalty and memory. Creativity flourishes when the studio, marriage, or friend group has a door you can walk through proudly. The card invites visible gratitude—let people see the arch you built together.",
      guidance:
        "Mark the milestone with a simple rite—meal, announcement, or afternoon off—before rushing to the next quest. Invite the people who carried the wands with you; celebration heals hidden resentments. Rest with intention so the harmony becomes habit, not a one-night flare.",
    },
    reversed: {
      detail:
        "Reversed Four of Wands complicates the party at the gate (Biddy: personal celebration, inner harmony, conflict with others, transition). Rider–Waite's arch may still stand, but social friction, exclusion, or premature transition unsettles the scene. Photons flicker—joy available privately while public harmony cracks. Conflict with others can mean disputes about who belongs, who gets credit, or whether the home you built fits who you are becoming. Inner harmony is possible even when the guest list is wrong; reversed honors solo celebration when community performance would be dishonest. Transition warns against clinging to an old threshold because the garlands were pretty—some homecomings are temporary waystations. Enterprise suffers when teams celebrate symbols while avoiding the hard conversation about workload or values. Reversed asks whether you are forcing festivity to mask misalignment, or refusing festivity out of perfectionism.",
      guidance:
        "Resolve one interpersonal tension before the public rite, or choose private joy if the party would be theater. Name what is transitioning—role, address, relationship—and mark it honestly. If conflict persists, negotiate boundaries rather than torching the arch.",
    },
  },
  "wands-05": {
    upright: {
      detail:
        "Rider–Waite's Five of Wands depicts five youths crossing staves in open ground—no crown at stake, only energetic disagreement (Biddy: conflict, disagreements, competition, tension, diversity). Photons interfere: multiple ambitions occupy the same field, and the pattern is messy before it clarifies. Enterprise meets market reality—rivals, critics, collaborators with incompatible visions, or internal teams pulling in different directions. Competition can sharpen craft when stakes are named and cruelty is refused. Diversity of voice is a feature here; the card is not unanimity but friction that prevents groupthink. Passion expressed as sparring needs rules—time boxes, shared goals, consent to debate. Creativity thrives when ideas collide, provided you distinguish sparring from sabotage. The upright lesson is not to flee tension but to metabolize it: who is fighting for what, and is the fight worth the heat loss? Conflict without clarity burns fuel; conflict with shared purpose can forge better structures.",
      guidance:
        "State shared stakes aloud so rivalry does not become war. Engage competition with sportsmanship—clear roles, debrief after heated meetings. If you are one of the five, ask whether you want to win or to improve the work.",
    },
    reversed: {
      detail:
        "Reversed Five of Wands moves the battle inward or underground (Biddy: inner conflict, conflict avoidance, tension release). The staves may lower without resolution—peace that is politeness, or explosion after long suppression. Photons scatter as anxiety when you debate everyone in your head but speak nowhere. Avoidance keeps enterprise frozen: the pitch un sent, the boundary unspoken, the creative difference un aired until it becomes resentment. Inner conflict can mean competing identities—artist versus provider, leader versus friend—each wielding a wand against the other. Tension release is possible upright-reversed: sometimes the card blesses ending a performative fight that never served growth. Reversed asks you to locate the real duel. Are you avoiding external conflict because you fear visibility, or inflaming internal conflict because it feels safer than negotiation? Release is healthy when it ends hollow competition; it is harmful when it abandons necessary truth.",
      guidance:
        "If you have been avoiding a needed debate, schedule it with ground rules. If the war is internal, journal both sides, then choose one aligned action. Release tension through movement or honest conversation—not through passive-aggressive side channels.",
    },
  },
  "wands-06": {
    upright: {
      detail:
        "The Six of Wands upright shows a rider on a white horse, laurel wreath raised, companions with wands walking beside—public victory in motion (Biddy: success, public recognition, progress, self-confidence). Photons are visible: enterprise acknowledged, creative work landing, leadership recognized. This is the parade after competence—not luck alone, though grace plays a part. Self-confidence here is earned through prior trials; the crowd sees what you endured to arrive. Ambition fulfilled in public invites new responsibility: how you carry acclaim shapes the next campaign. Passion radiates as encouragement when you thank allies instead of hoarding spotlight. Rider–Waite emphasizes procession, not isolation—success is relational. Progress continues; the wreath is momentary. Use recognition to consolidate—secure resources, document lessons, mentor someone behind you. The card warns gently against confusing applause with arrival; still, receive it. Visibility is fuel for Photons when integrated, poison when it becomes identity's only food.",
      guidance:
        "Accept praise without outsourcing self-worth—note three private reasons you respect your own work. Thank allies by name; shared victory lasts longer than solo myth. Plan the next chapter while energy is high, not after the crowd disperses.",
    },
    reversed: {
      detail:
        "Reversed Six of Wands inverts the parade (Biddy: private achievement, personal definition of success, fall from grace, egotism). Victory may be real but unseen—success without platform, or public story diverging from private truth. Photons dim through fear of visibility: you win, then shrink from the wreath. Egotism is the shadow—performing triumph, exaggerating role, or punishing others when recognition is not total. Fall from grace warns that pedestals are narrow; one misstep from hubris or overpromising can undo goodwill. Personal definition of success is medicine here: perhaps the crowd's metric is wrong for your enterprise. Reversed honors quiet mastery—the book finished without bestseller status, the team saved without headline. It also flags hollow wins—titles without substance, viral moments without craft. Ask whether you chase applause to avoid deeper creative risk. Confidence rebuilt privately may be more durable than confidence rented from audience.",
      guidance:
        "Define success on your terms in writing; let public metrics be one input, not the throne. If fame stings, scale visibility to tolerance rather than quitting the work. Check ego: celebrate without humiliating losers, and repair if you already did.",
    },
  },
  "wands-07": {
    upright: {
      detail:
        "Rider–Waite's Seven of Wands shows a figure on higher ground, warding off six rising staves—outnumbered but advantaged by position (Biddy: challenge, competition, protection, perseverance). Photons cohere under pressure: enterprise defended, creative vision contested, boundaries tested. This is not the open skirmish of the Five; it is holding a strategic hill you earned. Perseverance matters because quitting now would surrender disproportionate value—reputation, market niche, relationship standard, or artistic integrity. Competition may come from newcomers, critics, or institutional inertia; protection is not paranoia when stakes are real. Passion expressed as conviction can inspire allies if you avoid cruelty. The card asks which battles are worth the cost—some staves should be let through if they do not threaten the core. Challenge clarifies identity: you learn what you will stand for when tired. Courage here is maintenance, not spectacle—showing up again, documenting agreements, resting between repulses.",
      guidance:
        "Pick battles aligned with your highest stake; concede skirmishes that drain without protecting the summit. Rest between pushes—sleep and food are defensive tools. Ask one ally to cover a flank you cannot hold alone.",
    },
    reversed: {
      detail:
        "Reversed Seven of Wands signals exhaustion on the hill (Biddy: exhaustion, giving up, overwhelmed). The high ground remains, but Photons lose coherence—perseverance curdles into siege mentality or collapse. Overwhelm may mean too many fronts, too few allies, or a position that was never worth defending but became identity. Giving up can be wisdom when the hill is sunk cost; reversed asks you to distinguish strategic retreat from shameful quit. Exhaustion breeds misreading threats—every comment feels like an assault, every request like invasion. Enterprise suffers when leaders confuse stubbornness with courage. Protection turns brittle—boundaries without nuance burn bridges you will need. Reversed also flags internal surrender: you stop advocating for the work while still occupying the role. If the body says no louder each week, the battle may be with your pacing, not the market. Surrender with a plan beats heroic depletion.",
      guidance:
        "Delegate or drop one front today; verify whether the hill still matches your values. Sleep before you abandon a position you may regret—fatigue lies. If retreat is right, exit with documentation and dignity, not ghosting.",
    },
  },
  "wands-08": {
    upright: {
      detail:
        "The Eight of Wands upright is Rider–Waite's eight staves flying parallel through open sky—no figures, pure velocity (Biddy: movement, fast paced change, action, alignment, air travel). Photons arrive in burst: messages, opportunities, creative breakthroughs, travel, or project phases accelerating toward landing. Enterprise moves from planning to arrival; answers en route, signatures pending, inspiration cascading faster than you can file it. Alignment suggests channels cleared—team, tools, and timing synchronized enough that friction drops briefly. Action favors minimal interference: do not over-edit the arrow mid-flight. Passion expresses as momentum; body and schedule must match pace—hydration, sleep, realistic inbox triage. Air travel and digital equivalents compress distance; use the window to close loops, not open new ones without capacity. The card is exhilarating and risky—speed without steering invites crash. Treat acceleration as temporary weather; build buffers before you assume perpetual tailwinds. When staves land, be ready to integrate, not only to celebrate motion.",
      guidance:
        "Clear channels for incoming news—calendar, inbox, and decision authority. Align body with pace: eat, breathe, sleep even in the sprint. Finish one loop before chasing the next shiny arrival.",
    },
    reversed: {
      detail:
        "Reversed Eight of Wands jams the flight (Biddy: delays, frustration, resisting change, internal alignment). Staves hang or scatter—logistics fail, messages bounce, creative flow stutters. Photons hit medium mismatch: you push fire through wet wood. Delays may be external—approvals, visas, platforms—or internal misalignment where part of you resists the change your life already launched. Frustration compounds when you treat pause as personal failure rather than signal to adjust trajectory. Resisting change often means clinging to an old identity while the new chapter demands different skills. Internal alignment work belongs here: breath, values check, honest conversation with collaborators about realistic timelines. Reversed warns against forcing speed through manipulation or burnout; it also warns against using delay as excuse to never land. Some arrows need re-aiming, not more force. Identify whether the block is fear, infrastructure, or wrong target.",
      guidance:
        "Find the bottleneck—one person, one tool, one fear—and address it directly. Stop resisting a change that already left the bow; update plans to match reality. If speed is unsafe, communicate slippage early instead of silent frustration.",
    },
  },
  "wands-09": {
    upright: {
      detail:
        "Rider–Waite's Nine of Wands shows a bandaged figure gripping a wand, eight staves planted behind like a palisade—wounded but still standing (Biddy: resilience, courage, persistence, test of faith, boundaries). Photons near completion wavelength: enterprise in final stretch, creative project almost done, relationship boundary tested and mostly holding. Resilience is not denial—you see the bandage, yet you remain at post. Courage here is mundane: another email, another revision, another night watch. Test of faith asks whether you trust the work without fresh applause. Boundaries protect accumulated effort—do not drop the fence because you are tired and someone calls you paranoid. Persistence differs from the Seven's active defense; this is endurance after prior blows. Ambition matures into stewardship—guarding what you built until it can stand without you. Passion cools into loyalty to the promise. The card acknowledges cost; honor it without romanticizing suffering. One more push may finish the cycle—discern whether the push is strategic or habitual.",
      guidance:
        "Protect the boundary that guards nearly-finished work; say no without long apology. Ask one ally for cover before the final stretch. Rest is tactical—bandage the wound, then return to the post you chose.",
    },
    reversed: {
      detail:
        "Reversed Nine of Wands distorts vigilance (Biddy: inner resources, struggle, overwhelm, defensive, paranoia). The palisade may stand, but interpretation turns hostile—every noise reads as attack, every request as theft of your wands. Photons decoherence under chronic threat perception: enterprise becomes isolation, creativity becomes bunker. Overwhelm suggests the last mile is too heavy for solo carry; struggle may be noble or self-inflicted. Defensive posture can repel help that would finish the work. Paranoia is the shadow—seeing enemies where there is friction, burning bridges to avoid one more conversation. Inner resources are the medicine: therapy, body work, trusted friend who can mirror reality. Reversed also flags quitting at the true finish line because pain became identity. Ask whether the fence protects the garden or imprisons you. Some battles ended already; you are still fighting ghosts. Lower shoulders; verify facts before escalating.",
      guidance:
        "Test threat versus habit—write evidence for and against before acting. Accept one offer of help that does not steal authorship. Rest without guilt; exhaustion makes paranoia plausible.",
    },
  },
  "wands-10": {
    upright: {
      detail:
        "The Ten of Wands upright shows a figure bent under ten staves, walking toward a visible town—completion near, spine strained (Biddy: burden, extra responsibility, hard work, completion). Photons overloaded: enterprise succeeded into obligation mountain—every yes became a staff you alone carry. Hard work is honest; burden asks whether the weight is temporary or structural. Extra responsibility often follows visibility—promotions, caregiving, creative opportunities that multiply deliverables. Rider–Waite's town is close; this is not endless trudge without destination. Completion is possible if you stop collecting wands mid-stride. Ambition without delegation becomes martyrdom; passion without pacing becomes injury. Creativity may feel impossible because logistics consumed the muse. The upright card respects the grind while naming its limit—honor effort, redesign load. Some staves are not yours; some timelines are negotiable. The body is the final accountant. Finishing matters, but arriving broken serves no one.",
      guidance:
        "Drop or delegate one staff that is not yours before the last mile. Plan completion with rest built in—sleep, celebration, handoff. Ask which burdens are identity performance versus true obligation.",
    },
    reversed: {
      detail:
        "Reversed Ten of Wands focuses on release or refusal to release (Biddy: doing it all, carrying the burden, delegation, release). The figure may straighten—staves falling—or cling tighter from guilt. Photons scatter when control masquerades as responsibility: you will not hand off because no one else does it 'right,' so enterprise stalls at capacity ceiling. Doing it all wins praise briefly, then erodes craft and health. Delegation is not abandonment; it is how fires scale beyond one pair of hands. Release can mean quitting a role, ending a volunteer spiral, or admitting the project should shrink. Reversed blesses putting down what was never sustainable. It also warns against dumping obligations without communication—ghosting teams, clients, or family. Inner pattern: worth tied to carrying weight. Creative life returns when bandwidth returns. Choose release with integrity—clear handoffs, documented state, kind boundaries.",
      guidance:
        "Delegate one task today with instructions, not micromanagement. Release guilt about not being the only carrier—competence includes building systems. If you drop a burden, communicate clearly to everyone affected.",
    },
  },
  "wands-page": {
    upright: {
      detail:
        "Rider–Waite's Page of Wands shows a youth in desert landscape, holding a sprouting wand, looking at it with curious alertness—message of fire arriving (Biddy: inspiration, ideas, discovery, limitless potential, free spirit). Photons as apprentice pulse: enterprise not yet expert, creativity willing to look foolish, passion expressed as exploration. This is the email before the company, the sketch before the show, the flirtation before the commitment. Discovery favors beginners' mind—follow one thread without pretending mastery. Limitless potential is real and also requires training; the page is invitation, not certificate. Free spirit energy can revitalize stale teams if paired with listening. Intuition arrives as itch—new medium, new genre, new collaboration. Rider–Waite's desert suggests space to experiment; protect margins for play. Ambition here starts small and vivid. Learn before you perform expertise; send the message you drafted; ask the question that reveals you as new. The page blesses honest inexperience over counterfeit authority.",
      guidance:
        "Follow one curiosity thread this week with a tangible output—notes, sample, conversation. Learn publicly where safe; ask mentors one precise question. Send the message or pitch you keep revising without sending.",
    },
    reversed: {
      detail:
        "Reversed Page of Wands blocks the messenger (Biddy: newly-formed ideas, redirecting energy, self-limiting beliefs, a spiritual path). Ideas redirect into doubt—Photons bounce off 'who am I to try?' Creative sparks die in private because sharing feels dangerous. Self-limiting beliefs dress as realism: you need one more course, one more year, one more permission slip before acting. Spiritual path language can become bypass—vision boards without verbs. Newly-formed ideas need protection, not silence; reversed warns against telling everyone too soon, but also against telling no one forever. Energy scattered across hobbies prevents depth. Emotional immaturity may show as moody withdrawal when feedback arrives. Reversed asks you to test beliefs with small experiments rather than debate them abstractly. Redirect energy from self-surveillance to craft. The page reversed is still a page—apprenticeship remains available if you stop disqualifying yourself.",
      guidance:
        "Write one self-limiting belief and design a week-long test against it. Send a small piece of work to a safe audience. If energy is scattered, choose one thread and pause the others without shame.",
    },
  },
  "wands-knight": {
    upright: {
      detail:
        "Rider–Waite's Knight of Wands charges on a rearing horse, desert behind, wand raised—fire in motion (Biddy: energy, passion, inspired action, adventure, impulsiveness). Photons propagate: enterprise as campaign, creativity as pursuit, passion that moves rooms and markets. Inspired action favors bold launches, travel, performances, pitches delivered with heat. Adventure calls—new role, new city, new relationship rhythm—provided you pack repair tools for the horse. Impulsiveness is the shadow named openly; speed excites and can trample. Ambition here is kinetic; planning happens mid-gallop. Leadership by example, not by spreadsheet—people follow heat when it points somewhere. Knight energy suits short intense pushes more than decade maintenance unless paired with queen or king maturity. Romance and creative affairs start fast; verify consent and follow-through. The card celebrates motion after too much waiting. Check gear before speed—legal, financial, relational—but do not use checklists to never ride.",
      guidance:
        "Channel passion into one campaign with a finish line, not endless detours. Apologize quickly if speed hurt someone; adjust pace without killing fire. Verify essentials—budget, boundaries, backup plan—then ride.",
    },
    reversed: {
      detail:
        "Reversed Knight of Wands stalls or scatters the charge (Biddy: passion project, haste, scattered energy, delays, frustration). The horse rears without road—Photons spark, then dissipate across unfinished quests. Haste produces sloppy work, burned bridges, or promises your calendar cannot keep. Delays frustrate because identity tied to motion; when movement stops, self-worth crashes. Passion project may be valid but unsupported—no structure, no allies, no realistic scope. Scattered energy looks like starting three businesses, three novels, three situationships in one season. Frustration turns outward as blame or inward as shame. Reversed can also mean passion redirected into drama instead of deliverables—arguments as substitute for building. Adventure without ethics becomes extraction. Slow enough to steer: choose one vector, finish a chapter, repair one relationship strained by your velocity. Knight reversed is not 'never ride'; it is 'ride with reins.'",
      guidance:
        "Pick one passion project and define done for this month. Slow pace until steering returns—one commitment honored beats five begun. If delays are external, communicate; if internal, examine fear dressed as boredom.",
    },
  },
  "wands-queen": {
    upright: {
      detail:
        "Rider–Waite's Queen of Wands sits on a throne adorned with lions and sunflowers, black cat at her feet, wand upright—warm authority, confident gaze (Biddy: courage, confidence, independence, social butterfly, determination). Photons in steady emission: enterprise led with encouragement, creativity that invites rather than intimidates, passion integrated with self-possession. Courage here is relational—you hold space while others shine. Independence does not mean isolation; the social butterfly aspect networks with authenticity, not performance alone. Determination shows as follow-through on promises and boundaries alike. The black cat signals intuition and shadow comfort— you know your moods and do not dump them on the court. Ambition mature enough to mentor, delegate, and celebrate. Leadership through radiant competence: you model the ethic you expect. Creativity flourishes in environments you heat without scorching. Confidence is magnetic when rooted in self-respect, not comparison. Queen energy asks you to occupy visibility without shrinking or dominating.",
      guidance:
        "Lead with encouragement—name others' strengths publicly. Protect your flame from envy without paranoia; boundaries keep warmth generous. Take one visible stand aligned with your values this week.",
    },
    reversed: {
      detail:
        "Reversed Queen of Wands eclipses the throne's warmth (Biddy: self-respect, self-confidence, introverted, re-establish sense of self). Social butterfly cocooned—Photons dim through burnout, jealousy, or retreat after overgiving. Introverted phase may be healing, not failure: re-establish sense of self away from audience. Self-respect work surfaces when you notice people-pleasing, sexual or creative performance without joy, or controlling heat to avoid vulnerability. Confidence wobbles; you may provoke tests from others or test yourself harshly. Reversed warns against smothering—help that becomes control—or against disappearing when one criticism lands. Inner resources need refill: sleep, solitude, art without agenda. Enterprise suffers when the queen performs strength while depleted. Self-love here is strategic—return to court when body says yes, not when guilt says perform. Shadow: bitterness masked as honesty.",
      guidance:
        "Honor retreat if it restores self-respect; set a gentle re-entry date. Refill before you lead—one day off, one creative act with no audience. Examine where charm became armor; speak one need plainly.",
    },
  },
  "wands-king": {
    upright: {
      detail:
        "Rider–Waite's King of Wands sits forward on a throne carved with lions and salamanders, wand in one hand, facing the future—command of fire (Biddy: natural-born leader, vision, entrepreneur, honour). Photons governed: enterprise at scale, creativity institutionalized, passion channeled into legacy. Natural-born leader does not mean born flawless; it means willingness to decide, absorb heat, and stand visible when outcomes land. Vision is the king's primary tool—story that aligns team, market, and values. Entrepreneur energy builds systems beyond personal charisma—succession, standards, ethics. Honour separates king from tyrant: keep promises, credit labor, punish betrayal without cruelty for sport. Ambition serves realm—family, company, community, craft tradition. Salamander symbolizes transformation through fire; you have survived enough cycles to guide others. Leadership invites scrutiny; welcome feedback that improves the realm. Creative kings protect makers while demanding excellence. The card favors bold ethical moves—launch, restructure, public stand—when grounded in long horizon.",
      guidance:
        "Write vision in one paragraph and share it with those affected. Model the ethic you demand—punctuality, honesty, courage. Praise labor before pushing harder; power lasts when people choose to follow.",
    },
    reversed: {
      detail:
        "Reversed King of Wands warps command (Biddy: impulsiveness, haste, ruthless, high expectations). Photons become blast—vision without mercy, entrepreneurship as extraction, honour traded for control. Impulsiveness at the top multiplies damage—fired messages, reckless pivots, public scapegoating. Haste skips consultation; high expectations become moving goalposts that burn the court. Ruthless may win quarters and lose decades—talent exits, trust erodes, family flinches. Reversed can also mean abdication—throne empty while chaos enters—or leader performing calm while resentful. Tyrant heat punishes vulnerability; makers hide innovation. Expectations unspoken ensure failure; micromanagement masquerades as standards. Shadow king uses charisma to avoid accountability. Reversed asks whether you lead to serve outcome or ego. Lower one impossible standard; repair one relationship damaged by haste. True kingship includes repair, not only decree.",
      guidance:
        "Pause major decrees twenty-four hours; consult one dissenting voice. Lower a standard that exists only to prove dominance. If you have been harsh, apologize with changed behavior, not only words.",
    },
  },
};
