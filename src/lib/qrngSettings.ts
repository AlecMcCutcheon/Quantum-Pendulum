const KEY_STORAGE = "quantum-pendulum-outshift-api-key";
const PROVIDER_STORAGE = "quantum-pendulum-qrng-provider";

/** Preserve characters exactly (Outshift keys may include a trailing comma). */
export function normalizeOutshiftApiKey(key: string): string {
  return key.trim().replace(/\r\n/g, "");
}

export type QrngProvider = "outshift" | "qrandom";

export function getQrngProvider(): QrngProvider {
  try {
    const v = localStorage.getItem(PROVIDER_STORAGE);
    if (v === "outshift" || v === "qrandom") return v;
    if (v === "anu") return "qrandom";
  } catch {
    /* ignore */
  }
  return hasOutshiftApiKey() ? "outshift" : "qrandom";
}

export function setQrngProvider(provider: QrngProvider): void {
  localStorage.setItem(PROVIDER_STORAGE, provider);
}

export function getOutshiftApiKey(): string | null {
  try {
    const v = localStorage.getItem(KEY_STORAGE);
    if (!v) return null;
    const normalized = normalizeOutshiftApiKey(v);
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

export function setOutshiftApiKey(key: string): void {
  localStorage.setItem(KEY_STORAGE, normalizeOutshiftApiKey(key));
}

export function clearOutshiftApiKey(): void {
  localStorage.removeItem(KEY_STORAGE);
}

export function hasOutshiftApiKey(): boolean {
  return getOutshiftApiKey() !== null;
}
