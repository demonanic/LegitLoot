import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://legitloot.site",
  "https://build-legitloot-neon-synthwave.legitloot.pages.dev",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function json(data: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signWallParams(appId: string, userId: string, secret: string): Promise<string> {
  const canonical = new URLSearchParams([["appId", appId], ["userId", userId]]);
  const sorted = [...canonical.entries()].sort(([a], [b]) => a.localeCompare(b));
  const message = sorted.map(([key, value]) => `${key}=${value}`).join("&");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return json({ error: "Origin not allowed" }, 403, null);
  }
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);

  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json({ error: "Authentication required" }, 401, origin);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const publicKey = Deno.env.get("OFFERWALL_GG_PUBLIC_KEY");
  const secret = Deno.env.get("OFFERWALL_GG_SECRET");
  if (!supabaseUrl || !serviceRoleKey || !publicKey || !secret) {
    return json({ error: "Offerwall integration is not configured" }, 503, origin);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return json({ error: "Invalid session" }, 401, origin);

  const signature = await signWallParams(publicKey, data.user.id, secret);
  const wallUrl = new URL(`https://offerwall.gg/wall/${publicKey}`);
  wallUrl.searchParams.set("userId", data.user.id);
  wallUrl.searchParams.set("signature", signature);

  return json({ wallUrl: wallUrl.toString() }, 200, origin);
});
