import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { WORLD } from "./constants";
import {
  buildTrailRenderVertices,
  type TrailPoint,
} from "./pendulumTrailStore";

interface PendulumTrailProps {
  running: boolean;
  bufferRef: MutableRefObject<TrailPoint[]>;
}

export function PendulumTrail({ running, bufferRef }: PendulumTrailProps) {
  const y = WORLD.discY + 0.022;
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [vertexColors, setVertexColors] = useState<
    [number, number, number, number][]
  >([]);

  const placeholder = useMemo(
    () => [new THREE.Vector3(0, y, 0), new THREE.Vector3(0.001, y, 0.001)],
    [y],
  );

  useEffect(() => {
    if (!running) {
      bufferRef.current = [];
      setPoints([]);
      setVertexColors([]);
    }
  }, [running, bufferRef]);

  useFrame(() => {
    if (!running) return;

    const buf = bufferRef.current;
    if (buf.length < 2) {
      if (points.length > 0) {
        setPoints([]);
        setVertexColors([]);
      }
      return;
    }

    const verts = buildTrailRenderVertices(buf, y, performance.now());
    if (verts.length < 2) return;

    setPoints(verts.map((v) => new THREE.Vector3(v.x, v.y, v.z)));
    setVertexColors(verts.map((v) => v.color));
  });

  if (points.length < 2) return null;

  return (
    <Line
      points={points.length >= 2 ? points : placeholder}
      vertexColors={vertexColors}
      lineWidth={2.65}
      transparent
      depthWrite={false}
      renderOrder={5}
    />
  );
}
