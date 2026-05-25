/** Suppress known dependency deprecation noise until upstream (R3F v10, Rapier init) catches up. */
const SUPPRESSED_WARNINGS = [
  "THREE.Clock: This module has been deprecated",
  "using deprecated parameters for the initialization function",
  "PCFSoftShadowMap has been deprecated",
] as const;

let installed = false;

export function installConsoleFilters(): void {
  if (installed) return;
  installed = true;

  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      SUPPRESSED_WARNINGS.some((snippet) => first.includes(snippet))
    ) {
      return;
    }
    originalWarn(...args);
  };
}
