import type { CardReading } from "../../types/reading";
import type { Orientation } from "../../types/deck";
import { frameReadingForOrientation } from "../../lib/readingOrientationFraming";
import { buildAllReadings } from "./buildReadings";
import { loadReadingDepth } from "./readingDepthLoader";
import { loadReadingPersonal } from "./readingPersonalLoader";

let readingsMap: Map<string, CardReading> | null = null;
let initPromise: Promise<void> | null = null;

function rebuildMap(): void {
  readingsMap = new Map(buildAllReadings().map((r) => [r.cardId, r]));
}

/** Preload full deck readings (depth chunks + build). Call during splash. */
export function initReadings(): Promise<void> {
  if (readingsMap) return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = Promise.all([loadReadingDepth(), loadReadingPersonal()]).then(
    () => {
      rebuildMap();
    },
  );

  return initPromise;
}

export function areReadingsReady(): boolean {
  return readingsMap !== null;
}

export function getReading(
  cardId: string,
  orientation: Orientation,
): CardReading[Orientation] | undefined {
  if (!readingsMap) return undefined;
  const card = readingsMap.get(cardId);
  const reading = card?.[orientation];
  return reading ? frameReadingForOrientation(reading, orientation) : undefined;
}
