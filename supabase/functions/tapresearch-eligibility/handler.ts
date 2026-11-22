// TapResearch Eligibility API — pre-send check (STAGING ONLY, provider state "testing").
//
// Source: https://supply-docs.tapresearch.com/llms-eligibility-api.txt (read 2026-11-22).
// The browser calls this function with the player's Supabase session. The function calls
// TapResearch server-to-server so the API token never reaches the browser, and returns only
// what the Hustle page needs: has-offer, the reason code, the offer URL and the reward range.
//
// Rules from the docs that this file enforces:
//   - user_identifier must be stable and unique: we use the Supabase auth user id (never a
//     device advertising ID — reason code 20 means TapResearch rejected exactly that).
//   - client_ip must be the END USER's IP. Because the browser calls this function directly,
//     the first x-forwarded-for hop is the player. Never call this function from another
//     server, or TapResearch will see that server's IP instead.
//   - Branch on has_offer / offer_reason (integer), never on reason_comment text.
//   - abandon_url is deprecated and is not passed to the browser.
//
// No Legit Coins and no cash are involved here; this only asks whether a survey is available.

export const STAGING_SUPABASE_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";
// Cloudflare truncates the branch alias for build/legitloot-neon-synthwave to 28 characters.
// Source: docs/ENVIRONMENT_SOURCE_OF_TRUTH.md (preview alias build-legitloot-neon-synthwa).
export const STAGING_ORIGIN = "https://build-legitloot-neon-synthwa.legitloot.pages.dev";
export const TAPRESEARCH_OFFER_ENDPOINT = "https://www.tapresearch.com/supply_api/v4/surveys/offer";
const TAPRESEARCH_ORIGIN = "https://www.tapresearch.com";

export interface EligibilityDeps {
  env: (name: string) => string | undefined;
  fetch: typeof fetch;
  /** Resolves a Supabase access token to the auth user id, or null if invalid. */
  getUserId: (accessToken: string) => Promise<string | null>;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": STAGING_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** First public hop in x-forwarded-for (the player), with cf-connecting-ip as a fallback. */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  const candidate = first || headers.get("cf-connecting-ip")?.trim() || "";
  // IPv4 or IPv6 characters only; anything else is not an IP we can forward.
  if (!candidate || candidate.length > 45 || !/^[0-9a-fA-F:.]+$/.test(candidate)) return null;
  return candidate;
}

function safeOfferUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.origin === TAPRESEARCH_ORIGIN ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function handleRequest(request: Request, deps: EligibilityDeps): Promise<Response> {
  // Fail closed even if this handler is accidentally deployed under a production project.
  if (deps.env("SUPABASE_URL") !== STAGING_SUPABASE_URL) {
    return new Response(JSON.stringify({ error: "Staging environment only" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Staging-only function: the production origin is intentionally not allowed (audit ENV-03).
  const origin = request.headers.get("origin");
  if (origin && origin !== STAGING_ORIGIN) return json({ error: "Origin not allowed" }, 403);

  const authHeader = request.headers.get("authorization") ?? "";
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!accessToken) return json({ error: "Authentication required" }, 401);

  const apiToken = deps.env("TAPRESEARCH_API_TOKEN");
  const placementTag = deps.env("TAPRESEARCH_PLACEMENT_TAG"); // optional per the docs
  if (!apiToken) return json({ error: "Survey integration is not configured" }, 503);

  const userId = await deps.getUserId(accessToken);
  if (!userId) return json({ error: "Invalid session" }, 401);

  const clientIp = clientIpFrom(request.headers);
  if (!clientIp) return json({ error: "Could not determine client IP" }, 400);

  const body: Record<string, unknown> = {
    api_token: apiToken,
    user_identifier: userId,
    client_ip: clientIp,
  };
  if (placementTag) body.placement_tag = placementTag;

  let upstream: Response;
  try {
    upstream = await deps.fetch(TAPRESEARCH_OFFER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.error("TapResearch eligibility request failed", (error as Error).name);
    return json({ error: "Survey provider unreachable" }, 503);
  }

  if (upstream.status === 401) {
    // Missing/invalid token, or the app is not the Eligibility API type. Never echo the token.
    console.error("TapResearch rejected the API token (401)");
    return json({ error: "Survey integration is not configured" }, 503);
  }
  if (upstream.status === 422) {
    console.error("TapResearch rejected the request parameters (422)", await upstream.text().catch(() => ""));
    return json({ error: "Survey request rejected" }, 502);
  }
  if (!upstream.ok) {
    console.error("TapResearch eligibility unavailable", upstream.status);
    return json({ error: "Survey provider temporarily unavailable" }, 503);
  }

  let data: Record<string, unknown>;
  try {
    data = await upstream.json();
  } catch {
    return json({ error: "Unexpected survey provider response" }, 502);
  }

  const offerReason = Number.isInteger(data.offer_reason) ? (data.offer_reason as number) : null;
  if (typeof data.has_offer !== "boolean" || offerReason === null) {
    return json({ error: "Unexpected survey provider response" }, 502);
  }

  if (!data.has_offer) {
    return json({ hasOffer: false, offerReason });
  }

  const offerUrl = safeOfferUrl(data.offer_url);
  if (!offerUrl) {
    console.error("TapResearch returned has_offer=true without a valid offer_url");
    return json({ hasOffer: false, offerReason });
  }

  const messageHash = (data.message_hash ?? {}) as Record<string, unknown>;
  const reward = typeof messageHash.currency === "string"
    ? { min: messageHash.min ?? null, max: messageHash.max ?? null, currency: messageHash.currency }
    : null;

  return json({ hasOffer: true, offerReason, offerUrl, reward });
}
