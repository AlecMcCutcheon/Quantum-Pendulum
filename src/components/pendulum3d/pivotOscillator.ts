import type { PendulumImpulse } from "../../types/pendulum";

export interface PivotState {
  x: number;
  z: number;
  vx: number;
  vz: number;
  targetX: number;
  targetZ: number;
  approachStrength: number;
  /** Higher = faster ease toward target (1/s) */
  blendRate: number;
}

export interface PivotTuning {
  springK: number;
  damping: number;
  maxRadius: number;
  targetPullK: number;
  mass: number;
}

export function createPivotState(): PivotState {
  return {
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    targetX: 0,
    targetZ: 0,
    approachStrength: 0.5,
    blendRate: 2.4,
  };
}

export function stepPivot(
  state: PivotState,
  dt: number,
  tuning: PivotTuning,
): PivotState {
  const blend = 1 - Math.exp(-state.blendRate * dt);
  const pull = state.approachStrength * tuning.targetPullK;
  const steer = state.approachStrength * blend * 2.15;
  const mass = Math.max(0.5, tuning.mass);

  const dx = state.targetX - state.x;
  const dz = state.targetZ - state.z;

  let vx =
    state.vx +
    ((dx * pull * blend) / mass -
      (tuning.springK * state.x) / mass -
      (tuning.damping * state.vx) / mass) *
      dt;
  let vz =
    state.vz +
    ((dz * pull * blend) / mass -
      (tuning.springK * state.z) / mass -
      (tuning.damping * state.vz) / mass) *
      dt;

  let x = state.x + vx * dt + (dx * steer * dt) / mass;
  let z = state.z + vz * dt + (dz * steer * dt) / mass;

  const r = Math.hypot(x, z);
  if (r > tuning.maxRadius) {
    const s = tuning.maxRadius / r;
    x *= s;
    z *= s;
    vx *= 0.92;
    vz *= 0.92;
  }

  return {
    x,
    z,
    vx,
    vz,
    targetX: state.targetX,
    targetZ: state.targetZ,
    approachStrength: state.approachStrength,
    blendRate: state.blendRate,
  };
}

/** New quantum draw — keeps vx/vz so the anchor coasts (inertia) toward the target. */
export function applyPivotTarget(
  state: PivotState,
  impulse: PendulumImpulse,
): PivotState {
  const blendRate = 1000 / Math.max(140, impulse.blendMs);
  return {
    ...state,
    targetX: impulse.targetX,
    targetZ: impulse.targetZ,
    approachStrength: impulse.approachStrength,
    blendRate,
  };
}
