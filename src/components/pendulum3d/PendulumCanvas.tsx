import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ensureRapierInitialized } from "../../lib/rapierInit";

void ensureRapierInitialized();
import type { DivinationCircle } from "../../types/pendulum";
import type { ConsumedImpulse } from "../../types/pendulum";
import { QuantumPendulumScene } from "./QuantumPendulumScene";

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

export function PendulumCanvas({
  circle,
  running,
  micActive,
  consumeImpulse,
}: PendulumCanvasProps) {
  const [label, setLabel] = useState("—");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative h-[min(600px,78vh)] w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-transparent">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.shadowMap.type = THREE.PCFShadowMap;
          }}
        >
          <Suspense fallback={<SceneFallback />}>
            <QuantumPendulumScene
              circle={circle}
              running={running}
              micActive={micActive}
              consumeImpulse={consumeImpulse}
              onReadingChange={(_reading, nextLabel) => setLabel(nextLabel)}
            />
          </Suspense>
        </Canvas>
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
