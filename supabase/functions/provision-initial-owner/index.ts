import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TARGET_USER_ID = "62a1c70c-e498-4b73-af80-60920bcad5d7";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Sign-in required" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceRoleKey) return json({ error: "Server configuration unavailable" }, 503);

  const token = authorization.slice(7);
  const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth, error: authError } = await authClient.auth.getUser(token);
  if (authError || !auth.user) return json({ error: "Invalid session" }, 401);
  if (auth.user.id !== TARGET_USER_ID) return json({ error: "This account is not authorized for initial owner provisioning" }, 403);

  const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const privateDb = admin.schema("private");
  const { data: owners, error: ownerError } = await privateDb
    .from("admin_users")
    .select("user_id")
    .eq("admin_role", "owner")
    .eq("is_active", true)
    .limit(1);

  if (ownerError) return json({ error: "Could not verify initial owner state" }, 503);
  if (owners && owners.length > 0) return json({ error: "An active owner already exists; bootstrap is closed" }, 409);

  const { error: provisionError } = await privateDb.rpc("provision_initial_owner_admin", {
    p_user_id: auth.user.id,
  });
  if (provisionError) return json({ error: "Owner provisioning failed", detail: provisionError.message }, 500);

  return json({ success: true, role: "owner", message: "Initial staging owner administrator provisioned." });
});
