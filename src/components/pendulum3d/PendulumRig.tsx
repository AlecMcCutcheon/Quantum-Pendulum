import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  RigidBody,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { bobPositionOnDisc } from "./bobDiscPosition";
import { BOB_MATERIAL, ROD_MATERIAL } from "./pendulumVisual";
import { recordTrailPoint, type TrailPoint } from "./pendulumTrailStore";
import { WORLD } from "./constants";

export interface BobStateSample {
  relX: number;
  relY: number;
  relZ: number;
  linvelX: number;
  linvelY: number;
  linvelZ: number;
  /** Bob tip on the divination disc (world x/z) — trail + directionality */
  tipX: number;
  tipZ: number;
}

interface PendulumRigProps {
  pivotRef: React.RefObject<RapierRigidBody | null>;
  bobRef: React.MutableRefObject<RapierRigidBody | null>;
  trailBufferRef: React.MutableRefObject<TrailPoint[]>;
  running: boolean;
  onSample: (sample: BobStateSample) => void;
}

type BodyRef = React.RefObject<RapierRigidBody>;

const BOB_ATTACH_LOCAL: [number, number, number] = [0, WORLD.rodLength, 0];

/** Elongated diamond (octahedron) — typical pendulum bob silhouette. */
function PendulumBobMesh() {
  return (
    <mesh castShadow receiveShadow scale={[0.9, 1.65, 0.9]}>
      <octahedronGeometry args={[WORLD.bobRadius, 0]} />
      <meshStandardMaterial {...BOB_MATERIAL} flatShading />
    </mesh>
  );
}

export function PendulumRig({
  pivotRef,
  bobRef,
  trailBufferRef,
  running,
  onSample,
}: PendulumRigProps) {
  const bob = useRef<RapierRigidBody>(null!);

  const initialBob: [number, number, number] = useMemo(
    () => [0, WORLD.anchorY - WORLD.rodLength, 0],
    [],
  );

  useEffect(() => {
    if (!running) return;

    const id = requestAnimationFrame(() => {
      const pivot = pivotRef.current;
      const bobBody = bob.current;
      if (!pivot || !bobBody) return;

      const py = pivot.translation().y;
      bobBody.setTranslation({ x: 0, y: py - WORLD.rodLength, z: 0 }, true);
      bobBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bobBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      bobBody.wakeUp();
    });

    return () => cancelAnimationFrame(id);
  }, [running, pivotRef]);

  useSphericalJoint(pivotRef as BodyRef, bob, [
    [0, 0, 0],
    BOB_ATTACH_LOCAL,
  ]);

  const rodRef = useRef<THREE.Mesh>(null);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const mid = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(() => {
    if (!running) return;

    const pivot = pivotRef.current;
    const bobBody = bob.current;
    if (!pivot || !bobBody) return;

    bobRef.current = bobBody;

    const pp = pivot.translation();
    const bp = bobBody.translation();
    const disc = bobPositionOnDisc(bobBody);
    trailBufferRef.current = recordTrailPoint(
      trailBufferRef.current,
      disc.x,
      disc.z,
      performance.now(),
    );
    const bv = bobBody.linvel();

    onSample({
      relX: bp.x - pp.x,
      relY: bp.y - pp.y,
      relZ: bp.z - pp.z,
      linvelX: bv.x,
      linvelY: bv.y,
      linvelZ: bv.z,
      tipX: bp.x,
      tipZ: bp.z,
    });

    const pivotWorld = new THREE.Vector3(pp.x, pp.y, pp.z);
    const bobCenter = new THREE.Vector3(bp.x, bp.y, bp.z);
    dir.subVectors(bobCenter, pivotWorld);
    const len = dir.length();
    if (len < 0.01 || !rodRef.current) return;

    mid.addVectors(pivotWorld, bobCenter).multiplyScalar(0.5);
    rodRef.current.position.copy(mid);
    rodRef.current.scale.set(1, len, 1);
    quat.setFromUnitVectors(up, dir.normalize());
    rodRef.current.quaternion.copy(quat);
  });

  return (
    <group>
      <RigidBody
        ref={bob}
        position={initialBob}
        type="dynamic"
        mass={WORLD.bobMass}
        linearDamping={0.026}
        angularDamping={0.065}
        colliders={false}
        canSleep={false}
      >
        <BallCollider args={[WORLD.bobColliderRadius]} />
        <PendulumBobMesh />
      </RigidBody>

      <mesh ref={rodRef}>
        <cylinderGeometry args={[0.01, 0.01, 1, 8]} />
        <meshStandardMaterial {...ROD_MATERIAL} />
      </mesh>
    </group>
  );
}
