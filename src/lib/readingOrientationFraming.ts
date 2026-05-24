import type { Orientation } from "../types/deck";
import type { ReadingText } from "../types/reading";
import { isLateralOrientation } from "./cardOrientationUi";

const POLE: Record<"transverse" | "conjugate", string> = {
  transverse: "Transverse",
  conjugate: "Conjugate",
};

function reframeSummary(summary: string, pole: string): string {
  if (new RegExp(`^${pole}\\b`, "i").test(summary.trim())) {
    return summary;
  }
  let body = summary
    .replace(/^Reversed,\s*/i, "")
    .replace(/^Reversed\s+/i, "")
    .trim();
  body = body.replace(new RegExp(`^${pole}\\s*[—–-]\\s*`, "i"), "").trim();
  return `${pole} — ${body}`;
}

/** Retarget upright/reversed openers in the lead of lateral detail copy. */
function reframeDetailLead(detail: string, pole: string): string {
  const leadLen = 320;
  const head = detail.slice(0, leadLen);
  const tail = detail.slice(leadLen);
  const reframed = head
    .replace(/^Traditionally reversed,\s*/i, `In the ${pole.toLowerCase()} crossing, `)
    .replace(/^Traditionally upright,\s*/i, `In the ${pole.toLowerCase()} crossing, `)
    .replace(/^Reversed\s+([A-Za-z0-9'’\s]+?)([.,:—–-])/i, `${pole} — $1$2`)
    .replace(
      /^([A-Za-z0-9'’\s]+ of [A-Za-z]+)\s+upright:/i,
      `${pole} — $1:`,
    )
    .replace(/\bupright:\s*/i, `${pole.toLowerCase()} crossing — `)
    .replace(/\breversed:\s*/i, `${pole.toLowerCase()} crossing — `);
  return reframed + tail;
}

export function frameReadingForOrientation(
  reading: ReadingText,
  orientation: Orientation,
): ReadingText {
  if (!isLateralOrientation(orientation)) {
    return reading;
  }
  const pole = POLE[orientation as keyof typeof POLE];
  return {
    summary: reframeSummary(reading.summary, pole),
    detail: reframeDetailLead(reading.detail, pole),
    guidance: reading.guidance,
    personal: reading.personal,
  };
}
