import { DIVINATION_CIRCLES } from "../data/divinationCircles";

/** One integer per vote tick (also schedules the next vote delay). */
export const CIRCLE_VOTE_INTS = 1;

export const CIRCLE_POOL_LABELS = {
  vote: "circle shift · vote",
  swapPick: "circle shift · swap pick",
} as const;

/** Drawn only after the vote tally commits to a swap. */
export const CIRCLE_SWAP_PICK_INTS = 1;

/** How often a new vote is cast while deliberating on the current circle. */
export const CIRCLE_VOTE_LIMITS = {
  minVoteIntervalMs: 5_000,
  maxVoteIntervalMs: 20_000,
} as const;

/** Net “change” votes required to swap the disc. */
export const CIRCLE_SHIFT_THRESHOLD = 4;

function unit(n: number): number {
  return (Math.abs(n) % 1_000_000) / 1_000_000;
}

export function circleVoteIntervalMs(intervalRaw: number): number {
  const t = unit(intervalRaw);
  return Math.round(
    CIRCLE_VOTE_LIMITS.minVoteIntervalMs +
      t *
        (CIRCLE_VOTE_LIMITS.maxVoteIntervalMs -
          CIRCLE_VOTE_LIMITS.minVoteIntervalMs),
  );
}

/** Fair ±1 step from one QRNG integer (50/50). */
export function voteDeltaFromRaw(raw: number): 1 | -1 {
  return unit(raw) < 0.5 ? 1 : -1;
}

/**
 * Symmetric tally: +1 = nudge change, −1 = nudge keep.
 * Hitting −threshold resets to neutral.
 */
export function applyCircleVoteScore(
  score: number,
  delta: 1 | -1,
): number {
  const next = score + delta;
  if (next >= CIRCLE_SHIFT_THRESHOLD) return CIRCLE_SHIFT_THRESHOLD;
  if (next <= -CIRCLE_SHIFT_THRESHOLD) return 0;
  return next;
}

export function circleShiftLeanPct(score: number): number {
  const t = score / CIRCLE_SHIFT_THRESHOLD;
  return Math.round(Math.max(0, Math.min(100, 50 + t * 50)));
}

export function canFinalizeCircleSwap(score: number): boolean {
  return score >= CIRCLE_SHIFT_THRESHOLD;
}

/** Pick another circle id; never empty — falls back to full list if alone. */
export function pickCircleIdFromQrng(
  pickRaw: number,
  currentId: string,
): string {
  const others = DIVINATION_CIRCLES.filter((c) => c.id !== currentId);
  const pool = others.length > 0 ? others : DIVINATION_CIRCLES;
  const idx = Math.floor(unit(pickRaw) * pool.length) % pool.length;
  return pool[idx]!.id;
}

export function formatDeliberationTime(ms: number): string {
  if (ms < 90_000) return `${Math.round(ms / 1000)}s`;
  const min = Math.round(ms / 60_000);
  return min === 1 ? "1 min" : `${min} min`;
}

export interface CircleShiftLive {
  score: number;
  threshold: number;
  /** 0–100: 50 neutral, higher leans change, lower leans keep */
  leanPct: number;
  windowStartMs: number;
  votesCast: number;
}

export function buildCircleShiftLive(
  score: number,
  windowStartMs: number,
  votesCast: number,
): CircleShiftLive {
  return {
    score,
    threshold: CIRCLE_SHIFT_THRESHOLD,
    leanPct: circleShiftLeanPct(score),
    windowStartMs,
    votesCast,
  };
}

export function circleShiftWindowElapsedMs(
  live: CircleShiftLive,
  nowMs: number = Date.now(),
): number {
  return Math.max(0, nowMs - live.windowStartMs);
}
