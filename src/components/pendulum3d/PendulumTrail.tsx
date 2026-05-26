import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { WORLD } from "./constants";
import {
  TRAIL,
  buildTrailRenderVertices,
  type TrailPoint,
} from "./pendulumTrailStore";

interface PendulumTrailProps {
  running: boolean;
  bufferRef: MutableRefObject<TrailPoint[]>;
}

function trailColorsToGlow(
  colors: [number, number, number, number][],
): [number, number, number, number][] {
  return colors.map(([r, g, b, a]) => [r, g, b, Math.min(1, a * 0.38)]);
}

interface TrailStrip {
  points: THREE.Vector3[];
  colors: [number, number, number, number][];
}

const EMPTY: TrailStrip = { points: [], colors: [] };

export function PendulumTrail({ running, bufferRef }: PendulumTrailProps) {
  const y = WORLD.discY + 0.022;
  const [strip, setStrip] = useState<TrailStrip>(EMPTY);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const lastCountRef = useRef(0);

  useEffect(() => {
    if (!running) {
      bufferRef.current = [];
      pointsRef.current = [];
      lastCountRef.current = 0;
      setStrip(EMPTY);
    }
  }, [running, bufferRef]);

  useFrame(() => {
    if (!running) return;

    const buf = bufferRef.current;
    if (buf.length < 2) {
      if (lastCountRef.current > 0) {
        lastCountRef.current = 0;
        pointsRef.current = [];
        setStrip(EMPTY);
      }
      return;
    }

    const verts = buildTrailRenderVertices(buf, y, performance.now());
    if (verts.length < 2) return;

    const pool = pointsRef.current;
    while (pool.length < verts.length) {
      pool.push(new THREE.Vector3());
    }
    for (let i = 0; i < verts.length; i++) {
      const v = verts[i]!;
      pool[i]!.set(v.x, v.y, v.z);
    }
    pool.length = verts.length;
    lastCountRef.current = verts.length;

    setStrip({
      points: pool.slice(0, verts.length),
      colors: verts.map((v) => v.color),
    });
  });

  if (strip.points.length < 2) return null;

  const glowColors = trailColorsToGlow(strip.colors);

  const lineProps = {
    transparent: true,
    depthWrite: false,
    toneMapped: false as const,
    color: "#ffffff",
    renderOrder: 5,
  };

  return (
    <group>
      <Line
        points={strip.points}
        vertexColors={glowColors}
        lineWidth={TRAIL.lineWidth3dGlow}
        {...lineProps}
        renderOrder={4}
      />
      <Line
        points={strip.points}
        vertexColors={strip.colors}
        lineWidth={TRAIL.lineWidth3d}
        {...lineProps}
      />
    </group>
  );
}
