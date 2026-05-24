/** Strong pivots — always start a new paragraph when the next chunk begins here. */
const STRONG_PIVOTS = [
  "At work,",
  "In work,",
  "In relationships,",
  "In love,",
  "In the body,",
  "In body,",
  "In inner life,",
  "Internally,",
  "Quantumally,",
  "The universal law",
  "The universal mechanic",
];

const MIN_PARAGRAPH_CHARS = 200;
const TARGET_MAX_CHARS = 520;
const HARD_MAX_CHARS = 680;
const MAX_SENTENCES_PER_PARAGRAPH = 4;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitSentences(text: string): string[] {
  return (
    text.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()) ??
    [text.trim()]
  ).filter(Boolean);
}

function startsStrongPivot(text: string): boolean {
  const trimmed = text.trim();
  return STRONG_PIVOTS.some(
    (p) =>
      trimmed.startsWith(p) ||
      trimmed.toLowerCase().startsWith(p.toLowerCase()),
  );
}

function splitOnStrongPivots(text: string): string[] {
  const pivotPattern = STRONG_PIVOTS.map(escapeRegex).join("|");
  const re = new RegExp(`(?<=[.!?])\\s+(?=${pivotPattern})`, "gi");
  return text
    .split(re)
    .map((p) => p.trim())
    .filter(Boolean);
}

function groupBySentenceCount(text: string, maxSentences: number): string[] {
  const sentences = splitSentences(text);
  if (sentences.length <= maxSentences) return [text.trim()];

  const paragraphs: string[] = [];
  let batch: string[] = [];

  for (const sentence of sentences) {
    batch.push(sentence);
    if (batch.length >= maxSentences) {
      paragraphs.push(batch.join(" "));
      batch = [];
    }
  }
  if (batch.length) paragraphs.push(batch.join(" "));
  return paragraphs;
}

function splitOversized(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= HARD_MAX_CHARS) return [trimmed];
  return groupBySentenceCount(trimmed, MAX_SENTENCES_PER_PARAGRAPH);
}

/** Merge choppy single-sentence blocks into readable paragraphs. */
function coalesceParagraphs(chunks: string[]): string[] {
  if (chunks.length <= 1) return chunks;

  const merged: string[] = [];
  let buffer = chunks[0]?.trim() ?? "";

  for (let i = 1; i < chunks.length; i++) {
    const next = chunks[i]?.trim() ?? "";
    if (!next) continue;

    if (startsStrongPivot(next)) {
      if (
        buffer.length < MIN_PARAGRAPH_CHARS &&
        merged.length > 0 &&
        !startsStrongPivot(buffer)
      ) {
        merged[merged.length - 1] =
          `${merged[merged.length - 1] ?? ""} ${buffer}`.trim();
      } else if (buffer) {
        merged.push(buffer);
      }
      buffer = next;
      continue;
    }

    const combined = `${buffer} ${next}`.trim();
    const sentenceCount =
      splitSentences(buffer).length + splitSentences(next).length;

    const shouldMerge =
      buffer.length < MIN_PARAGRAPH_CHARS ||
      (combined.length <= TARGET_MAX_CHARS &&
        sentenceCount <= MAX_SENTENCES_PER_PARAGRAPH);

    if (shouldMerge) {
      buffer = combined;
    } else {
      merged.push(buffer);
      buffer = next;
    }
  }

  if (buffer) {
    if (
      buffer.length < MIN_PARAGRAPH_CHARS &&
      merged.length > 0 &&
      !startsStrongPivot(buffer)
    ) {
      merged[merged.length - 1] =
        `${merged[merged.length - 1] ?? ""} ${buffer}`.trim();
    } else {
      merged.push(buffer);
    }
  }
  return merged;
}

/** Split detail string into paragraphs for readable layout. */
export function detailParagraphs(detail: string): string[] {
  const trimmed = detail.trim();
  if (!trimmed) return [];

  const explicit = trimmed
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  let paragraphs =
    explicit.length > 1
      ? coalesceParagraphs(explicit)
      : coalesceParagraphs(splitOnStrongPivots(explicit[0] ?? trimmed));

  if (paragraphs.length === 1) {
    paragraphs = coalesceParagraphs(
      groupBySentenceCount(paragraphs[0] ?? trimmed, MAX_SENTENCES_PER_PARAGRAPH),
    );
  }

  return paragraphs.flatMap((para) => splitOversized(para));
}
