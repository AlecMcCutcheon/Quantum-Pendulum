/**
 * Elastic anchor on x–z plane + rigid rod (fixed length L).
 * Bob is always anchor + L·u. Anchor moves first; swing lags via inertia on the rod.
 */

export interface AnchorState {
  x: number;
  z: number;
  vx: number;
  vz: number;
}

export interface RodState {
  u: Vec3;
  omega: Vec3;
}

export interface SimState3D {
  anchor: AnchorState;
  rod: RodState;
  prevAnchorVx: number;
  prevAnchorVz: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const PHYSICS = {
  dt: 1 / 60,
  rodLength: 1,
  gravity: 9.81,
  anchorSpringK: 1.1,
  anchorDamping: 0.88,
  anchorMaxRadius: 1.15,
  rodDamping: 0.038,
  /** Pivot acceleration → bob lags behind (inertial torque) */
  pivotAccelCoupling: 1.35,
  /** Pivot velocity → tip trails, not dragged in lockstep */
  pivotVelCoupling: 2.1,
  maxOmega: 5,
} as const;

const DOWN: Vec3 = { x: 0, y: -1, z: 0 };

export function vec3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale(v: Vec3, s: number): Vec3 {
  return { x: v.x * s, y: v.y * s, z: v.z * s };
}

export function len(v: Vec3): number {
  return Math.hypot(v.x, v.y, v.z);
}

export function normalize(v: Vec3): Vec3 {
  const l = len(v);
  if (l < 1e-8) return { ...DOWN };
  return scale(v, 1 / l);
}

export function tangentComponent(v: Vec3, u: Vec3): Vec3 {
  return sub(v, scale(u, dot(v, u)));
}

export function constrainOmega(u: Vec3, omega: Vec3): Vec3 {
  return tangentComponent(omega, u);
}

export function createInitialSim(): SimState3D {
  const u = normalize(vec3(0.08, -0.99, 0.1));
  return {
    anchor: { x: 0, z: 0, vx: 0, vz: 0 },
    rod: { u, omega: vec3(0, 0, 0) },
    prevAnchorVx: 0,
    prevAnchorVz: 0,
  };
}

export function bobWorld(anchor: AnchorState, u: Vec3): Vec3 {
  const L = PHYSICS.rodLength;
  return {
    x: anchor.x + u.x * L,
    y: u.y * L,
    z: anchor.z + u.z * L,
  };
}

/** Bob position relative to anchor only (rope direction × length). */
export function bobRelative(u: Vec3): Vec3 {
  const L = PHYSICS.rodLength;
  return { x: u.x * L, y: u.y * L, z: u.z * L };
}

export function anchorWorld(anchor: AnchorState): Vec3 {
  return { x: anchor.x, y: 0, z: anchor.z };
}

export function stepAnchor(anchor: AnchorState, dt: number): AnchorState {
  const { anchorSpringK, anchorDamping, anchorMaxRadius } = PHYSICS;
  const ax = -anchorSpringK * anchor.x - anchorDamping * anchor.vx;
  const az = -anchorSpringK * anchor.z - anchorDamping * anchor.vz;

  let vx = anchor.vx + ax * dt;
  let vz = anchor.vz + az * dt;
  let x = anchor.x + vx * dt;
  let z = anchor.z + vz * dt;

  const r = Math.hypot(x, z);
  if (r > anchorMaxRadius) {
    const s = anchorMaxRadius / r;
    x *= s;
    z *= s;
    vx *= 0.65;
    vz *= 0.65;
  }

  return { x, z, vx, vz };
}

export function stepRod(
  rod: RodState,
  anchorVel: Vec3,
  anchorAccel: Vec3,
  dt: number,
): RodState {
  const {
    gravity,
    rodLength,
    rodDamping,
    pivotAccelCoupling,
    pivotVelCoupling,
    maxOmega,
  } = PHYSICS;
  let { u, omega } = rod;
  const g = vec3(0, -gravity, 0);

  let alpha = tangentComponent(scale(cross(u, g), 1 / rodLength), u);

  // Pivot accelerates → fictitious torque makes bob lag (opposes anchor shove)
  const inertial = tangentComponent(
    scale(cross(u, anchorAccel), -pivotAccelCoupling / rodLength),
    u,
  );
  alpha = add(alpha, inertial);

  // Tip velocity should trail pivot velocity in the plane (momentum down the rope)
  const tipVel = scale(cross(omega, u), rodLength);
  const mismatch = vec3(
    anchorVel.x - tipVel.x,
    0,
    anchorVel.z - tipVel.z,
  );
  const velLag = tangentComponent(
    scale(cross(u, mismatch), pivotVelCoupling / (rodLength * rodLength)),
    u,
  );
  alpha = add(alpha, velLag);

  omega = add(omega, scale(alpha, dt));
  omega = sub(omega, scale(omega, rodDamping));
  omega = constrainOmega(u, omega);

  if (len(omega) > maxOmega) {
    omega = scale(normalize(omega), maxOmega);
  }

  const du = cross(omega, u);
  u = normalize(add(u, scale(du, dt)));
  omega = constrainOmega(u, omega);

  return { u, omega };
}

export function stepSimulation(sim: SimState3D): SimState3D {
  const dt = PHYSICS.dt;
  const anchor = stepAnchor(sim.anchor, dt);

  const anchorVel = vec3(anchor.vx, 0, anchor.vz);
  const anchorAccel = vec3(
    (anchor.vx - sim.prevAnchorVx) / dt,
    0,
    (anchor.vz - sim.prevAnchorVz) / dt,
  );

  const rod = stepRod(sim.rod, anchorVel, anchorAccel, dt);

  return {
    anchor,
    rod,
    prevAnchorVx: anchor.vx,
    prevAnchorVz: anchor.vz,
  };
}

/** Quantum only moves the anchor — pendulum follows from inertia. */
export function applyImpulse(
  sim: SimState3D,
  impulse: { anchorVx: number; anchorVy: number },
): SimState3D {
  return {
    ...sim,
    anchor: {
      ...sim.anchor,
      vx: sim.anchor.vx + impulse.anchorVx,
      vz: sim.anchor.vz + impulse.anchorVy,
    },
  };
}

export interface Projected2D {
  sx: number;
  sy: number;
  depth: number;
}

export function project3D(
  p: Vec3,
  cx: number,
  cy: number,
  scale: number,
): Projected2D {
  const sx = cx + (p.x * 1.05 + p.z * 0.42) * scale;
  const sy = cy - (p.y * 0.95 - p.z * 0.18) * scale;
  return { sx, sy, depth: p.z - p.y * 0.2 };
}
