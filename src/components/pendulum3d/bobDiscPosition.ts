import type { RapierRigidBody } from "@react-three/rapier";

/**
 * Bob center on the divination disc plane (world x/z).
 * Same horizontal position used for swing direction samples.
 */
export function bobPositionOnDisc(body: RapierRigidBody): { x: number; z: number } {
  const t = body.translation();
  return { x: t.x, z: t.z };
}
