import { useEffect, useMemo, useState } from "react";
import type { DivinationCircle } from "../types/pendulum";
import {
  maybeVisualStrength,
  type AxisStrengths,
  type SwingConfidence,
} from "../lib/swingMotion";
import { parseSwingCircle } from "../lib/swingCircle";
import {
  buildTrailSvgSegments,
  type TrailPoint,
} from "./pendulum3d/pendulumTrailStore";
import { WORLD } from "./pendulum3d/constants";
import {
  SCENE_LAYERS,
  guideColorForAxis,
} from "../theme/sitePalette";
import { DiscPlaneLabel } from "./discPlane/DiscPlaneLabel";
import {
  buildDiscGeometricPattern,
  buildFourAxisGuides,
  centerRingRadius,
} from "./discPlane/discPlaneSvg";

const RIM = 0.9;
const LABEL_OUTSET = 36;
const VIEW_SIZE = 480;

interface DiscPlaneViewProps {
  circle: DivinationCircle;
  axisStrengths: AxisStrengths;
  confidence: SwingConfidence;
  trailRef: React.RefObject<TrailPoint[]>;
  running: boolean;
  size?: number;
}

export function DiscPlaneView({
  circle,
  axisStrengths,
  confidence,
  trailRef,
  running,
  size = VIEW_SIZE,
}: DiscPlaneViewProps) {
  const [frame, setFrame] = useState(0);
  const slots = parseSwingCircle(circle.sectors);
  const maybeVis = maybeVisualStrength(confidence, axisStrengths);
  const bg = SCENE_LAYERS.bg;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;
  const outer = r * RIM;
  const labelR = outer + LABEL_OUTSET;
  const corner = labelR * 0.72;
  const centerR = centerRingRadius(r);

  const project = useMemo(
    () => (wx: number, wz: number) => {
      const scale = (r * RIM) / WORLD.discRadius;
      return { x: cx + wx * scale, y: cy + wz * scale };
    },
    [cx, cy, r],
  );

  const patternShapes = useMemo(
    () => buildDiscGeometricPattern(cx, cy, r),
    [cx, cy, r],
  );

  const axisGuides = useMemo(
    () => buildFourAxisGuides(cx, cy, r, axisStrengths, slots),
    [cx, cy, r, axisStrengths, slots],
  );

  useEffect(() => {
    if (!running) return;
    let id = 0;
    const tick = () => {
      setFrame((f) => (f + 1) % 1_000_000);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running]);

  const trailSegments = useMemo(() => {
    void frame;
    const buf = trailRef.current;
    if (!buf || buf.length < 2) return [];
    return buildTrailSvgSegments(buf, performance.now(), project);
  }, [frame, trailRef, project]);

  const rimLabels = [
    { label: slots.yes.label, x: cx, y: cy - labelR, slot: slots.yes.hue, s: axisStrengths.yes },
    { label: slots.yes.label, x: cx, y: cy + labelR, slot: slots.yes.hue, s: axisStrengths.yes },
    { label: slots.no.label, x: cx - labelR, y: cy, slot: slots.no.hue, s: axisStrengths.no },
    { label: slots.no.label, x: cx + labelR, y: cy, slot: slots.no.hue, s: axisStrengths.no },
    {
      label: slots.good.label,
      x: cx + corner,
      y: cy - corner,
      slot: slots.good.hue,
      s: axisStrengths.good,
    },
    {
      label: slots.good.label,
      x: cx - corner,
      y: cy + corner,
      slot: slots.good.hue,
      s: axisStrengths.good,
    },
    {
      label: slots.bad.label,
      x: cx - corner,
      y: cy - corner,
      slot: slots.bad.hue,
      s: axisStrengths.bad,
    },
    {
      label: slots.bad.label,
      x: cx + corner,
      y: cy + corner,
      slot: slots.bad.hue,
      s: axisStrengths.bad,
    },
  ];

  const clipId = "disc-plane-clip";

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto max-h-[min(640px,82vh)] w-full max-w-3xl font-display"
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {patternShapes.map((shape, i) =>
          shape.kind === "circle" ? (
            <circle
              key={`p-${i}`}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={shape.fill}
              fillOpacity={shape.opacity}
            />
          ) : (
            <path
              key={`p-${i}`}
              d={shape.d}
              fill={shape.fill}
              fillOpacity={shape.opacity}
            />
          ),
        )}
      </g>

      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={bg.discColor}
        fillOpacity={bg.discOpacity}
        stroke={bg.rimColor}
        strokeOpacity={bg.rimOpacity}
        strokeWidth={1.5}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.97}
        fill="none"
        stroke={bg.rimColor}
        strokeOpacity={bg.rimOpacity * 0.85}
        strokeWidth={1}
      />

      {trailSegments.map((seg, i) => (
        <line
          key={`t-${i}`}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={seg.stroke}
          strokeWidth={seg.strokeWidth}
          strokeLinecap="round"
        />
      ))}

      {axisGuides.map((g, i) => (
        <g key={`g-${i}`}>
          <line
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            stroke={g.color}
            strokeWidth={g.glowWidth}
            strokeOpacity={g.opacity * 0.28}
            strokeLinecap="round"
          />
          <line
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            stroke={g.color}
            strokeWidth={g.lineWidth}
            strokeOpacity={g.opacity}
            strokeLinecap="round"
          />
        </g>
      ))}

      <circle
        cx={cx}
        cy={cy}
        r={centerR}
        fill="none"
        stroke={guideColorForAxis(slots.maybe.hue, maybeVis)}
        strokeOpacity={Math.min(1, bg.centerRingOpacity + maybeVis * 0.35)}
        strokeWidth={1.2 + maybeVis * 1.4}
      />

      {rimLabels.map((item, i) => (
        <DiscPlaneLabel
          key={`${item.label}-${i}`}
          x={item.x}
          y={item.y}
          label={item.label}
          slot={item.slot}
          strength={item.s}
          fontSize={16}
        />
      ))}

      <DiscPlaneLabel
        x={cx}
        y={cy}
        label={slots.maybe.label}
        slot={slots.maybe.hue}
        strength={Math.max(0.35, maybeVis)}
        fontSize={14}
      />
    </svg>
  );
}
