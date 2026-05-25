import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { DivinationCircle } from "../../types/pendulum";
import {
  maybeVisualStrength,
  type AxisStrengths,
  type SwingConfidence,
} from "../../lib/swingMotion";
import { parseSwingCircle, type ParsedSwingCircle } from "../../lib/swingCircle";
import {
  SCENE_LAYERS,
  guideColorForAxis,
  guideOpacityForStrength,
} from "../../theme/sitePalette";
import { DiscLabel3D } from "./DiscLabel3D";
import { WORLD } from "./constants";

const DOUBLE_SIDE = THREE.DoubleSide;
const DISC_LIFT = 0.012;
const RIM = 0.9;
const DIAG = RIM * 0.72;

interface DivinationDisc3DProps {
  circle: DivinationCircle;
  confidence: SwingConfidence;
  axisStrengths: AxisStrengths;
}

function axisGuideVisual(strength: number): { opacity: number; lineWidth: number } {
  const t = Math.max(0, Math.min(1, strength));
  return {
    opacity: guideOpacityForStrength(t),
    lineWidth: 0.9 + t * 1.5,
  };
}

function AxisArrow({
  from,
  to,
  color,
  opacity,
  lineWidth,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  opacity: number;
  lineWidth: number;
}) {
  return (
    <Line
      points={[from, to]}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
}

/** N–S, E–W, TR↔BL, TL↔BR — colors from circle sector hues */
function FourAxisGuide({
  y,
  r,
  axis,
  slots,
}: {
  y: number;
  r: number;
  axis: AxisStrengths;
  slots: ParsedSwingCircle;
}) {
  const py = y + DISC_LIFT * 0.5;
  const inner = r * 0.28;
  const outer = r * 0.9;
  const dIn = r * DIAG * 0.4;
  const dOut = r * DIAG * 0.95;

  const yes = axisGuideVisual(axis.yes);
  const no = axisGuideVisual(axis.no);
  const good = axisGuideVisual(axis.good);
  const bad = axisGuideVisual(axis.bad);

  const yesC = guideColorForAxis(slots.yes.hue, axis.yes);
  const noC = guideColorForAxis(slots.no.hue, axis.no);
  const goodC = guideColorForAxis(slots.good.hue, axis.good);
  const badC = guideColorForAxis(slots.bad.hue, axis.bad);

  return (
    <group>
      <AxisArrow
        from={[0, py, -inner]}
        to={[0, py, -outer]}
        color={yesC}
        opacity={yes.opacity}
        lineWidth={yes.lineWidth}
      />
      <AxisArrow
        from={[0, py, inner]}
        to={[0, py, outer]}
        color={yesC}
        opacity={yes.opacity}
        lineWidth={yes.lineWidth}
      />
      <AxisArrow
        from={[-inner, py, 0]}
        to={[-outer, py, 0]}
        color={noC}
        opacity={no.opacity}
        lineWidth={no.lineWidth}
      />
      <AxisArrow
        from={[inner, py, 0]}
        to={[outer, py, 0]}
        color={noC}
        opacity={no.opacity}
        lineWidth={no.lineWidth}
      />
      <AxisArrow
        from={[dIn, py, -dIn]}
        to={[dOut, py, -dOut]}
        color={goodC}
        opacity={good.opacity}
        lineWidth={good.lineWidth}
      />
      <AxisArrow
        from={[-dIn, py, dIn]}
        to={[-dOut, py, dOut]}
        color={goodC}
        opacity={good.opacity}
        lineWidth={good.lineWidth}
      />
      <AxisArrow
        from={[-dIn, py, -dIn]}
        to={[-dOut, py, -dOut]}
        color={badC}
        opacity={bad.opacity}
        lineWidth={bad.lineWidth}
      />
      <AxisArrow
        from={[dIn, py, dIn]}
        to={[dOut, py, dOut]}
        color={badC}
        opacity={bad.opacity}
        lineWidth={bad.lineWidth}
      />
    </group>
  );
}

export function DivinationDisc3D({
  circle,
  confidence,
  axisStrengths,
}: DivinationDisc3DProps) {
  const r = WORLD.discRadius;
  const y = WORLD.discY;
  const cy = y + DISC_LIFT;
  const centerR = WORLD.discCenterRadius;
  const slots = parseSwingCircle(circle.sectors);
  const axis = axisStrengths;
  const maybeVis = maybeVisualStrength(confidence, axis);
  const bg = SCENE_LAYERS.bg;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} renderOrder={2}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial
          color={bg.discColor}
          transparent
          opacity={bg.discOpacity}
          depthWrite={false}
          side={DOUBLE_SIDE}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, cy, 0]} renderOrder={3}>
        <ringGeometry args={[r * 0.97, r, 64]} />
        <meshBasicMaterial
          color={bg.rimColor}
          transparent
          opacity={bg.rimOpacity}
          depthWrite={false}
          side={DOUBLE_SIDE}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, cy + 0.001, 0]} renderOrder={3}>
        <ringGeometry args={[centerR * 0.52, centerR, 48]} />
        <meshBasicMaterial
          color={guideColorForAxis(slots.maybe.hue, maybeVis)}
          transparent
          opacity={bg.centerRingOpacity + maybeVis * 0.28}
          depthWrite={false}
          side={DOUBLE_SIDE}
        />
      </mesh>

      <FourAxisGuide y={y} r={r} axis={axis} slots={slots} />

      <DiscLabel3D
        position={[0, cy + 0.02, -r * RIM]}
        label={slots.yes.label}
        strength={axis.yes}
        axis={slots.yes.hue}
        fontSize={0.13}
      />
      <DiscLabel3D
        position={[0, cy + 0.02, r * RIM]}
        label={slots.yes.label}
        strength={axis.yes}
        axis={slots.yes.hue}
        fontSize={0.13}
      />
      <DiscLabel3D
        position={[-r * RIM, cy + 0.02, 0]}
        label={slots.no.label}
        strength={axis.no}
        axis={slots.no.hue}
        fontSize={0.13}
      />
      <DiscLabel3D
        position={[r * RIM, cy + 0.02, 0]}
        label={slots.no.label}
        strength={axis.no}
        axis={slots.no.hue}
        fontSize={0.13}
      />
      <DiscLabel3D
        position={[r * DIAG, cy + 0.02, -r * DIAG]}
        label={slots.good.label}
        strength={axis.good}
        axis={slots.good.hue}
        fontSize={0.11}
      />
      <DiscLabel3D
        position={[-r * DIAG, cy + 0.02, r * DIAG]}
        label={slots.good.label}
        strength={axis.good}
        axis={slots.good.hue}
        fontSize={0.11}
      />
      <DiscLabel3D
        position={[-r * DIAG, cy + 0.02, -r * DIAG]}
        label={slots.bad.label}
        strength={axis.bad}
        axis={slots.bad.hue}
        fontSize={0.11}
      />
      <DiscLabel3D
        position={[r * DIAG, cy + 0.02, r * DIAG]}
        label={slots.bad.label}
        strength={axis.bad}
        axis={slots.bad.hue}
        fontSize={0.11}
      />
      <DiscLabel3D
        position={[0, cy + 0.03, 0]}
        label={slots.maybe.label}
        strength={maybeVis}
        axis={slots.maybe.hue}
        fontSize={0.1}
      />
    </group>
  );
}
