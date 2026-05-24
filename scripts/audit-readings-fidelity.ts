/**
 * Fidelity audit: Biddy keywords, boilerplate, near-floor, duplicate personal structure.
 * Run: npm run audit:fidelity
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildAllReadings } from "../src/data/readings/buildReadings.ts";
import { loadReadingDepth } from "../src/data/readings/readingDepthLoader.ts";
import { loadReadingPersonal } from "../src/data/readings/readingPersonalLoader.ts";
import { CUPS_LATERAL } from "../src/data/readings/minorLateral/cups.ts";
import { PENTACLES_LATERAL } from "../src/data/readings/minorLateral/pentacles.ts";
import { SWORDS_LATERAL } from "../src/data/readings/minorLateral/swords.ts";
import { WANDS_LATERAL } from "../src/data/readings/minorLateral/wands.ts";
import { frameReadingForOrientation } from "../src/lib/readingOrientationFraming.ts";
import type { Orientation } from "../src/types/deck.ts";
import type { PersonalReading } from "../src/types/reading.ts";
import {
  DETAIL_MIN,
  PERSONAL_HOOK_MIN,
  PERSONAL_SECTION_MIN,
} from "./audit-readings.ts";
import scholarlyBoilerplate from "./fidelity/boilerplate-phrases.json" with {
  type: "json",
};
import personalBoilerplate from "./fidelity/personal-boilerplate-phrases.json" with {
  type: "json",
};
import majorKeywords from "./fidelity/major-keywords.json" with { type: "json" };

const ORIENTATIONS: Orientation[] = [
  "upright",
  "reversed",
  "transverse",
  "conjugate",
];

const MINOR_LATERAL = {
  ...WANDS_LATERAL,
  ...CUPS_LATERAL,
  ...SWORDS_LATERAL,
  ...PENTACLES_LATERAL,
};

const NEAR_FLOOR_RATIO = 0.1;
const PROTOCOL_HEADING_MAX_CELLS = 4;

type IssueKind =
  | "boilerplate"
  | "keywords"
  | "nearFloor"
  | "duplicateStructure";

interface Issue {
  cardId: string;
  orientation: Orientation;
  kind: IssueKind;
  layer: "scholarly" | "personal" | "both";
  detail: string;
}

interface CellPersonal {
  cardId: string;
  orientation: Orientation;
  personal: PersonalReading;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function keywordTokens(keywordLine: string): string[] {
  return keywordLine
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length >= 4);
}

function hasKeywordMatch(text: string, keywords: string[]): boolean {
  const norm = normalize(text);
  return keywords.some((kw) => {
    const token = kw.trim().toLowerCase();
    if (token.length < 4) return false;
    return norm.includes(token);
  });
}

function expectedKeywords(
  cardId: string,
  orientation: Orientation,
): string[] | null {
  if (cardId.startsWith("major-")) {
    const entry = majorKeywords[cardId as keyof typeof majorKeywords];
    if (!entry) return null;
    const list =
      orientation === "upright" || orientation === "transverse"
        ? entry.upright
        : entry.reversed;
    return list;
  }
  const lateral = MINOR_LATERAL[cardId as keyof typeof MINOR_LATERAL];
  if (!lateral) return null;
  const line =
    orientation === "upright" || orientation === "transverse"
      ? lateral.biddyUpright
      : lateral.biddyReversed;
  return keywordTokens(line);
}

function findBoilerplate(text: string, phrases: string[]): string[] {
  const hits: string[] = [];
  const lower = text.toLowerCase();
  for (const phrase of phrases) {
    if (lower.includes(phrase.toLowerCase())) hits.push(phrase);
  }
  return hits;
}

function personalText(p: PersonalReading | undefined): string {
  if (!p) return "";
  return [
    p.hook,
    p.takeaway,
    ...p.sections.map((s) => `${s.heading} ${s.body}`),
    ...p.protocol.steps.map((s) => `${s.heading} ${s.body}`),
  ].join(" ");
}

function auditDuplicateStructure(cells: CellPersonal[]): Issue[] {
  const issues: Issue[] = [];

  const sectionHeadingToCards = new Map<string, Set<string>>();
  const protocolHeadingToCells = new Map<string, Set<string>>();
  const protocolBodyToCards = new Map<string, Set<string>>();

  for (const { cardId, orientation, personal } of cells) {
    const cellKey = `${cardId}:${orientation}`;
    for (const sec of personal.sections) {
      const h = sec.heading.trim();
      const set = sectionHeadingToCards.get(h) ?? new Set();
      set.add(cardId);
      sectionHeadingToCards.set(h, set);
    }
    for (const step of personal.protocol.steps) {
      const h = step.heading.trim();
      const hSet = protocolHeadingToCells.get(h) ?? new Set();
      hSet.add(cellKey);
      protocolHeadingToCells.set(h, hSet);

      const body = step.body.trim();
      const bSet = protocolBodyToCards.get(body) ?? new Set();
      bSet.add(cardId);
      protocolBodyToCards.set(body, bSet);
    }
  }

  for (const [heading, cardIds] of sectionHeadingToCards) {
    if (cardIds.size > 1) {
      const sample = cells.find((c) => c.personal.sections.some((s) => s.heading.trim() === heading))!;
      issues.push({
        cardId: sample.cardId,
        orientation: sample.orientation,
        kind: "duplicateStructure",
        layer: "personal",
        detail: `section heading reused on ${cardIds.size} cards: "${heading.slice(0, 60)}…"`,
      });
    }
  }

  for (const [heading, cellKeys] of protocolHeadingToCells) {
    if (cellKeys.size > PROTOCOL_HEADING_MAX_CELLS) {
      const first = [...cellKeys][0]!;
      const [cardId, orientation] = first.split(":") as [string, Orientation];
      issues.push({
        cardId,
        orientation,
        kind: "duplicateStructure",
        layer: "personal",
        detail: `protocol heading on ${cellKeys.size} cells (max ${PROTOCOL_HEADING_MAX_CELLS}): "${heading.slice(0, 60)}…"`,
      });
    }
  }

  for (const [body, cardIds] of protocolBodyToCards) {
    if (cardIds.size > 1 && body.length > 80) {
      const sample = cells.find((c) =>
        c.personal.protocol.steps.some((s) => s.body.trim() === body),
      )!;
      issues.push({
        cardId: sample.cardId,
        orientation: sample.orientation,
        kind: "duplicateStructure",
        layer: "personal",
        detail: `identical protocol step body on ${cardIds.size} cards (${body.length} chars)`,
      });
    }
  }

  return issues;
}

function audit(): Issue[] {
  const readings = buildAllReadings();
  const issues: Issue[] = [];
  const personalCells: CellPersonal[] = [];

  for (const card of readings) {
    for (const orientation of ORIENTATIONS) {
      const raw = card[orientation];
      const reading = frameReadingForOrientation(raw, orientation);
      const scholarlyBlob = `${reading.summary} ${reading.detail} ${reading.guidance}`;
      const personalBlob = personalText(reading.personal);

      if (reading.personal) {
        personalCells.push({
          cardId: card.cardId,
          orientation,
          personal: reading.personal,
        });
      }

      const boilerplateScholarly = findBoilerplate(scholarlyBlob, scholarlyBoilerplate);
      const boilerplatePersonal = findBoilerplate(personalBlob, personalBoilerplate);
      if (boilerplateScholarly.length > 0) {
        issues.push({
          cardId: card.cardId,
          orientation,
          kind: "boilerplate",
          layer: "scholarly",
          detail: boilerplateScholarly.join("; "),
        });
      }
      if (boilerplatePersonal.length > 0) {
        issues.push({
          cardId: card.cardId,
          orientation,
          kind: "boilerplate",
          layer: "personal",
          detail: boilerplatePersonal.join("; "),
        });
      }

      const keywords = expectedKeywords(card.cardId, orientation);
      if (keywords && keywords.length > 0) {
        const combined = `${scholarlyBlob} ${reading.personal?.hook ?? ""}`;
        if (!hasKeywordMatch(combined, keywords)) {
          issues.push({
            cardId: card.cardId,
            orientation,
            kind: "keywords",
            layer: reading.personal ? "both" : "scholarly",
            detail: `No match for: ${keywords.slice(0, 5).join(", ")}…`,
          });
        }
      }

      const detailFloor = DETAIL_MIN * (1 + NEAR_FLOOR_RATIO);
      if (reading.detail.length <= detailFloor) {
        issues.push({
          cardId: card.cardId,
          orientation,
          kind: "nearFloor",
          layer: "scholarly",
          detail: `detail=${reading.detail.length} (floor band ≤${Math.floor(detailFloor)})`,
        });
      }

      if (reading.personal) {
        for (const [i, sec] of reading.personal.sections.entries()) {
          const secFloor = PERSONAL_SECTION_MIN * (1 + NEAR_FLOOR_RATIO);
          if (sec.body.length <= secFloor) {
            issues.push({
              cardId: card.cardId,
              orientation,
              kind: "nearFloor",
              layer: "personal",
              detail: `section[${i}]=${sec.body.length} (floor band ≤${Math.floor(secFloor)})`,
            });
          }
        }
        const hookFloor = PERSONAL_HOOK_MIN * (1 + NEAR_FLOOR_RATIO);
        if (reading.personal.hook.length <= hookFloor) {
          issues.push({
            cardId: card.cardId,
            orientation,
            kind: "nearFloor",
            layer: "personal",
            detail: `hook=${reading.personal.hook.length}`,
          });
        }
      }
    }
  }

  issues.push(...auditDuplicateStructure(personalCells));
  return issues;
}

async function main(): Promise<void> {
  const failOnIssues = process.argv.includes("--fail");
  const cardFilter = process.argv.find((a) => a.startsWith("--card="))?.slice(7);
  const writeJson = process.argv.includes("--json");

  await Promise.all([loadReadingDepth(), loadReadingPersonal()]);
  let issues = audit();
  if (cardFilter) {
    issues = issues.filter((i) => i.cardId === cardFilter);
  }

  const byKind: Record<IssueKind, number> = {
    boilerplate: 0,
    keywords: 0,
    nearFloor: 0,
    duplicateStructure: 0,
  };
  for (const i of issues) byKind[i.kind]++;

  const cells = 312;
  const cellsWithIssues = new Set(
    issues.map((i) => `${i.cardId}:${i.orientation}`),
  ).size;

  console.log(
    `Fidelity audit: ${cells - cellsWithIssues}/${cells} cells clean | ` +
      `boilerplate=${byKind.boilerplate} keywords=${byKind.keywords} ` +
      `duplicateStructure=${byKind.duplicateStructure} nearFloor=${byKind.nearFloor}`,
  );

  if (issues.length > 0 && !cardFilter) {
    const byCard = new Map<string, Issue[]>();
    for (const i of issues) {
      const list = byCard.get(i.cardId) ?? [];
      list.push(i);
      byCard.set(i.cardId, list);
    }
    const sorted = [...byCard.entries()].sort(
      (a, b) => b[1].length - a[1].length,
    );
    for (const [cardId, list] of sorted.slice(0, 25)) {
      const parts = list
        .map((i) => `${i.orientation[0]}:${i.kind[0]}${i.layer[0]}`)
        .join(" ");
      console.log(`${cardId}  ${parts}`);
    }
    if (sorted.length > 25) {
      console.log(`… and ${sorted.length - 25} more cards`);
    }
  } else if (cardFilter) {
    for (const i of issues) {
      console.log(
        `${i.orientation} ${i.kind} [${i.layer}] ${i.detail.slice(0, 120)}`,
      );
    }
  }

  if (writeJson) {
    const root = dirname(fileURLToPath(import.meta.url));
    const outDir = join(root, "out");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      join(outDir, "fidelity-report.json"),
      JSON.stringify({ generatedAt: new Date().toISOString(), issues }, null, 2),
    );
    console.log("Wrote scripts/out/fidelity-report.json");
  }

  const critical = issues.filter(
    (i) =>
      i.kind === "boilerplate" ||
      i.kind === "keywords" ||
      i.kind === "duplicateStructure",
  );
  if (failOnIssues && critical.length > 0 && !cardFilter) {
    process.exit(1);
  }
}

void main();
