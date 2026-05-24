import { memo, startTransition, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DECK, SUIT_CLASSIC, SUIT_QUANTUM } from "../data/deck";
import { getReading } from "../data/readings";
import { useLibraryThumbs } from "../hooks/useLibraryThumbs";
import { getLibraryDetailSvg } from "../lib/cardArt/libraryDetailSvg";
import {
  ORIENTATION_LABEL,
  ORIENTATION_SHORT,
  ORIENTATION_STYLE,
  ROTATION,
} from "../lib/cardOrientationUi";
import { PersonalReadingView } from "./PersonalReadingView";
import { ReadingTabs } from "./ReadingTabs";
import { ScholarlyReadingBody } from "./ScholarlyReadingBody";
import type { Orientation, TarotCard } from "../types/deck";

const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

type LibraryFilter =
  | "all"
  | "major"
  | "wands"
  | "cups"
  | "swords"
  | "pentacles";

const FILTER_OPTIONS: {
  id: LibraryFilter;
  label: string;
  subtitle?: string;
}[] = [
  { id: "all", label: "All" },
  { id: "major", label: "Major", subtitle: "Arcana" },
  {
    id: "wands",
    label: SUIT_QUANTUM.wands,
    subtitle: SUIT_CLASSIC.wands,
  },
  { id: "cups", label: SUIT_QUANTUM.cups, subtitle: SUIT_CLASSIC.cups },
  {
    id: "swords",
    label: SUIT_QUANTUM.swords,
    subtitle: SUIT_CLASSIC.swords,
  },
  {
    id: "pentacles",
    label: SUIT_QUANTUM.pentacles,
    subtitle: SUIT_CLASSIC.pentacles,
  },
];

function cardMatchesFilter(card: TarotCard, filter: LibraryFilter): boolean {
  if (filter === "all") return true;
  if (filter === "major") return card.arcana === "major";
  return card.arcana === "minor" && card.suit === filter;
}

function cardMatchesQuery(card: TarotCard, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const suitQuantum =
    card.suit != null ? SUIT_QUANTUM[card.suit].toLowerCase() : "";
  const suitClassic =
    card.suit != null ? SUIT_CLASSIC[card.suit].toLowerCase() : "";
  return (
    card.id.toLowerCase().includes(q) ||
    card.quantumName.toLowerCase().includes(q) ||
    card.classicName.toLowerCase().includes(q) ||
    suitQuantum.includes(q) ||
    suitClassic.includes(q) ||
    (card.suit?.toLowerCase().includes(q) ?? false) ||
    String(card.rank).toLowerCase().includes(q)
  );
}

interface CardLibraryProps {
  open: boolean;
  onClose: () => void;
}

interface LibraryListItemProps {
  card: TarotCard;
  active: boolean;
  thumbUrl?: string;
  onSelect: (id: string) => void;
}

const LibraryListItem = memo(function LibraryListItem({
  card,
  active,
  thumbUrl,
  onSelect,
}: LibraryListItemProps) {
  return (
    <li className="[content-visibility:auto] [contain-intrinsic-size:auto_3.5rem]">
      <button
        type="button"
        onClick={() => onSelect(card.id)}
        className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
          active
            ? "bg-accent/15 ring-1 ring-accent/30"
            : "hover:bg-white/5"
        }`}
      >
        <div className="relative aspect-[2/3] w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-void/80">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt=""
              width={44}
              height={66}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full animate-pulse bg-white/5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-star/95">
            {card.quantumName}
          </p>
          <p className="truncate text-[10px] text-star/45 italic">
            {card.classicName}
          </p>
        </div>
      </button>
    </li>
  );
});

export function CardLibrary({ open, onClose }: CardLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("upright");
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const cards = useMemo(() => {
    return DECK.filter(
      (card) =>
        cardMatchesFilter(card, filter) && cardMatchesQuery(card, searchQuery),
    );
  }, [filter, searchQuery]);

  const thumbUrls = useLibraryThumbs(cards, open);

  const selected = selectedId
    ? DECK.find((c) => c.id === selectedId)
    : null;
  const reading =
    selected && getReading(selected.id, orientation);

  const detailSvg = selected ? getLibraryDetailSvg(selected) : null;

  const handleClose = () => {
    setSelectedId(null);
    onClose();
  };

  const handleBackdrop = () => {
    if (
      selectedId &&
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches
    ) {
      setSelectedId(null);
      return;
    }
    handleClose();
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setOrientation("upright");
  };

  const setFilterDeferred = (f: LibraryFilter) => {
    startTransition(() => setFilter(f));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close card library"
            onClick={handleBackdrop}
          />
          <motion.div
            className={`fixed top-0 left-0 z-50 flex h-dvh w-full max-w-[100vw] overflow-hidden border-r border-white/10 bg-void/95 shadow-2xl backdrop-blur-md sm:max-w-none ${
              selectedId
                ? "sm:w-[min(52rem,calc(100vw-2rem))]"
                : "sm:w-[min(26rem,calc(100vw-2rem))]"
            }`}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            role="dialog"
            aria-label="Card library"
          >
            <nav
              className={`flex h-full shrink-0 flex-col border-r border-white/10 ${
                selectedId
                  ? "hidden sm:flex sm:w-1/2 sm:min-w-[18rem] sm:max-w-[26rem]"
                  : "flex w-full min-w-0 sm:w-full"
              }`}
              aria-label="Card index"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
                <div>
                  <h2 className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
                    Deck library
                  </h2>
                  <p className="mt-0.5 text-xs text-star/50">
                    {DECK.length} cards
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg px-2 py-1 text-star/60 hover:bg-white/10 hover:text-star"
                  aria-label="Close library"
                >
                  ✕
                </button>
              </header>

              <div className="shrink-0 border-b border-white/10 px-3 py-2">
                <label className="sr-only" htmlFor="library-search">
                  Search cards
                </label>
                <input
                  id="library-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, suit, rank…"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-star/90 placeholder:text-star/35 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30"
                />
              </div>

              <div className="flex shrink-0 flex-wrap gap-1 border-b border-white/10 px-3 py-2">
                {FILTER_OPTIONS.map(({ id, label, subtitle }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFilterDeferred(id)}
                    className={`rounded-lg px-2.5 py-1.5 text-left transition ${
                      filter === id
                        ? "bg-accent/25 text-accent ring-1 ring-accent/30"
                        : "text-star/50 hover:bg-white/5 hover:text-star/80"
                    }`}
                  >
                    <span className="block text-[11px] font-medium leading-tight">
                      {label}
                    </span>
                    {subtitle ? (
                      <span className="block text-[9px] font-normal leading-tight text-star/40">
                        {subtitle}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <ul className="library-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {cards.length === 0 ? (
                  <li className="px-2 py-6 text-center text-xs text-star/45">
                    No cards match your search.
                  </li>
                ) : (
                  cards.map((card) => (
                    <LibraryListItem
                      key={card.id}
                      card={card}
                      active={selectedId === card.id}
                      thumbUrl={thumbUrls[card.id]}
                      onSelect={handleSelect}
                    />
                  ))
                )}
              </ul>
            </nav>

            <AnimatePresence mode="wait">
              {selectedId && selected && detailSvg && (
                <motion.aside
                  key="library-detail"
                  className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-nebula/50 sm:min-w-[18rem] sm:max-w-[26rem] sm:shrink-0 sm:border-l sm:border-white/10"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  aria-label={`${selected.quantumName} details`}
                >
                  <motion.div
                    key={selected.id}
                    className="flex min-h-0 flex-1 flex-col"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                  <header className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="rounded-lg px-2 py-1 text-xs text-star/60 hover:bg-white/10 hover:text-star sm:px-2"
                      aria-label="Back to deck library"
                    >
                      <span className="sm:hidden">← Library</span>
                      <span className="hidden sm:inline">←</span>
                    </button>
                    <p className="truncate text-xs text-star/50">
                      <span className="sm:hidden">{selected.quantumName}</span>
                      <span className="hidden sm:inline">Card detail</span>
                    </p>
                  </header>

                  <div className="library-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-xl border border-white/15 bg-void/80 shadow-[0_0_40px_rgba(167,139,250,0.25)] transition-transform duration-500 ${ROTATION[orientation]} ${
                          orientation === "transverse"
                            ? "ring-2 ring-gold/50"
                            : orientation === "conjugate"
                              ? "ring-2 ring-accent/40"
                              : ""
                        }`}
                      >
                        <div
                          className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                          dangerouslySetInnerHTML={{ __html: detailSvg }}
                        />
                      </div>
                      <span
                        className={`mt-3 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${ORIENTATION_STYLE[orientation].badge}`}
                      >
                        {ORIENTATION_LABEL[orientation]}
                      </span>
                    </div>

                    <div className="mt-5 text-center">
                      <h3 className="font-display text-base font-semibold text-accent">
                        {selected.quantumName}
                      </h3>
                      <p className="mt-1 text-sm text-star/55 italic">
                        {selected.classicName}
                      </p>
                      {selected.arcana === "major" ? (
                        <p className="mt-1 font-mono text-[10px] tracking-wide text-star/40 uppercase">
                          Major · {selected.romanLabel}
                        </p>
                      ) : selected.suit ? (
                        <p className="mt-1 font-mono text-[10px] tracking-wide text-star/40 uppercase">
                          {SUIT_QUANTUM[selected.suit]} ·{" "}
                          {String(selected.rank)}
                          <span className="mt-0.5 block font-sans font-normal normal-case tracking-normal text-star/35">
                            {SUIT_CLASSIC[selected.suit]}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                      {ORIENTATIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setOrientation(o)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase transition ${
                            orientation === o
                              ? "bg-gold/25 text-gold ring-1 ring-gold/40"
                              : "bg-white/5 text-star/50 hover:bg-white/10 hover:text-star/80"
                          }`}
                        >
                          {ORIENTATION_SHORT[o]}
                        </button>
                      ))}
                    </div>

                    {reading ? (
                      <article className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left">
                        <p className="text-[10px] font-medium tracking-wide text-gold/80 uppercase">
                          {ORIENTATION_LABEL[orientation]}
                        </p>
                        <div className="mt-4">
                          <ReadingTabs
                            hasPersonal={Boolean(reading.personal)}
                            compact
                            scholarly={
                              <ScholarlyReadingBody
                                reading={reading}
                                orientation={orientation}
                                compact
                                showOrientationNote={false}
                              />
                            }
                            personal={
                              reading.personal ? (
                                <PersonalReadingView
                                  personal={reading.personal}
                                  compact
                                />
                              ) : null
                            }
                          />
                        </div>
                      </article>
                    ) : (
                      <p className="mt-6 text-center text-xs text-red-300/90">
                        Reading missing for this orientation.
                      </p>
                    )}
                  </div>
                  </motion.div>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Bottom-left control to open the library (mirrors QRNG settings placement). */
export function CardLibraryTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-20 rounded-full border border-white/10 bg-void/80 p-2.5 text-star/50 shadow-lg backdrop-blur-sm transition hover:border-accent/40 hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Open card library"
      title="Card library"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
      </svg>
    </button>
  );
}
