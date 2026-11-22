// TapResearch server-to-server rewards postback (STAGING ONLY, record-only).
//
// Source: https://supply-docs.tapresearch.com/llms-eligibility-api.txt (read 2026-11-22).
// TapResearch sends a GET to this URL when a player earns a reward and retries for 48 hours
// until it receives a 2xx. The dashboard "Test rewards postback" button requires HTTP 200.
//
// Signature check, exactly as documented:
//   1. take the full query string (everything after "?")
//   2. remove "&sig=" and the value after it
//   3. percent-decode, keeping literal "+" characters (decodeURIComponent never turns + into space)
//   4. HMAC-MD5 with the app's API Secret, lowercase hex
//   5. constant-time compare with sig
// We sign whatever query string arrives, not a fixed field list ("postbacks may include extra fields").
//
// Two-balance policy (docs/PLATFORM_BUILD_SPEC.md §0.5): a TapResearch reward is a Hustle
// completion and may only ever reach the separate USD cash ledger after it is verified AND
// approved. This function verifies and RECORDS the reward (idempotent on cpid) with review
// status "pending_review". It never posts Legit Coins and never posts to any cash ledger;
// approval and cash posting are a separate owner-gated step.

import { createHmac, timingSafeEqual } from "node:crypto";

export const STAGING_SUPABASE_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";

export interface PostbackDeps {
  env: (name: string) => string | undefined;
  /** Calls public.record_tapresearch_reward. Returns "recorded" | "duplicate" or throws. */
  recordReward: (reward: TapResearchReward) => Promise<string>;
}

export interface TapResearchReward {
  cpid: string;
  uid: string;
  payoutAmount: number;
  payoutCurrency: string | null;
  payoutType: number | null;
  revenueUsd: string | null;
  offerIdentifier: string | null;
  tid: string | null;
  did: string | null;
}

function text(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Splits the raw query into the signed message (sig removed, then percent-decoded) and the sig value. */
export function splitSignature(rawQuery: string): { message: string; sig: string } | null {
  const parts = rawQuery.split("&");
  const sigParts = parts.filter((p) => p.startsWith("sig="));
  if (sigParts.length !== 1) return null;
  const sig = sigParts[0].slice(4).toLowerCase();
  const unsigned = parts.filter((p) => !p.startsWith("sig=")).join("&");
  try {
    return { message: decodeURIComponent(unsigned), sig };
  } catch {
    return null;
  }
}

export function hmacMd5Hex(message: string, secret: string): string {
  return createHmac("md5", secret).update(message, "utf8").digest("hex");
}

export function signatureMatches(message: string, sig: string, secret: string): boolean {
  if (!/^[0-9a-f]{32}$/.test(sig)) return false;
  const expected = Buffer.from(hmacMd5Hex(message, secret), "utf8");
  const received = Buffer.from(sig, "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** Parses query values while keeping literal "+" (URLSearchParams would turn + into a space). */
function parseQuery(rawQuery: string): Map<string, string> {
  const values = new Map<string, string>();
  for (const part of rawQuery.split("&")) {
    if (!part) continue;
    const eq = part.indexOf("=");
    const key = decodeURIComponent(eq < 0 ? part : part.slice(0, eq));
    const value = eq < 0 ? "" : decodeURIComponent(part.slice(eq + 1));
    values.set(key, value);
  }
  return values;
}

const optional = (v: string | undefined, max = 256) => (v && v.length <= max ? v : null);

export async function handleRequest(request: Request, deps: PostbackDeps): Promise<Response> {
  // Fail closed even if this handler is accidentally deployed under a production project.
  if (deps.env("SUPABASE_URL") !== STAGING_SUPABASE_URL) return text("STAGING ENVIRONMENT ONLY", 503);
  if (request.method !== "GET") return text("METHOD NOT ALLOWED", 405);

  const secret = deps.env("TAPRESEARCH_API_SECRET");
  const apiToken = deps.env("TAPRESEARCH_API_TOKEN");
  if (!secret || !apiToken) return text("SERVICE NOT CONFIGURED", 503);

  const url = new URL(request.url);
  const rawQuery = url.search.startsWith("?") ? url.search.slice(1) : url.search;
  if (!rawQuery || rawQuery.length > 8192) return text("INVALID CALLBACK", 400);

  const split = splitSignature(rawQuery);
  if (!split) return text("INVALID CALLBACK", 400);
  if (!signatureMatches(split.message, split.sig, secret)) return text("FORBIDDEN", 403);

  let params: Map<string, string>;
  try {
    params = parseQuery(rawQuery);
  } catch {
    return text("INVALID CALLBACK", 400);
  }

  // The official TapResearch postback specification includes api_token in every sample
  // and lists it as a standard parameter. Require it and compare it after signature check.
  const sentToken = params.get("api_token");
  if (!sentToken || sentToken !== apiToken) return text("FORBIDDEN", 403);

  const cpid = params.get("cpid") ?? "";
  const uid = params.get("uid") ?? "";
  const payoutAmountText = params.get("payout_amount") ?? "";
  if (!cpid || cpid.length > 128 || !uid || uid.length > 128 || !/^\d{1,12}$/.test(payoutAmountText)) {
    return text("INVALID CALLBACK", 400);
  }

  const payoutTypeText = params.get("payout_type");
  const revenueText = params.get("revenue");
  if (payoutTypeText !== undefined && payoutTypeText !== "" && !/^\d{1,4}$/.test(payoutTypeText)) {
    return text("INVALID CALLBACK", 400);
  }
  if (revenueText !== undefined && revenueText !== "" && !/^\d{1,9}(?:\.\d{1,6})?$/.test(revenueText)) {
    return text("INVALID CALLBACK", 400);
  }

  const reward: TapResearchReward = {
    cpid,
    uid,
    payoutAmount: Number(payoutAmountText),
    payoutCurrency: optional(params.get("payout_currency")),
    payoutType: payoutTypeText ? Number(payoutTypeText) : null,
    revenueUsd: revenueText ? revenueText : null,
    offerIdentifier: optional(params.get("offer_identifier")),
    tid: optional(params.get("tid")),
    did: optional(params.get("did")),
  };

  try {
    const result = await deps.recordReward(reward);
    if (result !== "recorded" && result !== "duplicate") {
      console.error("TapResearch reward returned an unexpected result", result);
      return text("RETRY", 500);
    }
  } catch (error) {
    // 5xx makes TapResearch retry for up to 48 hours.
    console.error("TapResearch reward recording failed", (error as Error).message);
    return text("RETRY", 500);
  }
  return text("OK", 200);
}
