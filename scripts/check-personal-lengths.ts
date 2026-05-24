import { buildAllReadings } from "../src/data/readings/buildReadings.ts";
import { loadReadingPersonal } from "../src/data/readings/readingPersonalLoader.ts";
import { frameReadingForOrientation } from "../src/lib/readingOrientationFraming.ts";

const HOOK = 280;
const SEC = 400;
const STEP = 120;
const TAKE = 150;

async function main(): Promise<void> {
  await loadReadingPersonal();
  const filter = process.argv[2];
  for (const card of buildAllReadings()) {
    if (filter && !card.cardId.startsWith(filter)) continue;
    for (const o of ["upright", "reversed", "transverse", "conjugate"] as const) {
      const p = frameReadingForOrientation(card[o], o).personal;
      if (!p) {
        console.log(`${card.cardId} ${o} MISSING`);
        continue;
      }
      const issues: string[] = [];
      if (p.hook.length < HOOK) issues.push(`hook=${p.hook.length}`);
      if (p.takeaway.length < TAKE) issues.push(`take=${p.takeaway.length}`);
      p.sections.forEach((s, i) => {
        if (s.body.length < SEC) issues.push(`sec${i}=${s.body.length}`);
      });
      p.protocol.steps.forEach((s, i) => {
        if (s.body.length < STEP) issues.push(`step${i}=${s.body.length}`);
      });
      if (issues.length) console.log(`${card.cardId} ${o} ${issues.join(" ")}`);
    }
  }
}

void main();
