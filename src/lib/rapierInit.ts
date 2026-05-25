/**
 * Initialize Rapier once with the non-deprecated init signature before Physics mounts.
 */
let initPromise: Promise<void> | null = null;

export function ensureRapierInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = import("@dimforge/rapier3d-compat").then((RAPIER) =>
      RAPIER.init(),
    );
  }
  return initPromise;
}
