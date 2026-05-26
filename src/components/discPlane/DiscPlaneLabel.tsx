import { SITE, labelColorForAxis, type AxisSlot } from "../../theme/sitePalette";

interface DiscPlaneLabelProps {
  x: number;
  y: number;
  label: string;
  slot: AxisSlot;
  strength: number;
  fontSize?: number;
}

/** Rim / center label with void outline (matches 3D DiscLabel3D). */
export function DiscPlaneLabel({
  x,
  y,
  label,
  slot,
  strength,
  fontSize = 14,
}: DiscPlaneLabelProps) {
  const fill = labelColorForAxis(slot, strength);
  const weight = strength > 0.32 ? 600 : 500;
  const ringR = fontSize * 0.78;
  const outline = 5 + strength * 1.8;

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={ringR}
        fill={SITE.void}
        fillOpacity={0.88}
        stroke={SITE.void}
        strokeWidth={1.5}
        strokeOpacity={0.95}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        paintOrder="stroke fill"
        stroke={SITE.void}
        strokeWidth={outline}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          fontSize,
          fontWeight: weight,
          fill,
          opacity: 1,
        }}
      >
        {label}
      </text>
    </g>
  );
}
