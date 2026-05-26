import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  AmbientActivityTracker,
  smoothMeter,
  type MicEntropyPhase,
} from "../lib/micAmbient";
import {
  foldSpectrumByte,
  micActivityPercent,
  spectralFlatness01,
  spectralFlatnessPercent,
  spectralFluxPercent,
  WaveformGain,
  waveformMotionPercent,
  waveformRms,
  zeroCrossingRate01,
} from "../lib/micSpectrum";

const RING_SIZE = 4096;
const ANALYSER_FFT = 256;

export type MicEntropyStatus = "off" | "requesting" | "on" | "denied" | "error";

/** Auto = ambient VAD; PTT = hold button to mix mic entropy. */
export type MicInputMode = "auto" | "ptt";

export interface MicLiveStats {
  /** 0–100 dynamics above room floor (flat line ≈ 0). */
  activity: number;
  /** Display AGC multiplier (1× = no boost). */
  gain: number;
  liveWindow: number;
  lastSampleByte: number;
}

export interface UseLiveMicEntropyResult {
  enabled: boolean;
  status: MicEntropyStatus;
  error: string | null;
  live: MicLiveStats;
  inputMode: MicInputMode;
  setInputMode: (mode: MicInputMode) => void;
  pttHeld: boolean;
  setPttHeld: (held: boolean) => void;
  /** Stable ambient noise — mic does not shift QRNG. */
  entropyPhase: MicEntropyPhase;
  /** Mic on and mixing (auto live or PTT held). */
  mixingActive: boolean;
  /** Gain-normalized waveform for the canvas (raw audio stays in the entropy ring). */
  waveformRef: RefObject<Uint8Array>;
  setEnabled: (on: boolean) => void;
  takeByte: () => number;
  resetForSession: () => void;
}

export function useLiveMicEntropy(): UseLiveMicEntropyResult {
  const [enabled, setEnabledState] = useState(false);
  const [status, setStatus] = useState<MicEntropyStatus>("off");
  const [error, setError] = useState<string | null>(null);
  const [entropyPhase, setEntropyPhase] = useState<MicEntropyPhase>("idle");
  const [inputMode, setInputModeState] = useState<MicInputMode>("auto");
  const [pttHeld, setPttHeldState] = useState(false);
  const [live, setLive] = useState<MicLiveStats>({
    activity: 0,
    gain: 1,
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
  const ambientRef = useRef(new AmbientActivityTracker());
  const smoothedActivityRef = useRef(0);
  const lastSampleAtRef = useRef(performance.now());
  const freqRef = useRef<Uint8Array | null>(null);
  const prevFreqRef = useRef<Uint8Array | null>(null);
  const spectrumTickRef = useRef(0);
  const lastFreqByteRef = useRef(128);
  const rawWaveRef = useRef<Uint8Array>(new Uint8Array(ANALYSER_FFT));
  const waveformRef = useRef<Uint8Array>(new Uint8Array(ANALYSER_FFT));
  const gainRef = useRef(new WaveformGain());
  const lastPhaseRef = useRef<MicEntropyPhase>("idle");
  const lastUiPushRef = useRef(0);
  const inputModeRef = useRef<MicInputMode>("auto");
  const pttHeldRef = useRef(false);

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
    freqRef.current = null;
    prevFreqRef.current = null;
    ambientRef.current.reset();
    gainRef.current.reset();
    smoothedActivityRef.current = 0;
    spectrumTickRef.current = 0;
    lastFreqByteRef.current = 128;
    lastPhaseRef.current = "idle";
    lastUiPushRef.current = 0;
    pttHeldRef.current = false;
    setPttHeldState(false);
    setEntropyPhase("idle");
  }, []);

  const setInputMode = useCallback((mode: MicInputMode) => {
    inputModeRef.current = mode;
    setInputModeState(mode);
    if (mode === "auto") {
      pttHeldRef.current = false;
      setPttHeldState(false);
      if (analyserRef.current) {
        ambientRef.current.startCalibration(performance.now());
        lastPhaseRef.current = "idle";
        setEntropyPhase("idle");
      }
    }
  }, []);

  const setPttHeld = useCallback((held: boolean) => {
    if (inputModeRef.current !== "ptt") return;
    pttHeldRef.current = held;
    setPttHeldState(held);
    const phase: MicEntropyPhase = held ? "active" : "idle";
    lastPhaseRef.current = phase;
    setEntropyPhase(phase);
  }, []);

  const pumpSamples = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const now = performance.now();
    const dt = Math.min(80, now - lastSampleAtRef.current);
    lastSampleAtRef.current = now;

    const fftSize = analyser.fftSize;
    if (rawWaveRef.current.length !== fftSize) {
      rawWaveRef.current = new Uint8Array(fftSize);
      waveformRef.current = new Uint8Array(fftSize);
    }
    const raw = rawWaveRef.current;
    const display = waveformRef.current;
    analyser.getByteTimeDomainData(raw);

    const rms = waveformRms(raw);
    gainRef.current.update(rms);
    gainRef.current.applyForDisplay(raw, display);

    const binCount = analyser.frequencyBinCount;
    if (!freqRef.current || freqRef.current.length !== binCount) {
      freqRef.current = new Uint8Array(binCount);
      prevFreqRef.current = new Uint8Array(binCount);
    }
    const freq = freqRef.current;
    const prevFreq = prevFreqRef.current!;
    prevFreq.set(freq);
    analyser.getByteFrequencyData(freq);

    const fluxRaw = spectralFluxPercent(freq, prevFreq);
    const flatness01 = spectralFlatness01(freq);
    const flatness = spectralFlatnessPercent(freq);
    const rawMotion = waveformMotionPercent(raw);
    const zcr = zeroCrossingRate01(raw);
    const instant = micActivityPercent(display, raw, fluxRaw, flatness01);

    const ptt = inputModeRef.current === "ptt";
    if (!ptt) {
      ambientRef.current.push(
        {
          instant,
          flux: fluxRaw,
          flatness,
          flatness01,
          rawMotion,
          rms,
          zcr,
        },
        dt,
      );
    }
    const windowed = ptt
      ? pttHeldRef.current
        ? instant
        : 0
      : ambientRef.current.displayActivity();
    const activity = smoothMeter(smoothedActivityRef.current, windowed, 0.2);
    smoothedActivityRef.current = activity;

    const ring = ringRef.current;
    let w = writeRef.current;
    let last = 128;
    for (let i = 0; i < raw.length; i++) {
      const b = raw[i]!;
      ring[w % RING_SIZE] = b;
      w++;
      last = b;
    }
    writeRef.current = w;

    const freqByte = foldSpectrumByte(freq, spectrumTickRef.current);
    spectrumTickRef.current += 1;
    lastFreqByteRef.current = freqByte;

    const phase: MicEntropyPhase = ptt
      ? pttHeldRef.current
        ? "active"
        : "idle"
      : ambientRef.current.phase;
    if (phase !== lastPhaseRef.current) {
      lastPhaseRef.current = phase;
      setEntropyPhase(phase);
    }

    if (now - lastUiPushRef.current >= 100) {
      lastUiPushRef.current = now;
      setLive({
        activity,
        gain: Math.round(gainRef.current.multiplier * 10) / 10,
        liveWindow: raw.length,
        lastSampleByte: (last ^ freqByte) & 0xff,
      });
    }
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
      analyser.smoothingTimeConstant = 0.45;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      streamRef.current = stream;
      audioRef.current = ctx;
      analyserRef.current = analyser;
      writeRef.current = 0;
      readRef.current = 0;
      ringRef.current.fill(128);
      ambientRef.current.reset();
      gainRef.current.reset();
      smoothedActivityRef.current = 0;
      spectrumTickRef.current = 0;
      lastFreqByteRef.current = 128;
      freqRef.current = null;
      prevFreqRef.current = null;
      lastSampleAtRef.current = performance.now();
      lastPhaseRef.current = "idle";
      lastUiPushRef.current = 0;
      ambientRef.current.startCalibration(performance.now());

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
        setLive({ activity: 0, gain: 1, liveWindow: 0, lastSampleByte: 128 });
        return;
      }
      void startCapture();
    },
    [startCapture, stopCapture],
  );

  const takeByte = useCallback((): number => {
    const w = writeRef.current;
    const timeByte = w <= 0 ? 128 : (ringRef.current[(w - 1) % RING_SIZE] ?? 128);
    const freqByte = lastFreqByteRef.current;
    return (timeByte ^ freqByte) & 0xff;
  }, []);

  /** Clear mic bytes consumed by QRNG; keep ambient/live VAD calibration. */
  const resetForSession = useCallback(() => {
    readRef.current = writeRef.current;
    ringRef.current.fill(128);
    spectrumTickRef.current = 0;
    lastFreqByteRef.current = 128;
  }, []);

  useEffect(() => () => stopCapture(), [stopCapture]);

  const mixingActive =
    enabled &&
    status === "on" &&
    (inputMode === "ptt" ? pttHeld : entropyPhase === "active");

  return {
    enabled,
    status,
    error,
    live,
    inputMode,
    setInputMode,
    pttHeld,
    setPttHeld,
    entropyPhase,
    mixingActive,
    waveformRef,
    setEnabled,
    takeByte,
    resetForSession,
  };
}
