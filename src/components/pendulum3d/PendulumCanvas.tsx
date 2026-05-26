import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ensureRapierInitialized } from "../../lib/rapierInit";
import { DiscPlaneView } from "../DiscPlaneView";
import { DiscViewToggle } from "../DiscViewToggle";
import type { DivinationCircle } from "../../types/pendulum";
import type { ConsumedImpulse } from "../../types/pendulum";
import {
  type AxisStrengths,
  type SwingConfidence,
  type SwingReading,
} from "../../lib/swingMotion";
import { QuantumPendulumScene } from "./QuantumPendulumScene";
import { createTrailBuffer } from "./pendulumTrailStore";

interface PendulumCanvasProps {
  circle: DivinationCircle;
  running: boolean;
  micActive: boolean;
  consumeImpulse: () => ConsumedImpulse | null;
}

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="#a78bfa" />
    </mesh>
  );
}

const DEFAULT_AXIS: AxisStrengths = {
  yes: 0.25,
  no: 0.25,
  good: 0.25,
  bad: 0.25,
};

const DEFAULT_CONFIDENCE: SwingConfidence = {
  yes: 0.05,
  no: 0.05,
  good: 0.05,
  bad: 0.05,
  maybe: 0.55,
};

export function PendulumCanvas({
  circle,
  running,
  micActive,
  consumeImpulse,
}: PendulumCanvasProps) {
  const [label, setLabel] = useState("—");
  const [discView, setDiscView] = useState(false);
  const [axisStrengths, setAxisStrengths] = useState<AxisStrengths>(DEFAULT_AXIS);
  const [confidence, setConfidence] =
    useState<SwingConfidence>(DEFAULT_CONFIDENCE);
  const [rapierReady, setRapierReady] = useState(false);
  const [rapierFailed, setRapierFailed] = useState(false);
  const trailBufferRef = useRef(createTrailBuffer());

  useEffect(() => {
    let cancelled = false;
    setRapierFailed(false);
    ensureRapierInitialized()
      .then(() => {
        if (!cancelled) setRapierReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setRapierReady(false);
          setRapierFailed(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReadingChange = useCallback(
    (
      _reading: SwingReading,
      nextLabel: string,
      _sector: number,
      nextConfidence: SwingConfidence,
      nextAxis: AxisStrengths,
    ) => {
      setLabel(nextLabel);
      setConfidence(nextConfidence);
      setAxisStrengths(nextAxis);
    },
    [],
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {running ? (
        <DiscViewToggle discView={discView} onChange={setDiscView} />
      ) : null}

      <div className="relative h-[min(600px,78vh)] w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-transparent">
        <div
          className={
            discView
              ? "pointer-events-none invisible absolute inset-0"
              : "absolute inset-0"
          }
          aria-hidden={discView}
        >
          {rapierFailed ? (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="text-sm leading-relaxed text-star/60">
                3D physics failed to load in this browser tab (often after a hot
                reload). Refresh the page, or use Disc view if the session is
                already running.
              </p>
            </div>
          ) : (
            <Canvas
              frameloop={running ? "always" : "demand"}
              shadows={{ type: THREE.PCFShadowMap }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "default" }}
              style={{ width: "100%", height: "100%", background: "transparent" }}
              onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.shadowMap.type = THREE.PCFShadowMap;
              }}
            >
              <Suspense fallback={<SceneFallback />}>
                {rapierReady ? (
                  <QuantumPendulumScene
                    circle={circle}
                    running={running}
                    micActive={micActive}
                    trailBufferRef={trailBufferRef}
                    consumeImpulse={consumeImpulse}
                    onReadingChange={handleReadingChange}
                  />
                ) : (
                  <SceneFallback />
                )}
              </Suspense>
            </Canvas>
          )}
        </div>

        {discView && running ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
            <DiscPlaneView
              circle={circle}
              axisStrengths={axisStrengths}
              confidence={confidence}
              trailRef={trailBufferRef}
              running={running}
            />
          </div>
        ) : null}
      </div>

      <p
        className="font-display text-base tracking-wide text-gold sm:text-lg"
        aria-live="polite"
      >
        {label}
      </p>
    </div>
  );
}
