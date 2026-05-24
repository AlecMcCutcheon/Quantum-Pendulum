# Reading fidelity — traditional roots check

Companion to [ORIENTATION_RESEARCH.md](./ORIENTATION_RESEARCH.md). Length thresholds live in `npm run audit:readings`; **semantic** fidelity lives here and in `npm run audit:fidelity`.

## Per cell (card × pole × layer)

| Check | Scholarly (`detail`) | Personal (`personal`) |
|-------|----------------------|------------------------|
| RW imagery | Symbols match **this** card (not a neighbor pip) | At least one concrete image reference where natural |
| Biddy keywords | Upright/reversed cluster from `minorLateral` or §3 majors appears or clear paraphrase | Pole-appropriate cluster (conjugate = reversed shadow crossing talent) |
| No cross-card bleed | No other pip’s archetype (Fool leap on Four of Swords rest, etc.) | Same |
| Pole distinction | Differs from the other three poles **for this card** | Transverse = liminal/crossing; conjugate = named shadow cross |
| Quantum frame | Uses suit/major `quantumName`; does not replace traditional meaning | Second-person “you”; not a paste of `detail` |
| Anti-boilerplate | No repeated multi-sentence tail across pips | Protocol steps unique to the situation |

## Sources of truth

| Arcana | Keywords / lateral logic |
|--------|--------------------------|
| Majors | `docs/ORIENTATION_RESEARCH.md` §3; `scripts/fidelity/major-keywords.json` |
| Minors | `src/data/readings/minorLateral/{suit}.ts` — `biddyUpright` / `biddyReversed` |

## Automated checks

`npm run audit:fidelity` flags:

1. **Missing keywords** — pole-appropriate Biddy tokens absent from `detail` + personal `hook`
2. **Boilerplate** — scholarly phrases in `scripts/fidelity/boilerplate-phrases.json`; personal phrases in `scripts/fidelity/personal-boilerplate-phrases.json` (layer-scoped)
3. **Duplicate structure** — personal `sections[].heading` reused across different card IDs; protocol step headings on more than four cells; identical protocol step bodies across cards
4. **Near-floor** — `detail` or `section.body` within 10% of length minimum (thin despite passing)

`npm run audit:fidelity:fail` exits non-zero on boilerplate, keywords, and duplicate structure (not near-floor).

Use `npm run audit:fidelity -- --card=swords-03` for one card. JSON report: `scripts/out/fidelity-report.json` (when `--json`).

## Repair workflow

1. Pull Biddy pip page + RW LWB for failing card
2. Note 2–3 anchor phrases in ORIENTATION_RESEARCH or minorLateral (if keywords drifted)
3. Rewrite all **four poles** in `readingDepth/{suit}.ts` before moving to `readingPersonal/{suit}.ts`
4. Re-run `audit:readings --fail` then `audit:fidelity`

## Gold references

- Scholarly: `readingDepth/swords.ts` — `swords-ace`, `swords-02`
- Personal: `readingPersonal/swords.ts` — `swords-07` conjugate
- Majors: `readingDepth/majors.ts` + ORIENTATION_RESEARCH §3
