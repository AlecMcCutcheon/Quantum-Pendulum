import type { ReadingText } from "../types/reading";
import type { Orientation } from "../types/deck";
import { detailParagraphs } from "../lib/detailParagraphs";

const ORIENTATION_NOTE: Record<Orientation, string> = {
  upright: "Direct pole—expression of the card’s archetype without tilt.",
  reversed: "Inverted pole—internalized energy, delays, shadows, or resistance.",
  transverse:
    "First lateral crossing—this archetype blocking or stretching the path sideways (often liminal, not yet decided).",
  conjugate:
    "Second lateral crossing—another way this archetype crosses you; not “more reversed.” Pair differs per card.",
};

interface ScholarlyReadingBodyProps {
  reading: ReadingText;
  orientation: Orientation;
  compact?: boolean;
  showOrientationNote?: boolean;
}

export function ScholarlyReadingBody({
  reading,
  orientation,
  compact = false,
  showOrientationNote = true,
}: ScholarlyReadingBodyProps) {
  const paragraphs = detailParagraphs(reading.detail);
  const textSm = compact ? "text-xs" : "text-sm";

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {showOrientationNote && (
        <p className={`leading-relaxed text-star/45 ${textSm}`}>
          {ORIENTATION_NOTE[orientation]}
        </p>
      )}
      <div className={`flex flex-col gap-3 ${textSm}`}>
        {paragraphs.map((para) => (
          <p key={para.slice(0, 48)} className="leading-relaxed text-star/80">
            {para}
          </p>
        ))}
      </div>
      <div
        className={`rounded-lg border border-accent/20 bg-accent/5 ${
          compact ? "px-3 py-2" : "px-4 py-3"
        }`}
      >
        <p className="text-xs font-semibold tracking-wide text-gold uppercase">
          Guidance
        </p>
        <p
          className={`mt-2 leading-relaxed text-star/85 ${compact ? "text-xs" : "text-sm"}`}
        >
          {reading.guidance}
        </p>
      </div>
    </div>
  );
}
