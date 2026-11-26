import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const userIdPattern = /^[A-Za-z0-9._@:+-]{1,100}$/;

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const appId = Deno.env.get("MOONETIX_APP_ID");
  const linkHashSalt = Deno.env.get("MOONETIX_LINK_HASH_SALT");
  if (!supabaseUrl || !anonKey || !appId || !linkHashSalt) {
    return new Response(JSON.stringify({ error: "Offerwall link service is not configured" }), { status: 503, headers: { "content-type": "application/json" } });
  }
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false, autoRefreshToken: false } });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user?.id || !userIdPattern.test(user.id)) return new Response("Unauthorized", { status: 401 });
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(linkHashSalt), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(user.id));
  const hash = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  const wallUrl = "https://wall.moonetix.com/" + encodeURIComponent(appId) + "?user_id=" + encodeURIComponent(user.id) + "&hash=" + hash;
  return new Response(JSON.stringify({ wallUrl }), { status: 200, headers: { "content-type": "application/json" } });
});
