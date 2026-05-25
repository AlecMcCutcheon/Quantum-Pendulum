import * as THREE from "three";
import { WORLD } from "./constants";
import { MOUNT_CAP_MATERIAL, MOUNT_RING_MATERIAL } from "./pendulumVisual";

/** Fixed ceiling mount — ring + cap hardware at the hinge point. */
export function PivotMount() {
  return (
    <group position={[0, WORLD.anchorY, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.018, 0.034, 24]} />
        <meshStandardMaterial
          {...MOUNT_RING_MATERIAL}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.014, 20, 20]} />
        <meshStandardMaterial {...MOUNT_CAP_MATERIAL} />
      </mesh>
    </group>
  );
}
