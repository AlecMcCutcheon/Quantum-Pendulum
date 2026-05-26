import { useCallback, useState } from "react";
import { AutoCircleSwapToggle } from "../components/AutoCircleSwapToggle";
import { CirclePicker } from "../components/CirclePicker";
import { DrawButton } from "../components/DrawButton";
import { MicEntropySection } from "../components/MicEntropySection";
import { PendulumView } from "../components/PendulumView";
import {
  QuantumTransactionButton,
  QuantumTransactionModal,
} from "../components/QuantumTransactionModal";
import { getCircleById } from "../data/divinationCircles";
import { useQuantumCircleAutoSwap } from "../hooks/useQuantumCircleAutoSwap";
import { useLiveMicEntropy } from "../hooks/useLiveMicEntropy";
import { useQuantumStream } from "../hooks/useQuantumStream";

type Phase = "idle" | "loading" | "running" | "error";

export function Home() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [circleId, setCircleId] = useState("yes-no-maybe");
  const [autoCircleSwap, setAutoCircleSwap] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txOpen, setTxOpen] = useState(false);

  const mic = useLiveMicEntropy();
  const {
    stream,
    ledger,
    qrngNotice,
    start,
    stop,
    consumeImpulse,
    consumeIntegers,
  } = useQuantumStream(undefined, {
    enabled: mic.enabled && mic.status === "on",
    mixingActive: mic.mixingActive,
    takeByte: mic.takeByte,
  });

  const circle = getCircleById(circleId);

  const { live: circleShiftLive } = useQuantumCircleAutoSwap({
    enabled: autoCircleSwap,
    running: phase === "running",
    circleId,
    onCircleId: setCircleId,
    consumeIntegers,
  });

  const begin = useCallback(async () => {
    setErrorMsg(null);
    setPhase("loading");
    if (mic.enabled) mic.resetForSession();
    const ok = await start();
    if (!ok) {
      setPhase("error");
      setErrorMsg(
        "Quantum source unavailable. Check Settings → test connection.",
      );
      return;
    }
    setPhase("running");
  }, [start, mic]);

  const end = useCallback(() => {
    stop();
    setPhase("idle");
  }, [stop]);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center text-center">
      <div className="mb-6 flex w-full flex-col items-center gap-4">
        <CirclePicker value={circleId} onChange={setCircleId} />
        <AutoCircleSwapToggle
          enabled={autoCircleSwap}
          active={phase === "running"}
          live={circleShiftLive}
          onChange={setAutoCircleSwap}
          disabled={phase === "loading"}
        />
        <MicEntropySection
          enabled={mic.enabled}
          status={mic.status}
          error={mic.error}
          live={mic.live}
          inputMode={mic.inputMode}
          onInputModeChange={mic.setInputMode}
          pttHeld={mic.pttHeld}
          onPttHeldChange={mic.setPttHeld}
          entropyPhase={mic.entropyPhase}
          ledger={ledger}
          waveformRef={mic.waveformRef}
          mixingActive={mic.mixingActive}
          disabled={phase === "loading"}
          onChange={mic.setEnabled}
        />
      </div>

      {phase === "idle" && (
        <>
          <DrawButton onClick={() => void begin()} label="Begin measurement" />
          {ledger.impulsesConsumed > 0 && stream.pool.length > 0 ? (
            <button
              type="button"
              onClick={() => setTxOpen(true)}
              className="mt-4 text-xs text-star/50 underline-offset-2 hover:text-accent hover:underline"
            >
              View last quantum stream
            </button>
          ) : null}
        </>
      )}

      {phase === "loading" && (
        <DrawButton onClick={() => {}} loading loadingLabel="QRNG…" />
      )}

      {phase === "error" && (
        <div className="mt-4 w-full max-w-md rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-200">
          <p>{errorMsg}</p>
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="mt-4 text-accent underline-offset-2 hover:underline"
          >
            Back
          </button>
        </div>
      )}

      {phase === "running" && (
        <div className="flex w-full flex-col items-center gap-8">
          {qrngNotice ? (
            <p
              className="max-w-md rounded-lg border border-accent/25 bg-accent/10 px-4 py-2.5 text-center text-sm text-star/75"
              role="status"
            >
              {qrngNotice}
            </p>
          ) : null}

          <PendulumView
            circle={circle}
            running
            micActive={mic.mixingActive}
            consumeImpulse={consumeImpulse}
          />

          <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-8">
            <button
              type="button"
              onClick={end}
              className="text-sm text-star/50 hover:text-accent"
            >
              Stop
            </button>
            <QuantumTransactionButton onClick={() => setTxOpen(true)} />
          </div>

        </div>
      )}

      <QuantumTransactionModal
        open={txOpen}
        onClose={() => setTxOpen(false)}
        stream={stream}
        ledger={ledger}
        micActive={mic.mixingActive}
      />
    </div>
  );
}
