import { useState } from "react";
import { motion } from "framer-motion";
import type { ReadingText } from "../types/reading";
import type { Orientation, TarotCard } from "../types/deck";
import { ORIENTATION_SHORT } from "../lib/cardOrientationUi";
import { PersonalReadingView } from "./PersonalReadingView";
import { ReadingTabs } from "./ReadingTabs";
import { ScholarlyReadingBody } from "./ScholarlyReadingBody";

interface ReadingPanelProps {
  card: TarotCard;
  reading: ReadingText;
  orientation: Orientation;
  /** In dual layout: smaller header, starts collapsed */
  variant?: "full" | "solo";
  sectionLabel?: string;
}

export function ReadingPanel({
  card,
  reading,
  orientation,
  variant = "full",
  sectionLabel,
}: ReadingPanelProps) {
  const [expanded, setExpanded] = useState(variant === "full");

  const isSolo = variant === "solo";
  const hasPersonal = Boolean(reading.personal);

  return (
    <motion.article
      className={`mx-auto w-full text-left max-sm:backdrop-blur-none backdrop-blur-sm ${
        isSolo
          ? "rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
          : "w-full rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isSolo ? 0.1 : 0.25 }}
    >
      {sectionLabel && (
        <p className="text-[10px] font-medium tracking-wide text-star/45 uppercase">
          {sectionLabel}
        </p>
      )}
      <p
        className={`font-medium tracking-wide text-accent/80 uppercase ${
          sectionLabel ? "mt-1" : ""
        } ${isSolo ? "text-[10px]" : "text-xs"}`}
      >
        Solo · {ORIENTATION_SHORT[orientation]}
      </p>
      <h2
        className={`font-display font-semibold text-accent ${
          isSolo ? "mt-1 text-base" : "mt-2 text-xl"
        }`}
      >
        {card.quantumName}
      </h2>
      <p className={`text-star/50 italic ${isSolo ? "text-xs" : "text-sm"}`}>
        {card.classicName}
      </p>

      {!expanded && (
        <p
          className={`leading-relaxed font-medium text-star/95 ${
            isSolo ? "mt-3 text-sm" : "mt-5 text-base"
          }`}
        >
          {reading.summary}
        </p>
      )}

      {expanded && (
        <div className={isSolo ? "mt-3" : "mt-5"}>
          <ReadingTabs
            hasPersonal={hasPersonal}
            compact={isSolo}
            scholarly={
              <ScholarlyReadingBody
                reading={reading}
                orientation={orientation}
                compact={isSolo}
                showOrientationNote={isSolo}
              />
            }
            personal={
              reading.personal ? (
                <PersonalReadingView
                  personal={reading.personal}
                  compact={isSolo}
                />
              ) : null
            }
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-4 text-sm text-accent underline-offset-2 hover:underline"
      >
        {expanded ? "Show less" : "Read full interpretation"}
      </button>
    </motion.article>
  );
}
