import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://legitloot.site",
  "https://build-legitloot-neon-synthwa.legitloot.pages.dev",
]);

function response(data: unknown, status = 200, origin = ""): Response {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
  if (allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Headers"] = "authorization, apikey, content-type, x-client-info";
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...(allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
        "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
      },
    });
  }
  if (request.method !== "POST") return response({ error: "Method not allowed" }, 405, origin);
  if (origin && !allowedOrigins.has(origin)) return response({ error: "Origin not allowed" }, 403, origin);

  const authorization = request.headers.get("authorization") ?? "";
  const jwt = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!jwt) return response({ error: "Authentication required" }, 401, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return response({ error: "Attribution service unavailable" }, 503, origin);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await admin.auth.getUser(jwt);
  if (authError || !authData.user) return response({ error: "Invalid session" }, 401, origin);

  let body: Record<string, unknown> = {};
  try {
    const parsed = await request.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = parsed;
  } catch {
    return response({ error: "Invalid JSON" }, 400, origin);
  }

  const offerId = typeof body.offerId === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(body.offerId)
    ? body.offerId
    : null;
  if (body.offerId !== undefined && body.offerId !== null && offerId === null) {
    return response({ error: "Invalid offer reference" }, 400, origin);
  }

  const random = crypto.getRandomValues(new Uint8Array(32));
  const trackingId = base64url(random);
  const tokenHash = await sha256Hex(trackingId);
  const { error: storeError } = await admin.rpc("store_cpagrip_attribution_token", {
    p_token_hash: tokenHash,
    p_user_id: authData.user.id,
    p_offer_id: offerId,
    p_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
  if (storeError) {
    console.error("CPAGrip attribution storage failed", storeError.code ?? "unknown");
    return response({ error: "Could not prepare offer tracking" }, 503, origin);
  }

  return response({ trackingId, expiresInSeconds: 30 * 24 * 60 * 60 }, 201, origin);
});
