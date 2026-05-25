/** World units (meters) for Rapier simulation */
export const WORLD = {
  gravity: [0, -9.81, 0] as [number, number, number],
  anchorY: 2.55,
  discY: 0.55,
  discRadius: 0.85,
  rodLength: 1.55,
  bobRadius: 0.13,
  bobColliderRadius: 0.14,
  bobMass: 2.35,
  anchorSpringK: 2.5,
  anchorSpringDamp: 0.82,
  anchorMaxRadius: 0.72,
  /** Effective anchor mass — lower = snappier response to quantum pulls */
  anchorMass: 1.1,
  /** Pull toward each quantum disk target */
  pivotTargetPullK: 20,
  pivotVisualRadius: 0.022,
  mountVisualRadius: 0.025,
  discCenterRadius: 0.2,
} as const;
