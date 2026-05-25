import { mapDecimalToRange, mapDecimalToUnit } from "./quantumMap";
import { normalizeOutshiftApiKey, type QrngProvider } from "./qrngSettings";

const OUTSHIFT_URL = "https://api.qrng.outshift.com/api/v1/random_numbers";
const QRANDOM_INT = "https://qrandom.io/api/random/int";
const QRANDOM_INTS = "https://qrandom.io/api/random/ints";
/** /ints returns 503 above ~1e9; /int accepts full 32-bit range (qrandom.io, May 2026). */
const QRANDOM_INTS_SAFE_MAX = 1_000_000_000;
const TIMEOUT_MS = 12000;

export const FAILOVER_NOTICE =
  "Outshift limit or outage — this draw used qrandom.io quantum randomness instead.";

export const DIRECT_NO_KEY_NOTICE =
  "No Outshift API key — this draw used qrandom.io instead.";

/** Public relays (allorigins.win often fails DNS). Tried in order. */
const CORS_BRIDGE_URLS = [
  (target: string) =>
    `https://api.cors.lol/?url=${encodeURIComponent(target)}`,
  (target: string) =>
    `https://api.cors.syrins.tech/?url=${encodeURIComponent(target)}`,
  /** Needs Origin from browser fetch; register your Pages host at corsfix.com */
  (target: string) =>
    `https://proxy.corsfix.com/?${encodeURIComponent(target)}`,
] as const;

function qrandomTargetUrl(min: number, max: number, size: number): string {
  if (size === 1 && max > QRANDOM_INTS_SAFE_MAX) {
    return `${QRANDOM_INT}?min=${min}&max=${max}`;
  }
  const cappedMax = Math.min(max, QRANDOM_INTS_SAFE_MAX);
  return `${QRANDOM_INTS}?min=${min}&max=${cappedMax}&n=${size}`;
}

function parseQrandomBatch(
  text: string,
  size: number,
): { result: number[]; raw: unknown[] } | null {
  try {
    const json = JSON.parse(text) as {
      number?: number;
      numbers?: number[];
      corsfix_error?: string;
    };
    if (json.corsfix_error) return null;
    if (Array.isArray(json.numbers) && json.numbers.length >= size) {
      const result = json.numbers.slice(0, size);
      return { result, raw: [json] };
    }
    if (size === 1 && typeof json.number === "number") {
      return { result: [json.number], raw: [json] };
    }
    return null;
  } catch {
    return null;
  }
}

/** Browser cannot call qrandom.io directly; use when no edge proxy is configured. */
export function needsQrandomCorsBridge(): boolean {
  return (
    typeof window !== "undefined" &&
    import.meta.env.PROD &&
    import.meta.env.BASE_URL !== "/"
  );
}

function qrandomFetchUrls(min: number, max: number, size: number, useCorsBridge: boolean): string[] {
  const target = qrandomTargetUrl(min, max, size);
  if (!useCorsBridge) return [target];
  return CORS_BRIDGE_URLS.map((bridge) => bridge(target));
}

async function fetchQrandomBatch(
  min: number,
  max: number,
  size: number,
  useCorsBridge: boolean,
): Promise<{ result: number[]; raw: unknown[] } | null> {
  for (const url of qrandomFetchUrls(min, max, size, useCorsBridge)) {
    const res = await fetchWithTimeout(url);
    if (!res?.ok) continue;
    const text = await res.text();
    const parsed = parseQrandomBatch(text, size);
    if (parsed) return parsed;
  }
  return null;
}

function bitsForRange(min: number, max: number): number {
  const span = max - min + 1;
  return Math.min(10000, Math.max(8, Math.ceil(Math.log2(span)) + 2));
}

function keyVariants(apiKey: string): string[] {
  const base = normalizeOutshiftApiKey(apiKey);
  if (base.endsWith(",")) return [base];
  return [base, `${base},`];
}

interface OutshiftBlock {
  decimal?: string | number;
  binary?: string;
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    return null;
  }
}

async function fetchOutshift(
  apiKey: string,
  body: object,
): Promise<{ ok: true; json: unknown } | { ok: false; status: number; text: string }> {
  for (const key of keyVariants(apiKey)) {
    const res = await fetchWithTimeout(OUTSHIFT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-id-api-key": key,
      },
      body: JSON.stringify(body),
    });
    if (!res) {
      return { ok: false, status: 0, text: "Network error" };
    }
    const text = await res.text();
    if (res.ok) {
      try {
        return { ok: true, json: JSON.parse(text) as unknown };
      } catch {
        return { ok: false, status: res.status, text: "Invalid JSON from Outshift" };
      }
    }
    if (res.status === 401 && !key.endsWith(",")) {
      continue;
    }
    return { ok: false, status: res.status, text };
  }
  return {
    ok: false,
    status: 401,
    text: "Invalid x-id-api-key.",
  };
}

function parseOutshiftBlocks(
  json: unknown,
  min: number,
  max: number,
  size: number,
): number[] | null {
  const data = json as { random_numbers?: OutshiftBlock[] };
  if (!Array.isArray(data.random_numbers) || data.random_numbers.length < size) {
    return null;
  }
  return data.random_numbers.slice(0, size).map((block) => {
    const raw = block.decimal ?? "0";
    return mapDecimalToRange(raw, min, max);
  });
}

function parseOutshiftFloats(json: unknown, size: number): number[] | null {
  const data = json as { random_numbers?: OutshiftBlock[] };
  if (!Array.isArray(data.random_numbers) || data.random_numbers.length < size) {
    return null;
  }
  return data.random_numbers.slice(0, size).map((block) => {
    const raw = block.decimal ?? "0";
    return mapDecimalToUnit(raw);
  });
}

async function tryOutshift(
  apiKey: string,
  min: number,
  max: number,
  size: number,
  format: "decimal" | "all" = "decimal",
): Promise<
  | { result: number[]; raw: unknown; request: object }
  | { error: string }
> {
  const request = {
    encoding: "raw",
    format,
    bits_per_block: bitsForRange(min, max),
    number_of_blocks: size,
  };
  const fetched = await fetchOutshift(apiKey, request);
  if (!fetched.ok) {
    return { error: `Outshift: ${fetched.text}` };
  }
  const result = parseOutshiftBlocks(fetched.json, min, max, size);
  if (!result) {
    return { error: "Outshift: unexpected response shape" };
  }
  return { result, raw: fetched.json, request };
}

async function tryOutshiftFloats(
  apiKey: string,
  size: number,
): Promise<
  | { result: number[]; raw: unknown; request: object }
  | { error: string }
> {
  const request = {
    encoding: "raw",
    format: "decimal",
    bits_per_block: 32,
    number_of_blocks: size,
  };
  const fetched = await fetchOutshift(apiKey, request);
  if (!fetched.ok) {
    return { error: `Outshift: ${fetched.text}` };
  }
  const result = parseOutshiftFloats(fetched.json, size);
  if (!result) {
    return { error: "Outshift: unexpected response shape" };
  }
  return { result, raw: fetched.json, request };
}

export async function tryQrandomInt(
  min: number,
  max: number,
  size: number,
): Promise<{ result: number[]; raw: unknown[] } | null> {
  const batch = await fetchQrandomBatch(
    min,
    max,
    size,
    needsQrandomCorsBridge(),
  );
  if (!batch) return null;
  return { result: batch.result, raw: batch.raw };
}

export function isFailoverEligible(error: string): boolean {
  const e = error.toLowerCase();
  if (
    e.includes("no api key") ||
    (e.includes("invalid") && e.includes("key"))
  ) {
    return false;
  }
  return (
    e.includes("daily limit") ||
    e.includes("exceeds your") ||
    e.includes("usage") ||
    e.includes("quota") ||
    e.includes("rate limit") ||
    e.includes("too many") ||
    e.includes("unreachable") ||
    e.includes("network error") ||
    e.includes("timeout") ||
    e.includes("abort") ||
    e.includes("unexpected response") ||
    e.includes("failed to fetch") ||
    e.includes("cors")
  );
}

export type QrngRunResult =
  | {
      source: QrngProvider;
      result: number[];
      raw?: unknown;
      notice?: string;
    }
  | { error: string };

export async function runRandint(
  provider: QrngProvider,
  outshiftKey: string | null,
  min: number,
  max: number,
  size: number,
): Promise<QrngRunResult> {
  if (provider === "outshift") {
    if (!outshiftKey) {
      const qrandom = await tryQrandomInt(min, max, size);
      if (qrandom) {
        return {
          source: "qrandom",
          result: qrandom.result,
          raw: qrandom.raw,
          notice: DIRECT_NO_KEY_NOTICE,
        };
      }
      return { error: "Outshift selected but no API key, and qrandom.io is unreachable." };
    }
    const outshift = await tryOutshift(outshiftKey, min, max, size);
    if ("error" in outshift) {
      if (isFailoverEligible(outshift.error)) {
        const qrandom = await tryQrandomInt(min, max, size);
        if (qrandom) {
          return {
            source: "qrandom",
            result: qrandom.result,
            raw: qrandom.raw,
            notice: FAILOVER_NOTICE,
          };
        }
      }
      return { error: outshift.error };
    }
    return { source: "outshift", result: outshift.result, raw: outshift.raw };
  }

  const qrandom = await tryQrandomInt(min, max, size);
  if (!qrandom) return { error: "qrandom.io unreachable." };
  return { source: "qrandom", result: qrandom.result, raw: qrandom.raw };
}

export async function runRand(
  provider: QrngProvider,
  outshiftKey: string | null,
  size: number,
): Promise<QrngRunResult> {
  if (provider === "outshift") {
    if (!outshiftKey) {
      const qrandom = await tryQrandomInt(0, 1_000_000_000, size);
      if (qrandom) {
        return {
          source: "qrandom",
          result: qrandom.result.map((n) => n / 1_000_000_000),
          raw: qrandom.raw,
          notice: DIRECT_NO_KEY_NOTICE,
        };
      }
      return { error: "Outshift selected but no API key, and qrandom.io is unreachable." };
    }
    const outshift = await tryOutshiftFloats(outshiftKey, size);
    if ("error" in outshift) {
      if (isFailoverEligible(outshift.error)) {
        const qrandom = await tryQrandomInt(0, 1_000_000_000, size);
        if (qrandom) {
          return {
            source: "qrandom",
            result: qrandom.result.map((n) => n / 1_000_000_000),
            raw: qrandom.raw,
            notice: FAILOVER_NOTICE,
          };
        }
      }
      return { error: outshift.error };
    }
    return { source: "outshift", result: outshift.result, raw: outshift.raw };
  }

  const qrandom = await tryQrandomInt(0, 1_000_000_000, size);
  if (!qrandom) return { error: "qrandom.io unreachable." };
  return {
    source: "qrandom",
    result: qrandom.result.map((n) => n / 1_000_000_000),
    raw: qrandom.raw,
  };
}

export interface QrngTestResult {
  ok: boolean;
  message: string;
  source?: QrngProvider;
  raw?: unknown;
  mapped?: number[];
  request?: unknown;
}

export async function runTest(
  provider: QrngProvider,
  outshiftKey: string | null,
): Promise<QrngTestResult> {
  if (provider === "outshift") {
    if (!outshiftKey) {
      const qrandom = await tryQrandomInt(0, 77, 1);
      if (!qrandom) {
        return {
          ok: false,
          message: "No Outshift API key; qrandom.io unreachable.",
          source: "qrandom",
        };
      }
      return {
        ok: true,
        message: `qrandom.io OK (no Outshift key) — sample ${qrandom.result[0]}`,
        source: "qrandom",
        raw: qrandom.raw,
        mapped: qrandom.result,
      };
    }
    const test = await tryOutshift(outshiftKey, 0, 77, 2, "all");
    if ("error" in test) {
      if (isFailoverEligible(test.error)) {
        const qrandom = await tryQrandomInt(0, 77, 1);
        if (qrandom) {
          return {
            ok: true,
            message: `Failover OK — qrandom.io sample ${qrandom.result[0]}`,
            source: "qrandom",
            raw: qrandom.raw,
            mapped: qrandom.result,
          };
        }
      }
      return { ok: false, message: test.error, source: "outshift" };
    }
    const blocks = (test.raw as { random_numbers?: OutshiftBlock[] }).random_numbers;
    const mapped = blocks?.map((b) => {
      const raw = b.decimal ?? "0";
      return mapDecimalToRange(raw, 0, 1_000_000);
    });
    return {
      ok: true,
      message: `Outshift OK — sample integers ${mapped?.join(", ")}`,
      source: "outshift",
      raw: test.raw,
      request: test.request,
      mapped,
    };
  }

  const qrandom = await tryQrandomInt(0, 77, 1);
  if (!qrandom) {
    return { ok: false, message: "qrandom.io unreachable", source: "qrandom" };
  }
  return {
    ok: true,
    message: `qrandom.io OK — sample ${qrandom.result[0]}`,
    source: "qrandom",
    raw: qrandom.raw,
    mapped: qrandom.result,
  };
}
