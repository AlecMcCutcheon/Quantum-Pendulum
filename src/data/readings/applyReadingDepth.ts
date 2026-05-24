import type { Orientation } from "../../types/deck";
import type { ReadingText } from "../../types/reading";
import { getDepthPatch } from "./readingDepthLoader";
import { getPersonalPatch } from "./readingPersonalLoader";

export function applyReadingDepth(
  cardId: string,
  orientation: Orientation,
  reading: ReadingText,
): ReadingText {
  const depth = getDepthPatch(cardId)?.[orientation];
  const personal = getPersonalPatch(cardId)?.[orientation]?.personal;

  if (!depth && !personal) return reading;

  return {
    summary: depth?.summary ?? reading.summary,
    detail: depth?.detail ?? reading.detail,
    guidance: depth?.guidance ?? reading.guidance,
    personal: personal ?? depth?.personal ?? reading.personal,
  };
}
