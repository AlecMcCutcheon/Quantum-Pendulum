# Suit rename backlog — Particles & Lattices

## Canonical suit names (source of truth: `src/data/deck.ts`)

| Internal id | Quantum name (primary) | Classic name (subtitle) |
|-------------|--------------------------|-------------------------|
| `wands`     | **Particles**            | Wands                   |
| `cups`      | Waves                    | Cups                    |
| `swords`    | Operators                | Swords                  |
| `pentacles` | **Lattices**             | Pentacles               |

Renamed 2026-05-21:
- Photons → **Particles** (wands)
- Lattice → **Lattices** (pentacles)

Card `quantumName` values rebuild from `SUIT_QUANTUM` (e.g. `Singularity of Particles`, `Pair of Lattices`). Classic names unchanged.

---

## Done now

- [x] `SUIT_QUANTUM` in `deck.ts`
- [x] Library filter tabs: quantum label + classic subtitle
- [x] Library search matches quantum and classic suit names
- [x] Card detail panel: suit line shows quantum name with classic subtitle

---

## Deferred — reading copy (do not block majors pass)

These files still use **Photons**, **Lattice**, **Singularity of Lattice**, **Quantum Lattice**, and old-voice patterns (Biddy, Rider–Waite, pole essays). They need a full pass matching the majors blueprint (Fool–Empress quality):

### Wands → Particles (`readingPersonal/wands.ts`, `readingDepth/wands.ts`)

Replace systematically:
- `Photons` / `Photon` suit references → **Particles** / **Particle** where meaning is *suit*, not literal light physics
- `Singularity of Photons` → `Singularity of Particles`
- `Pair of Photons` → `Pair of Particles` (etc.)
- Hooks: `When you draw … as …` using **classic + quantum** card naming
- Remove Biddy / RWS / external tarot citations
- Keep: hook → 2 headspace sections → 3 protocol steps → takeaway (personal)
- Keep: summary, paragraphated detail, guidance (depth)
- Preserve four distinct orientations; trim `"not transverse / not reversed"` comparison essays where they appear

**Naming note:** Star major (`Guiding Quanta`) uses "photon" as *physics metaphor* for light packets — **do not** bulk-replace those.

### Pentacles → Lattices (`readingPersonal/pentacles.ts`, `readingDepth/pentacles.ts`)

Replace systematically:
- `Lattice` (singular suit) → **Lattices** where it denotes the suit
- `Singularity of Lattice` → `Singularity of Lattices`
- `Pair of Lattice` → `Pair of Lattices` (etc.)
- `Quantum Lattice` → **Quantum Lattices** or mesh/lattice field language consistent with plural suit name
- Same voice / structure rules as wands pass above

### Suggested order

1. Finish majors manual audit (00–21) — in progress
2. Ace–King Particles (wands) — **Ace + Two complete**; Three through King pending
3. Ace–King Lattices (pentacles) — same
4. Waves / Operators if not already on blueprint voice

### Search helpers (before editing)

```bash
# Suit-name leftovers (exclude Star physics copy manually)
rg 'Photons|Singularity of Photons|of Photons' src/data/readings --glob '*.ts'
rg 'Singularity of Lattice|of Lattice|Quantum Lattice' src/data/readings --glob '*.ts'
rg 'Biddy|Rider.?Waite' src/data/readings/readingPersonal/wands.ts src/data/readings/readingPersonal/pentacles.ts
```

---

## UI convention going forward

- **Primary:** quantum name everywhere user-facing (tabs, card title, hooks)
- **Subtitle:** classic name (italic, smaller) — already on library list items and detail header
- **Internal ids:** keep `wands`, `pentacles`, etc. in code and card ids
