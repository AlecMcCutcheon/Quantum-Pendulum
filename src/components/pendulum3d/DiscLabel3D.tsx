import { Text } from "@react-three/drei";
import {
  DISPLAY_FONT_URL,
  SITE,
  labelColorForAxis,
  labelOpacityForStrength,
  type AxisSlot,
} from "../../theme/sitePalette";

interface DiscLabel3DProps {
  position: [number, number, number];
  label: string;
  strength: number;
  axis: AxisSlot;
  fontSize?: number;
}

export function DiscLabel3D({
  position,
  label,
  strength,
  axis,
  fontSize = 0.12,
}: DiscLabel3DProps) {
  const fill = labelColorForAxis(axis, strength);

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <Text
        font={DISPLAY_FONT_URL}
        fontSize={fontSize}
        color={fill}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        fillOpacity={labelOpacityForStrength(strength)}
        outlineWidth={0.028}
        outlineColor={SITE.void}
        outlineOpacity={0.95}
        renderOrder={14}
      >
        {label}
      </Text>
    </group>
  );
}
