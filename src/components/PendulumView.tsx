import type { DivinationCircle } from "../types/pendulum";
import type { ConsumedImpulse } from "../types/pendulum";
import { PendulumCanvas } from "./pendulum3d/PendulumCanvas";

interface PendulumViewProps {
  circle: DivinationCircle;
  running: boolean;
  micActive: boolean;
  consumeImpulse: () => ConsumedImpulse | null;
}

export function PendulumView(props: PendulumViewProps) {
  return <PendulumCanvas {...props} />;
}
