import type { DivinationCircle } from "../types/pendulum";
import { parseSwingCircle, sectorIndexForReading } from "../lib/swingCircle";
import type { SwingReading } from "../lib/swingMotion";
import {
  AXIS_SITE,
  SCENE_LAYERS,
  SITE,
  axisGlowHex,
  guideColorForAxis,
  guideOpacityForStrength,
  type AxisSlot,
} from "../theme/sitePalette";

const SLOT_INDEX: Record<AxisSlot, number> = {
  yes: 0,
  no: 1,
  good: 2,
  bad: 3,
  maybe: 4,
};

interface DivinationCircleVisualProps {
  circle: DivinationCircle;
  activeSector: number;
  size?: number;
}

export function DivinationCircleVisual({
  circle,
  activeSector,
  size = 280,
}: DivinationCircleVisualProps) {
  const slots = parseSwingCircle(circle.sectors);
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const diag = r * 0.72;
  const inner = r * 0.28;
  const bg = SCENE_LAYERS.bg;

  const isLit = (slot: AxisSlot) => activeSector === SLOT_INDEX[slot];

  const rim = [
    { label: slots.yes.label, x: cx, y: cy - r * 0.9, slot: slots.yes.hue },
    { label: slots.yes.label, x: cx, y: cy + r * 0.9, slot: slots.yes.hue },
    { label: slots.no.label, x: cx - r * 0.9, y: cy, slot: slots.no.hue },
    { label: slots.no.label, x: cx + r * 0.9, y: cy, slot: slots.no.hue },
    {
      label: slots.good.label,
      x: cx + diag,
      y: cy - diag,
      slot: slots.good.hue,
    },
    {
      label: slots.good.label,
      x: cx - diag,
      y: cy + diag,
      slot: slots.good.hue,
    },
    {
      label: slots.bad.label,
      x: cx - diag,
      y: cy - diag,
      slot: slots.bad.hue,
    },
    {
      label: slots.bad.label,
      x: cx + diag,
      y: cy + diag,
      slot: slots.bad.hue,
    },
  ];

  const guides: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    slot: AxisSlot;
  }[] = [
    { x1: cx, y1: cy - inner, x2: cx, y2: cy - r, slot: slots.yes.hue },
    { x1: cx, y1: cy + inner, x2: cx, y2: cy + r, slot: slots.yes.hue },
    { x1: cx - inner, y1: cy, x2: cx - r, y2: cy, slot: slots.no.hue },
    { x1: cx + inner, y1: cy, x2: cx + r, y2: cy, slot: slots.no.hue },
    {
      x1: cx + inner * 0.7,
      y1: cy - inner * 0.7,
      x2: cx + diag,
      y2: cy - diag,
      slot: slots.good.hue,
    },
    {
      x1: cx - inner * 0.7,
      y1: cy + inner * 0.7,
      x2: cx - diag,
      y2: cy + diag,
      slot: slots.good.hue,
    },
    {
      x1: cx - inner * 0.7,
      y1: cy - inner * 0.7,
      x2: cx - diag,
      y2: cy - diag,
      slot: slots.bad.hue,
    },
    {
      x1: cx + inner * 0.7,
      y1: cy + inner * 0.7,
      x2: cx + diag,
      y2: cy + diag,
      slot: slots.bad.hue,
    },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto font-display"
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={bg.discColor}
        fillOpacity={bg.discOpacity}
        stroke={bg.rimColor}
        strokeOpacity={bg.rimOpacity}
        strokeWidth={1}
      />
      {guides.map((g, i) => {
        const lit = isLit(g.slot);
        const share = lit ? 0.55 : 0.22;
        return (
          <line
            key={i}
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
            stroke={guideColorForAxis(g.slot, share)}
            strokeWidth={lit ? 2.5 : 1.2}
            opacity={lit ? 1 : guideOpacityForStrength(share)}
          />
        );
      })}
      {rim.map((item, i) => {
        const lit = isLit(item.slot);
        const share = lit ? 0.55 : 0.22;
        return (
          <text
            key={`${item.label}-${i}`}
            x={item.x}
            y={item.y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: 11,
              fontWeight: lit ? 600 : 500,
              opacity: lit ? 1 : 0.72,
              fill: guideColorForAxis(item.slot, share),
            }}
          >
            {item.label}
          </text>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={r * 0.14}
        fill={SITE.void}
        fillOpacity={0.55}
        stroke={axisGlowHex("maybe")}
        strokeWidth={isLit("maybe") ? 2 : 1}
        opacity={isLit("maybe") ? 1 : 0.7}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: 10,
          fontWeight: isLit("maybe") ? 600 : 500,
          fill: isLit("maybe")
            ? axisGlowHex("maybe")
            : AXIS_SITE.maybe,
        }}
      >
        {slots.maybe.label}
      </text>
    </svg>
  );
}

export function activeSectorForReading(
  reading: SwingReading,
  circle: DivinationCircle,
): number {
  return sectorIndexForReading(reading, circle.sectors);
}
