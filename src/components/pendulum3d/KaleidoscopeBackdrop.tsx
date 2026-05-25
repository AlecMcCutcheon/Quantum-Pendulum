import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  KALEIDOSCOPE_BASE_HUES,
  SCENE_LAYERS,
  kaleidoscopeBgHex,
} from "../../theme/sitePalette";
import { WORLD } from "./constants";

const FOLDS = 8;
const DOUBLE = THREE.DoubleSide;

function wedgeShape(
  innerR: number,
  outerR: number,
  halfAngle: number,
): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(
    Math.cos(-halfAngle) * innerR,
    Math.sin(-halfAngle) * innerR,
  );
  s.lineTo(
    Math.cos(-halfAngle) * outerR,
    Math.sin(-halfAngle) * outerR,
  );
  s.lineTo(
    Math.cos(halfAngle) * outerR,
    Math.sin(halfAngle) * outerR,
  );
  s.lineTo(
    Math.cos(halfAngle) * innerR,
    Math.sin(halfAngle) * innerR,
  );
  s.closePath();
  return s;
}

function triangleShape(radius: number, halfAngle: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(Math.cos(-halfAngle) * radius, Math.sin(-halfAngle) * radius);
  s.lineTo(Math.cos(halfAngle) * radius, Math.sin(halfAngle) * radius);
  s.closePath();
  return s;
}

interface KaleidoscopeLayerProps {
  y: number;
  radiusScale: number;
  opacityMul: number;
}

function KaleidoscopeLayer({ y, radiusScale, opacityMul }: KaleidoscopeLayerProps) {
  const half = Math.PI / FOLDS;
  const outer = WORLD.discRadius * 1.02 * radiusScale;
  const inner = WORLD.discRadius * 0.32 * radiusScale;
  const mid = WORLD.discRadius * 0.62 * radiusScale;
  const baseOp = SCENE_LAYERS.bg.kaleidoscopeOpacityScale * opacityMul;

  const ringWedge = useMemo(
    () => wedgeShape(inner, outer, half * 0.92),
    [inner, outer, half],
  );
  const midTri = useMemo(
    () => triangleShape(mid, half * 0.55),
    [mid, half],
  );
  const outerTri = useMemo(
    () => triangleShape(outer * 0.42, half * 0.38),
    [outer, half],
  );

  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: FOLDS }, (_, i) => {
        const angle = (i * 2 * Math.PI) / FOLDS;
        const hue = KALEIDOSCOPE_BASE_HUES[i % KALEIDOSCOPE_BASE_HUES.length]!;
        const color = kaleidoscopeBgHex(hue.h, hue.s);
        const alt = KALEIDOSCOPE_BASE_HUES[(i + 2) % KALEIDOSCOPE_BASE_HUES.length]!;

        return (
          <group key={i} rotation={[0, angle, 0]}>
            <group>
              <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
                <shapeGeometry args={[ringWedge]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={baseOp}
                  depthWrite={false}
                  side={DOUBLE}
                />
              </mesh>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[outer * 0.72, 0, 0]}
                renderOrder={0}
              >
                <shapeGeometry args={[outerTri]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={baseOp * 0.85}
                  depthWrite={false}
                  side={DOUBLE}
                />
              </mesh>
            </group>
            <group scale={[1, 1, -1]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={0}>
                <shapeGeometry args={[ringWedge]} />
                <meshBasicMaterial
                  color={kaleidoscopeBgHex(alt.h, alt.s)}
                  transparent
                  opacity={baseOp * 0.75}
                  depthWrite={false}
                  side={DOUBLE}
                />
              </mesh>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[mid * 0.85, 0, 0]}
                renderOrder={0}
              >
                <shapeGeometry args={[midTri]} />
                <meshBasicMaterial
                  color={kaleidoscopeBgHex(alt.h, alt.s)}
                  transparent
                  opacity={baseOp * 0.7}
                  depthWrite={false}
                  side={DOUBLE}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function KaleidoscopeInnerLayer() {
  const inner = WORLD.discCenterRadius * 1.05;
  const half = Math.PI / 6;
  const baseOp = SCENE_LAYERS.bg.kaleidoscopeOpacityScale * 1.15;

  return (
    <group position={[0, WORLD.discY + 0.006, 0]} renderOrder={1}>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 2 * Math.PI) / 6;
        const hue = KALEIDOSCOPE_BASE_HUES[i % KALEIDOSCOPE_BASE_HUES.length]!;
        const color = kaleidoscopeBgHex(hue.h, hue.s);
        const tri = triangleShape(inner * 0.95, half);
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
              <shapeGeometry args={[tri]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={baseOp}
                depthWrite={false}
                side={DOUBLE}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function KaleidoscopeBackdrop() {
  const spinA = useRef<THREE.Group>(null);
  const spinB = useRef<THREE.Group>(null);
  const spinInner = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (spinA.current) spinA.current.rotation.y += dt * 0.042;
    if (spinB.current) spinB.current.rotation.y -= dt * 0.026;
    if (spinInner.current) spinInner.current.rotation.y += dt * 0.055;
  });

  return (
    <>
      <group ref={spinA}>
        <KaleidoscopeLayer
          y={WORLD.discY - 0.028}
          radiusScale={1}
          opacityMul={1}
        />
      </group>
      <group ref={spinB}>
        <KaleidoscopeLayer
          y={WORLD.discY - 0.052}
          radiusScale={1.2}
          opacityMul={0.75}
        />
      </group>
      <group ref={spinInner}>
        <KaleidoscopeInnerLayer />
      </group>
    </>
  );
}
