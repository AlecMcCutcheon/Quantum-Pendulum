import type { CardPersonal } from "./readingPersonal/types";

let personalByCard: Record<string, CardPersonal> | null = null;
let loadPromise: Promise<void> | null = null;

export function loadReadingPersonal(): Promise<void> {
  if (personalByCard) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [majors, wands, cups, swords, pentacles] = await Promise.all([
      import("./readingPersonal/majors"),
      import("./readingPersonal/wands"),
      import("./readingPersonal/cups"),
      import("./readingPersonal/swords"),
      import("./readingPersonal/pentacles"),
    ]);
    personalByCard = {
      ...majors.MAJOR_PERSONAL,
      ...wands.WANDS_PERSONAL,
      ...cups.CUPS_PERSONAL,
      ...swords.SWORDS_PERSONAL,
      ...pentacles.PENTACLES_PERSONAL,
    };
  })();

  return loadPromise;
}

export function getPersonalPatch(cardId: string): CardPersonal | undefined {
  return personalByCard?.[cardId];
}
