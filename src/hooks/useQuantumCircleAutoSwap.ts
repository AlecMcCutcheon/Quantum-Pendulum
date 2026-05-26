import { useCallback, useEffect, useRef, useState } from "react";
import {
  CIRCLE_POOL_LABELS,
  CIRCLE_SWAP_PICK_INTS,
  CIRCLE_VOTE_INTS,
  applyCircleVoteScore,
  buildCircleShiftLive,
  canFinalizeCircleSwap,
  circleVoteIntervalMs,
  pickCircleIdFromQrng,
  voteDeltaFromRaw,
  type CircleShiftLive,
} from "../lib/quantumCircleAuto";

const RETRY_MS_MIN = 2000;
const RETRY_MS_MAX = 12_000;

export interface UseQuantumCircleAutoSwapOptions {
  enabled: boolean;
  running: boolean;
  circleId: string;
  onCircleId: (id: string) => void;
  consumeIntegers: (count: number, labels?: string[]) => number[] | null;
}

export interface UseQuantumCircleAutoSwapResult {
  live: CircleShiftLive | null;
}

/**
 * Circle shift draws share the session QRNG pool with pendulum impulses (FIFO).
 * Swap when net change votes hit threshold — no min/max deliberation window.
 */
export function useQuantumCircleAutoSwap({
  enabled,
  running,
  circleId,
  onCircleId,
  consumeIntegers,
}: UseQuantumCircleAutoSwapOptions): UseQuantumCircleAutoSwapResult {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const circleIdRef = useRef(circleId);
  const consumeRef = useRef(consumeIntegers);
  const onCircleIdRef = useRef(onCircleId);
  const scoreRef = useRef(0);
  const votesRef = useRef(0);
  const windowStartRef = useRef(0);
  const enabledRef = useRef(enabled);
  const runningRef = useRef(running);
  const retryMsRef = useRef(RETRY_MS_MIN);

  const [live, setLive] = useState<CircleShiftLive | null>(null);

  enabledRef.current = enabled;
  runningRef.current = running;
  circleIdRef.current = circleId;
  consumeRef.current = consumeIntegers;
  onCircleIdRef.current = onCircleId;

  const syncLive = useCallback(() => {
    if (!enabledRef.current || !runningRef.current || windowStartRef.current === 0) {
      setLive(null);
      return;
    }
    setLive(
      buildCircleShiftLive(
        scoreRef.current,
        windowStartRef.current,
        votesRef.current,
      ),
    );
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetWindow = useCallback(() => {
    scoreRef.current = 0;
    votesRef.current = 0;
    windowStartRef.current = Date.now();
    syncLive();
  }, [syncLive]);

  const performSwap = useCallback(
    (pickRaw: number) => {
      const nextId = pickCircleIdFromQrng(pickRaw, circleIdRef.current);
      onCircleIdRef.current(nextId);
      resetWindow();
    },
    [resetWindow],
  );

  const scheduleAfter = useCallback((delayMs: number, fn: () => void) => {
    clearTimer();
    timerRef.current = setTimeout(fn, delayMs);
  }, [clearTimer]);

  const runVoteTickRef = useRef<() => void>(() => {});

  const scheduleNextVote = useCallback((delayMs: number) => {
    scheduleAfter(delayMs, () => runVoteTickRef.current());
  }, [scheduleAfter]);

  runVoteTickRef.current = () => {
    if (!enabledRef.current || !runningRef.current) return;

    const vote = consumeRef.current(CIRCLE_VOTE_INTS, [CIRCLE_POOL_LABELS.vote]);
    if (!vote || vote.length < CIRCLE_VOTE_INTS) {
      scheduleAfter(retryMsRef.current, () => runVoteTickRef.current());
      retryMsRef.current = Math.min(
        RETRY_MS_MAX,
        retryMsRef.current + RETRY_MS_MIN,
      );
      return;
    }
    retryMsRef.current = RETRY_MS_MIN;

    votesRef.current += 1;
    scoreRef.current = applyCircleVoteScore(
      scoreRef.current,
      voteDeltaFromRaw(vote[0]!),
    );
    syncLive();

    if (canFinalizeCircleSwap(scoreRef.current)) {
      const pick = consumeRef.current(CIRCLE_SWAP_PICK_INTS, [
        CIRCLE_POOL_LABELS.swapPick,
      ]);
      if (!pick || pick.length < CIRCLE_SWAP_PICK_INTS) {
        scheduleAfter(retryMsRef.current, () => runVoteTickRef.current());
        retryMsRef.current = Math.min(
          RETRY_MS_MAX,
          retryMsRef.current + RETRY_MS_MIN,
        );
        return;
      }
      performSwap(pick[0]!);
      scheduleNextVote(circleVoteIntervalMs(vote[0]!));
      return;
    }

    scheduleNextVote(circleVoteIntervalMs(vote[0]!));
  };

  const armVoteLoop = useCallback(() => {
    if (!enabledRef.current || !runningRef.current) return;

    const kickoff = consumeRef.current(CIRCLE_VOTE_INTS, [
      CIRCLE_POOL_LABELS.vote,
    ]);
    if (!kickoff || kickoff.length < CIRCLE_VOTE_INTS) {
      scheduleAfter(retryMsRef.current, armVoteLoop);
      return;
    }
    retryMsRef.current = RETRY_MS_MIN;
    scheduleNextVote(circleVoteIntervalMs(kickoff[0]!));
  }, [scheduleAfter, scheduleNextVote]);

  useEffect(() => {
    if (!enabled || !running) return;
    resetWindow();
  }, [circleId, enabled, running, resetWindow]);

  useEffect(() => {
    if (enabled && running) {
      if (windowStartRef.current === 0) resetWindow();
      armVoteLoop();
    } else {
      clearTimer();
      scoreRef.current = 0;
      votesRef.current = 0;
      windowStartRef.current = 0;
      retryMsRef.current = RETRY_MS_MIN;
      setLive(null);
    }
    return clearTimer;
  }, [enabled, running, armVoteLoop, clearTimer, resetWindow]);

  useEffect(() => {
    if (!enabled || !running) return;
    const id = setInterval(syncLive, 1000);
    return () => clearInterval(id);
  }, [enabled, running, syncLive]);

  return { live };
}
