import { useCallback, useEffect, useRef, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Physics, type RapierRigidBody } from "@react-three/rapier";
import type { DivinationCircle } from "../../types/pendulum";
import type { ConsumedImpulse } from "../../types/pendulum";
import {
  SwingMotionAnalyzer,
  formatVerdictLabel,
  swingReadingToSectorIndex,
  type AxisStrengths,
  type SwingConfidence,
  type SwingReading,
} from "../../lib/swingMotion";
import { AnchorMarker } from "./AnchorMarker";
import {
  applyGhostImpulse,
  createGhostPivotState,
  GhostAnchor,
  syncGhostToPivot,
} from "./GhostAnchor";
import { PendulumRig, type BobStateSample } from "./PendulumRig";
import { DivinationDisc3D } from "./DivinationDisc3D";
import { PendulumTrail } from "./PendulumTrail";
import { PivotKinematic } from "./PivotKinematic";
import { KaleidoscopeBackdrop } from "./KaleidoscopeBackdrop";
import { PivotMount } from "./PivotMount";
import { applyPivotTarget, createPivotState } from "./pivotOscillator";
import { createTrailBuffer } from "./pendulumTrailStore";
import { WORLD } from "./constants";

interface QuantumPendulumSceneProps {
  circle: DivinationCircle;
  running: boolean;
  micActive: boolean;
  consumeImpulse: () => ConsumedImpulse | null;
  onReadingChange: (
    reading: SwingReading,
    label: string,
    sector: number,
    confidence: SwingConfidence,
  ) => void;
}

export function QuantumPendulumScene({
  circle,
  running,
  micActive,
  consumeImpulse,
  onReadingChange,
}: QuantumPendulumSceneProps) {
  const pivotRef = useRef<RapierRigidBody>(null);
  const pivotStateRef = useRef(createPivotState());
  const ghostStateRef = useRef(createGhostPivotState());
  const analyzerRef = useRef(new SwingMotionAnalyzer());
  const consumeRef = useRef(consumeImpulse);
  const runningRef = useRef(running);
  const impulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [axisStrengths, setAxisStrengths] = useState<AxisStrengths>({
    yes: 0.25,
    no: 0.25,
    good: 0.25,
    bad: 0.25,
  });
  const [confidence, setConfidence] = useState<SwingConfidence>({
    yes: 0.05,
    no: 0.05,
    good: 0.05,
    bad: 0.05,
    maybe: 0.55,
  });
  const bobRef = useRef<RapierRigidBody | null>(null);
  const trailBufferRef = useRef(createTrailBuffer());

  consumeRef.current = consumeImpulse;
  runningRef.current = running;

  useEffect(() => {
    if (micActive) {
      syncGhostToPivot(ghostStateRef, pivotStateRef.current);
    }
  }, [micActive]);

  const applyConsumedImpulse = useCallback((consumed: ConsumedImpulse) => {
    pivotStateRef.current = applyPivotTarget(
      pivotStateRef.current,
      consumed.impulse,
    );
    if (consumed.directImpulse) {
      applyGhostImpulse(ghostStateRef, consumed.directImpulse);
    } else {
      syncGhostToPivot(ghostStateRef, pivotStateRef.current);
    }
    pivotRef.current?.wakeUp();
  }, []);

  const scheduleImpulse = useCallback(() => {
    if (impulseTimerRef.current) clearTimeout(impulseTimerRef.current);
    if (!runningRef.current) return;

    const consumed = consumeRef.current();
    if (!consumed) {
      impulseTimerRef.current = setTimeout(scheduleImpulse, 120);
      return;
    }
    applyConsumedImpulse(consumed);
    impulseTimerRef.current = setTimeout(
      scheduleImpulse,
      consumed.impulse.intervalMs,
    );
  }, [applyConsumedImpulse]);

  useEffect(() => {
    if (running) {
      analyzerRef.current.reset();
      const fresh = createPivotState();
      pivotStateRef.current = fresh;
      ghostStateRef.current = createGhostPivotState();
      syncGhostToPivot(ghostStateRef, fresh);
      setAxisStrengths({
        yes: 0.25,
        no: 0.25,
        good: 0.25,
        bad: 0.25,
      });
      setConfidence({
        yes: 0.05,
        no: 0.05,
        good: 0.05,
        bad: 0.05,
        maybe: 0.55,
      });
      bobRef.current = null;
      trailBufferRef.current = createTrailBuffer();
      impulseTimerRef.current = setTimeout(scheduleImpulse, 1100);
    } else if (impulseTimerRef.current) {
      clearTimeout(impulseTimerRef.current);
    }
    return () => {
      if (impulseTimerRef.current) clearTimeout(impulseTimerRef.current);
    };
  }, [running, scheduleImpulse]);

  const handleSample = useCallback(
    (s: BobStateSample) => {
      const pivot = pivotStateRef.current;
      analyzerRef.current.recordDiscPlanar(
        s.tipX,
        s.tipZ,
        s.linvelX - pivot.vx,
        s.linvelZ - pivot.vz,
      );
      const state = analyzerRef.current.analyzeDisplayState();
      const label = formatVerdictLabel(state, circle.sectors);
      const sector = state.verdictReady
        ? swingReadingToSectorIndex(state.verdictReading, circle.sectors)
        : swingReadingToSectorIndex("maybe", circle.sectors);

      setAxisStrengths(state.axisStrengths);
      setConfidence(state.confidence);
      onReadingChange(state.verdictReading, label, sector, state.confidence);
    },
    [circle, onReadingChange],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0.35, 4.1, 2.45]} fov={40} />
      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={6}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI * 0.38}
        target={[0, 1.05, 0]}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 3]} intensity={1.35} castShadow />
      <pointLight position={[-2, 3, -1]} intensity={0.75} color="#c4b5fd" />
      <pointLight
        position={[0.6, WORLD.anchorY - 0.5, 0.5]}
        intensity={0.55}
        color="#fcd34d"
        distance={4}
      />
      <pointLight
        position={[-1.2, 1.2, 1.8]}
        intensity={0.4}
        color="#818cf8"
        distance={5}
      />

      <KaleidoscopeBackdrop />

      <PivotMount />

      <Physics
        gravity={WORLD.gravity}
        timeStep={1 / 60}
        paused={!running}
      >
        <PivotKinematic bodyRef={pivotRef} pivotStateRef={pivotStateRef} />
        <GhostAnchor
          micActive={micActive}
          pivotRef={pivotRef}
          pivotStateRef={pivotStateRef}
          ghostStateRef={ghostStateRef}
        />
        <PendulumRig
          pivotRef={pivotRef}
          bobRef={bobRef}
          trailBufferRef={trailBufferRef}
          running={running}
          onSample={handleSample}
        />
        <PendulumTrail running={running} bufferRef={trailBufferRef} />
      </Physics>

      <AnchorMarker pivotRef={pivotRef} />
      <DivinationDisc3D
        circle={circle}
        confidence={confidence}
        axisStrengths={axisStrengths}
      />
    </>
  );
}
