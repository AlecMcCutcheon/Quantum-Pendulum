import { useCallback, useEffect, useRef, useState } from "react";
import {
  AmbientLevelTracker,
  smoothMicLevel,
  type MicEntropyPhase,
} from "../lib/micAmbient";

const RING_SIZE = 4096;
const ANALYSER_FFT = 256;

export type MicEntropyStatus = "off" | "requesting" | "on" | "denied" | "error";

export interface MicLiveStats {
  /** 0–100 RMS of time-domain signal (proves live input). */
  level: number;
  /** Samples in the live tail window (not a backlog queue). */
  liveWindow: number;
  lastSampleByte: number;
}

export interface UseLiveMicEntropyResult {
  enabled: boolean;
  status: MicEntropyStatus;
  error: string | null;
  live: MicLiveStats;
  /** Stable ambient noise — mic does not shift QRNG. */
  entropyPhase: MicEntropyPhase;
  /** Mic on and not in ambient-idle (actually mixing). */
  mixingActive: boolean;
  setEnabled: (on: boolean) => void;
  takeByte: () => number;
  resetForSession: () => void;
}

export function useLiveMicEntropy(): UseLiveMicEntropyResult {
  const [enabled, setEnabledState] = useState(false);
  const [status, setStatus] = useState<MicEntropyStatus>("off");
  const [error, setError] = useState<string | null>(null);
  const [entropyPhase, setEntropyPhase] = useState<MicEntropyPhase>("idle");
  const [live, setLive] = useState<MicLiveStats>({
    level: 0,
    liveWindow: 0,
    lastSampleByte: 128,
  });

  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const ringRef = useRef(new Uint8Array(RING_SIZE));
  const writeRef = useRef(0);
  const readRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const ambientRef = useRef(new AmbientLevelTracker());
  const smoothedLevelRef = useRef(0);
  const lastSampleAtRef = useRef(performance.now());

  const stopCapture = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void audioRef.current?.close();
    audioRef.current = null;
    analyserRef.current = null;
    ambientRef.current.reset();
    setEntropyPhase("idle");
  }, []);

  const pumpSamples = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const now = performance.now();
    const dt = Math.min(80, now - lastSampleAtRef.current);
    lastSampleAtRef.current = now;

    const scratch = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(scratch);
    const ring = ringRef.current;
    let w = writeRef.current;
    let sumSq = 0;
    let last = 128;
    for (let i = 0; i < scratch.length; i++) {
      const b = scratch[i]!;
      ring[w % RING_SIZE] = b;
      w++;
      const centered = (b - 128) / 128;
      sumSq += centered * centered;
      last = b;
    }
    writeRef.current = w;
    const rms = Math.sqrt(sumSq / scratch.length);
    const rawLevel = Math.min(100, Math.round(rms * 140));
    const level = smoothMicLevel(smoothedLevelRef.current, rawLevel);
    smoothedLevelRef.current = level;

    ambientRef.current.push(level, dt);
    setEntropyPhase(ambientRef.current.phase);

    setLive({
      level,
      liveWindow: scratch.length,
      lastSampleByte: last,
    });
    rafRef.current = requestAnimationFrame(pumpSamples);
  }, []);

  const startCapture = useCallback(async () => {
    stopCapture();
    setError(null);
    setStatus("requesting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setError("Microphone not supported in this browser.");
      setEnabledState(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });
      const ctx = new AudioContext();
      await ctx.resume();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = ANALYSER_FFT;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      streamRef.current = stream;
      audioRef.current = ctx;
      analyserRef.current = analyser;
      writeRef.current = 0;
      readRef.current = 0;
      ringRef.current.fill(128);
      ambientRef.current.reset();
      smoothedLevelRef.current = 0;
      lastSampleAtRef.current = performance.now();

      setStatus("on");
      rafRef.current = requestAnimationFrame(pumpSamples);
    } catch (e) {
      stopCapture();
      const denied =
        e instanceof DOMException &&
        (e.name === "NotAllowedError" || e.name === "PermissionDeniedError");
      setStatus(denied ? "denied" : "error");
      setError(
        denied
          ? "Microphone permission denied."
          : e instanceof Error
            ? e.message
            : "Could not open microphone.",
      );
      setEnabledState(false);
    }
  }, [pumpSamples, stopCapture]);

  const setEnabled = useCallback(
    (on: boolean) => {
      setEnabledState(on);
      if (!on) {
        stopCapture();
        setStatus("off");
        setError(null);
        setLive({ level: 0, liveWindow: 0, lastSampleByte: 128 });
        return;
      }
      void startCapture();
    },
    [startCapture, stopCapture],
  );

  const takeByte = useCallback((): number => {
    const w = writeRef.current;
    if (w <= 0) return 128;
    return ringRef.current[(w - 1) % RING_SIZE] ?? 128;
  }, []);

  const resetForSession = useCallback(() => {
    readRef.current = writeRef.current;
    ringRef.current.fill(128);
    ambientRef.current.reset();
    smoothedLevelRef.current = 0;
    setEntropyPhase("idle");
    setLive((prev) => ({ ...prev, liveWindow: 0, lastSampleByte: 128 }));
  }, []);

  useEffect(() => () => stopCapture(), [stopCapture]);

  const mixingActive =
    enabled && status === "on" && entropyPhase === "active";

  return {
    enabled,
    status,
    error,
    live,
    entropyPhase,
    mixingActive,
    setEnabled,
    takeByte,
    resetForSession,
  };
}
