/**
 * Initialize Rapier once before Physics mounts.
 * State lives on globalThis so Vite HMR does not call init() twice (SIGILL).
 */

const GLOBAL_KEY = "__quantumPendulumRapier__";

type RapierGlobalState = {
  promise: Promise<void> | null;
  ready: boolean;
  error: Error | null;
};

function state(): RapierGlobalState {
  const g = globalThis as typeof globalThis & {
    [GLOBAL_KEY]?: RapierGlobalState;
  };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { promise: null, ready: false, error: null };
  }
  return g[GLOBAL_KEY]!;
}

export function rapierInitError(): Error | null {
  return state().error;
}

export function isRapierReady(): boolean {
  return state().ready;
}

export function ensureRapierInitialized(): Promise<void> {
  const s = state();
  if (s.ready) return Promise.resolve();
  if (s.error) return Promise.reject(s.error);
  if (!s.promise) {
    s.promise = import("@dimforge/rapier3d-compat")
      .then((RAPIER) => RAPIER.init())
      .then(() => {
        s.ready = true;
      })
      .catch((err: unknown) => {
        s.error =
          err instanceof Error ? err : new Error("Rapier physics failed to load");
        s.promise = null;
        throw s.error;
      });
  }
  return s.promise;
}
