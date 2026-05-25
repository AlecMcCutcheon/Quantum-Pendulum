import { useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { WORLD } from "./constants";
import { tetherVertexColors } from "./pendulumVisual";

interface AnchorMarkerProps {
  pivotRef: React.RefObject<RapierRigidBody | null>;
}

/** Tether from ceiling mount to live hinge — indigo at top, cyan at pivot. */
export function AnchorMarker({ pivotRef }: AnchorMarkerProps) {
  const mount = useMemo(
    () => new THREE.Vector3(0, WORLD.anchorY, 0),
    [],
  );
  const vertexColors = useMemo(() => tetherVertexColors(), []);
  const [points, setPoints] = useState<[THREE.Vector3, THREE.Vector3]>([
    mount.clone(),
    mount.clone(),
  ]);

  useFrame(() => {
    const body = pivotRef.current;
    if (!body) return;
    const t = body.translation();
    setPoints([
      mount.clone(),
      new THREE.Vector3(t.x, t.y, t.z),
    ]);
  });

  return (
    <Line
      points={points}
      vertexColors={vertexColors}
      lineWidth={1.35}
      transparent
      depthWrite={false}
      renderOrder={4}
    />
  );
}
