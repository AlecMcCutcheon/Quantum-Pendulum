/**
 * Audit built readings for minimum depth. Run: npm run audit:readings
 */
import { buildAllReadings } from "../src/data/readings/buildReadings.ts";
import { loadReadingDepth } from "../src/data/readings/readingDepthLoader.ts";
import { loadReadingPersonal } from "../src/data/readings/readingPersonalLoader.ts";
import { frameReadingForOrientation } from "../src/lib/readingOrientationFraming.ts";
import type { Orientation } from "../src/types/deck.ts";
import type { PersonalReading } from "../src/types/reading.ts";

const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

export const DETAIL_MIN = 800;
export const GUIDANCE_MIN = 120;
export const SUMMARY_MIN = 80;

export const PERSONAL_HOOK_MIN = 280;
export const PERSONAL_SECTION_MIN = 400;
export const PERSONAL_STEP_MIN = 120;
export const PERSONAL_TAKEAWAY_MIN = 150;

function personalOk(p: PersonalReading | undefined): boolean {
  if (!p) return false;
  if (p.hook.length < PERSONAL_HOOK_MIN) return false;
  if (p.takeaway.length < PERSONAL_TAKEAWAY_MIN) return false;
  if (p.sections.length < 2) return false;
  if (p.protocol.steps.length < 3) return false;
  if (p.sections.some((s) => s.body.length < PERSONAL_SECTION_MIN)) return false;
  if (p.protocol.steps.some((s) => s.body.length < PERSONAL_STEP_MIN)) return false;
  return true;
}

interface Row {
  cardId: string;
  orientation: Orientation;
  detailLen: number;
  guidanceLen: number;
  summaryLen: number;
  scholarlyOk: boolean;
  personalOk: boolean;
}

function audit(): { rows: Row[]; failures: Row[] } {
  const readings = buildAllReadings();
  const rows: Row[] = [];

  for (const card of readings) {
    for (const orientation of ORIENTATIONS) {
      const raw = card[orientation];
      const reading = frameReadingForOrientation(raw, orientation);
      const scholarlyOk =
        reading.detail.length >= DETAIL_MIN &&
        reading.guidance.length >= GUIDANCE_MIN &&
        reading.summary.length >= SUMMARY_MIN;
      const personalPass = personalOk(reading.personal);
      rows.push({
        cardId: card.cardId,
        orientation,
        detailLen: reading.detail.length,
        guidanceLen: reading.guidance.length,
        summaryLen: reading.summary.length,
        scholarlyOk,
        personalOk: personalPass,
      });
    }
  }

  const failures = rows.filter((r) => !r.scholarlyOk || !r.personalOk);
  return { rows, failures };
}

async function main(): Promise<void> {
  const failOnShort = process.argv.includes("--fail");
  const cardFilter = process.argv.find((a) => a.startsWith("--card="))?.slice(7);

  await Promise.all([loadReadingDepth(), loadReadingPersonal()]);
  const { rows, failures } = audit();
  const filtered = cardFilter
    ? rows.filter((r) => r.cardId === cardFilter)
    : rows;

  const short = cardFilter
    ? filtered.filter((r) => !r.scholarlyOk || !r.personalOk)
    : failures;

  const scholarlyPass = rows.filter((r) => r.scholarlyOk).length;
  const personalPass = rows.filter((r) => r.personalOk).length;

  console.log(
    `Scholarly: ${scholarlyPass}/${rows.length} | Personal: ${personalPass}/${rows.length}`,
  );

  if (cardFilter) {
    for (const r of filtered) {
      const mark =
        r.scholarlyOk && r.personalOk
          ? "OK"
          : `${r.scholarlyOk ? "" : "S"}${r.personalOk ? "" : "P"}`;
      console.log(
        `${mark}  ${r.cardId} ${r.orientation}  detail=${r.detailLen}  personal=${r.personalOk}`,
      );
    }
  } else if (short.length > 0) {
    const byCard = new Map<string, Row[]>();
    for (const r of short) {
      const list = byCard.get(r.cardId) ?? [];
      list.push(r);
      byCard.set(r.cardId, list);
    }
    for (const [cardId, poles] of byCard) {
      const parts = poles
        .map((p) => {
          const flags = `${p.scholarlyOk ? "" : "s"}${p.personalOk ? "" : "p"}`;
          return `${p.orientation[0]}${flags || "ok"}`;
        })
        .join(" ");
      console.log(`${cardId}  ${parts}`);
    }
  }

  if (failOnShort && failures.length > 0 && !cardFilter) {
    process.exit(1);
  }
}

void main();
