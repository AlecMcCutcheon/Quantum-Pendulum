import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useBeforePhysicsStep } from "@react-three/rapier";
import { Line } from "@react-three/drei";
import type { RapierRigidBody } from "@react-three/rapier";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { WORLD } from "./constants";
import { PENDULUM_PALETTE } from "./pendulumVisual";
import {
  applyPivotTarget,
  createPivotState,
  stepPivot,
  type PivotState,
} from "./pivotOscillator";

const PIVOT_TUNING = {
  springK: WORLD.anchorSpringK,
  damping: WORLD.anchorSpringDamp,
  maxRadius: WORLD.anchorMaxRadius,
  targetPullK: WORLD.pivotTargetPullK,
  mass: WORLD.anchorMass,
};

const MERGE_PULL = 0.14;
/** Must track the live anchor this long before fully fading out. */
const MERGE_HOLD_SEC = 2.4;
const CLOSE_DIST = WORLD.anchorMaxRadius * 0.11;
const CLOSE_VEL = 0.42;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0 || 1)));
  return t * t * (3 - 2 * t);
}

interface GhostAnchorProps {
  micActive: boolean;
  pivotRef: React.RefObject<RapierRigidBody | null>;
  pivotStateRef: MutableRefObject<PivotState>;
  ghostStateRef: MutableRefObject<PivotState>;
}

export function GhostAnchor({
  micActive,
  pivotRef,
  pivotStateRef,
  ghostStateRef,
}: GhostAnchorProps) {
  const mount = useMemo(
    () => new THREE.Vector3(0, WORLD.anchorY, 0),
    [],
  );
  const meshRef = useRef<THREE.Mesh>(null);
  const [linePoints, setLinePoints] = useState<[THREE.Vector3, THREE.Vector3]>([
    mount.clone(),
    mount.clone(),
  ]);
  const smoothedDistRef = useRef<number>(WORLD.anchorMaxRadius);
  const alignedTimeRef = useRef(0);
  const displayOpacityRef = useRef(0);
  const [renderOpacity, setRenderOpacity] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  useBeforePhysicsStep(() => {
    const dt = 1 / 60;
    if (micActive) {
      ghostStateRef.current = stepPivot(
        ghostStateRef.current,
        dt,
        PIVOT_TUNING,
      );
      return;
    }

    const real = pivotStateRef.current;
    const g = ghostStateRef.current;
    const pull = MERGE_PULL;
    ghostStateRef.current = {
      ...g,
      x: g.x + (real.x - g.x) * pull,
      z: g.z + (real.z - g.z) * pull,
      vx: g.vx + (real.vx - g.vx) * pull,
      vz: g.vz + (real.vz - g.vz) * pull,
      targetX: g.targetX + (real.targetX - g.targetX) * pull,
      targetZ: g.targetZ + (real.targetZ - g.targetZ) * pull,
      approachStrength:
        g.approachStrength +
        (real.approachStrength - g.approachStrength) * pull,
      blendRate: g.blendRate + (real.blendRate - g.blendRate) * pull,
    };
  });

  useFrame((_, delta) => {
    const body = pivotRef.current;
    const g = ghostStateRef.current;
    const real = pivotStateRef.current;
    const group = groupRef.current;
    const mesh = meshRef.current;
    if (!body || !group || !mesh) return;

    const t = body.translation();
    const ghostPos = new THREE.Vector3(g.x, WORLD.anchorY, g.z);
    setLinePoints([mount.clone(), ghostPos]);

    const dist = Math.hypot(g.x - t.x, g.z - t.z);
    const velDist = Math.hypot(g.vx - real.vx, g.vz - real.vz);
    const targetDist = Math.hypot(
      g.targetX - real.targetX,
      g.targetZ - real.targetZ,
    );

    smoothedDistRef.current =
      smoothedDistRef.current * 0.9 + dist * 0.1;

    const mirroring =
      dist < CLOSE_DIST &&
      velDist < CLOSE_VEL &&
      targetDist < WORLD.anchorMaxRadius * 0.14;

    if (mirroring) {
      alignedTimeRef.current += delta;
    } else {
      alignedTimeRef.current = Math.max(
        0,
        alignedTimeRef.current - delta * 1.8,
      );
    }

    if (targetDist > WORLD.anchorMaxRadius * 0.22) {
      alignedTimeRef.current = 0;
    }

    const maxR = WORLD.anchorMaxRadius;
    const separation = smoothstep(maxR * 0.08, maxR * 0.5, smoothedDistRef.current);

    let targetOpacity = 0;
    if (micActive) {
      targetOpacity = 0.88 + separation * 0.1;
      const mergeFade = smoothstep(
        MERGE_HOLD_SEC * 0.55,
        MERGE_HOLD_SEC,
        alignedTimeRef.current,
      );
      targetOpacity *= 1 - mergeFade;
    } else if (displayOpacityRef.current > 0.02) {
      const mergeFade = smoothstep(
        MERGE_HOLD_SEC * 0.4,
        MERGE_HOLD_SEC * 0.9,
        alignedTimeRef.current,
      );
      targetOpacity = (0.5 + separation * 0.35) * (1 - mergeFade);
    }

    const fadeIn = targetOpacity > displayOpacityRef.current ? 5.5 : 1.4;
    displayOpacityRef.current +=
      (targetOpacity - displayOpacityRef.current) *
      Math.min(1, fadeIn * delta);

    const op = displayOpacityRef.current;
    group.visible = op > 0.015;
    mesh.position.copy(ghostPos);

    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.opacity = op * 0.92;
    setRenderOpacity(op);
  });

  const lineColor = PENDULUM_PALETTE.star;

  return (
    <group ref={groupRef} visible={false}>
      <Line
        points={linePoints}
        color={lineColor}
        lineWidth={2.2}
        transparent
        opacity={renderOpacity * 0.78}
        depthWrite={false}
        renderOrder={5}
      />
      <mesh ref={meshRef} renderOrder={5}>
        <octahedronGeometry args={[WORLD.pivotVisualRadius * 1.55, 0]} />
        <meshStandardMaterial
          color={PENDULUM_PALETTE.star}
          emissive={PENDULUM_PALETTE.cosmicGlow}
          emissiveIntensity={0.95}
          metalness={0.55}
          roughness={0.22}
          transparent
          opacity={renderOpacity * 0.92}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Reset ghost dynamics to match the live pivot (e.g. session start). */
export function syncGhostToPivot(
  ghostStateRef: MutableRefObject<PivotState>,
  pivotState: PivotState,
): void {
  ghostStateRef.current = { ...pivotState };
}

export function applyGhostImpulse(
  ghostStateRef: MutableRefObject<PivotState>,
  impulse: import("../../types/pendulum").PendulumImpulse,
): void {
  ghostStateRef.current = applyPivotTarget(ghostStateRef.current, impulse);
}

export function createGhostPivotState(): PivotState {
  return createPivotState();
}
