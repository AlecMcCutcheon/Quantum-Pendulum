import { useBeforePhysicsStep } from "@react-three/rapier";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";
import type { MutableRefObject } from "react";
import { WORLD } from "./constants";
import { PIVOT_MATERIAL } from "./pendulumVisual";
import { stepPivot, type PivotState } from "./pivotOscillator";

const PIVOT_TUNING = {
  springK: WORLD.anchorSpringK,
  damping: WORLD.anchorSpringDamp,
  maxRadius: WORLD.anchorMaxRadius,
  targetPullK: WORLD.pivotTargetPullK,
  mass: WORLD.anchorMass,
};

export interface PivotKinematicProps {
  bodyRef: React.RefObject<RapierRigidBody | null>;
  pivotStateRef: MutableRefObject<PivotState>;
}

export function PivotKinematic({ bodyRef, pivotStateRef }: PivotKinematicProps) {
  useBeforePhysicsStep(() => {
    const body = bodyRef.current;
    if (!body) return;

    const dt = 1 / 60;
    pivotStateRef.current = stepPivot(pivotStateRef.current, dt, PIVOT_TUNING);

    const { x, z } = pivotStateRef.current;
    body.setNextKinematicTranslation({ x, y: WORLD.anchorY, z });
  });

  return (
    <RigidBody
      ref={bodyRef}
      type="kinematicPosition"
      position={[0, WORLD.anchorY, 0]}
      colliders={false}
      canSleep={false}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <octahedronGeometry args={[WORLD.pivotVisualRadius * 1.4, 0]} />
        <meshStandardMaterial {...PIVOT_MATERIAL} flatShading />
      </mesh>
    </RigidBody>
  );
}
