import { useCallback, useRef, useState } from "react";
import { takeQrngNotice } from "../api/qrng";
import {
  appendLedgerImpulse,
  appendLedgerPoolSlots,
  createEmptyLedger,
  mixWithMicEntropy,
} from "../lib/micEntropy";
import type { QuantumConsumptionLedger } from "../types/quantumLedger";
import {
  appendBatchToStream,
  createEmptyStream,
  fetchQuantumBatch,
  impulseFromValues,
  nextImpulseFromStream,
  shouldPrefetch,
  streamRemaining,
  takeFromStream,
  trimConsumedFromStream,
} from "../lib/quantumPendulum";
import type { ConsumedImpulse, QuantumStream } from "../types/pendulum";

export type PrefetchStatus = "idle" | "loading" | "ready";

export interface UseQuantumStreamResult {
  stream: QuantumStream;
  ledger: QuantumConsumptionLedger;
  remaining: number;
  prefetchStatus: PrefetchStatus;
  qrngNotice: string | null;
  start: () => Promise<boolean>;
  stop: () => void;
  consumeImpulse: () => ConsumedImpulse | null;
  /**
   * Take the next `count` integers from the shared session pool (FIFO with
   * pendulum impulses). Mic-mixed when mic entropy is on and not ambient-idle.
   */
  consumeIntegers: (count: number, labels?: string[]) => number[] | null;
  clearNotice: () => void;
}

export interface QuantumStreamMicOptions {
  /** Mic hardware on and listening. */
  enabled: boolean;
  /** False during stable ambient — QRNG not mixed. */
  mixingActive: boolean;
  takeByte: () => number;
}

export function useQuantumStream(
  onNotice?: (msg: string) => void,
  mic?: QuantumStreamMicOptions,
): UseQuantumStreamResult {
  const streamRef = useRef<QuantumStream>(createEmptyStream());
  const ledgerRef = useRef<QuantumConsumptionLedger>(createEmptyLedger());
  const prefetchingRef = useRef(false);
  const [stream, setStream] = useState<QuantumStream>(createEmptyStream());
  const [ledger, setLedger] = useState<QuantumConsumptionLedger>(
    createEmptyLedger(),
  );
  const [prefetchStatus, setPrefetchStatus] = useState<PrefetchStatus>("idle");
  const [qrngNotice, setQrngNotice] = useState<string | null>(null);

  const sync = useCallback((next: QuantumStream) => {
    streamRef.current = next;
    setStream(next);
    setPrefetchStatus(
      next.prefetchState === "loading" ? "loading" : "idle",
    );
  }, []);

  const runPrefetch = useCallback(async () => {
    const current = streamRef.current;
    if (prefetchingRef.current || !shouldPrefetch(current)) return;

    prefetchingRef.current = true;
    sync({ ...current, prefetchState: "loading" });
    setPrefetchStatus("loading");

    const batch = await fetchQuantumBatch();
    prefetchingRef.current = false;

    if (!batch) {
      sync({ ...streamRef.current, prefetchState: "idle" });
      setPrefetchStatus("idle");
      return;
    }

    const notice = takeQrngNotice();
    if (notice) {
      setQrngNotice(notice);
      onNotice?.(notice);
    }

    const appended = appendBatchToStream(streamRef.current, batch);
    sync(appended);
    setPrefetchStatus("ready");
  }, [sync, onNotice]);

  const maybePrefetch = useCallback(() => {
    if (shouldPrefetch(streamRef.current)) {
      void runPrefetch();
    }
  }, [runPrefetch]);

  const resetLedger = useCallback(() => {
    const empty = createEmptyLedger();
    ledgerRef.current = empty;
    setLedger(empty);
  }, []);

  const start = useCallback(async (): Promise<boolean> => {
    const empty = createEmptyStream();
    streamRef.current = empty;
    prefetchingRef.current = false;
    resetLedger();
    sync(empty);
    setQrngNotice(null);

    const first = await fetchQuantumBatch();
    if (!first) return false;

    const notice = takeQrngNotice();
    if (notice) {
      setQrngNotice(notice);
      onNotice?.(notice);
    }

    const withFirst = appendBatchToStream(empty, first);
    sync(withFirst);
    return true;
  }, [sync, onNotice, resetLedger]);

  const stop = useCallback(() => {
    prefetchingRef.current = false;
    sync({ ...streamRef.current, prefetchState: "idle" });
    setPrefetchStatus("idle");
    setQrngNotice(null);
  }, [sync]);

  const micMixingActive = Boolean(mic?.enabled && mic?.mixingActive);

  /** Shared FIFO cursor — impulses and circle shift interleave in pool order. */
  const takeFromPool = useCallback(
    (
      count: number,
      options?: { mixMic?: boolean; labels?: string[] },
    ): number[] | null => {
      const cursor = streamRef.current.cursor;
      const poolStart = streamRef.current.poolBaseIndex + cursor;
      const mixMic = options?.mixMic ?? false;
      const capturedMic: number[] = [];
      const mix = mixMic
        ? (qrng: number) => {
            const b = mic!.takeByte() & 0xff;
            capturedMic.push(b);
            return mixWithMicEntropy(qrng, b);
          }
        : undefined;
      const taken = takeFromStream(streamRef.current, count, mix);
      if (!taken) {
        maybePrefetch();
        return null;
      }

      const raw = streamRef.current.pool.slice(cursor, cursor + count);

      if (options?.labels?.length) {
        const micBytes = mixMic
          ? capturedMic.map((b) => b as number | null)
          : raw.map(() => null);
        const nextLedger = appendLedgerPoolSlots(
          ledgerRef.current,
          poolStart,
          raw,
          taken.values,
          options.labels,
          micBytes,
        );
        ledgerRef.current = nextLedger;
        setLedger(nextLedger);
      }

      const trimmed = trimConsumedFromStream(taken.stream);
      streamRef.current = trimmed;
      setStream(trimmed);
      maybePrefetch();
      return taken.values;
    },
    [maybePrefetch, mic],
  );

  const consumeIntegers = useCallback(
    (count: number, labels?: string[]): number[] | null =>
      takeFromPool(count, { mixMic: micMixingActive, labels }),
    [takeFromPool, micMixingActive],
  );

  const consumeImpulse = useCallback((): ConsumedImpulse | null => {
    const poolStart =
      streamRef.current.poolBaseIndex + streamRef.current.cursor;
    const capturedMic: number[] = [];
    const mix = micMixingActive
      ? (qrng: number) => {
          const b = mic!.takeByte() & 0xff;
          capturedMic.push(b);
          return mixWithMicEntropy(qrng, b);
        }
      : undefined;

    const result = nextImpulseFromStream(streamRef.current, mix);
    if (!result) {
      maybePrefetch();
      return null;
    }

    const micBytes = micMixingActive
      ? capturedMic.map((b) => b as number | null)
      : result.raw.map(() => null);
    const nextLedger = appendLedgerImpulse(
      ledgerRef.current,
      poolStart,
      result.raw,
      result.mixed,
      micBytes,
    );
    ledgerRef.current = nextLedger;
    setLedger(nextLedger);

    const trimmed = trimConsumedFromStream(result.stream);
    streamRef.current = trimmed;
    setStream(trimmed);
    maybePrefetch();
    return {
      impulse: result.impulse,
      ...(micMixingActive
        ? { directImpulse: impulseFromValues(result.raw) }
        : {}),
    };
  }, [maybePrefetch, mic, micMixingActive]);

  const clearNotice = useCallback(() => setQrngNotice(null), []);

  return {
    stream,
    ledger,
    remaining: streamRemaining(stream),
    prefetchStatus,
    qrngNotice,
    start,
    stop,
    consumeImpulse,
    consumeIntegers,
    clearNotice,
  };
}
