import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
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

  const userClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: auth, error: authError } = await userClient.auth.getUser(authorization.slice(7));
  if (authError || !auth.user) return json({ error: "Invalid session" }, 401);

  const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const db = admin.schema("private");
  const { data: adminRecord, error: roleError } = await db.from("admin_users")
    .select("admin_role,is_active").eq("user_id", auth.user.id).maybeSingle();
  if (roleError) return json({ error: "Could not verify administrator access" }, 503);
  if (!adminRecord?.is_active) return json({ error: "Administrator access required" }, 403);

  let payload: { section?: string } = {};
  try { payload = await req.json(); } catch { return json({ error: "Invalid request body" }, 400); }
  const section = payload.section || "overview";
  const role = adminRecord.admin_role;
  const canReviewPayouts = role === "owner" || role === "payout_reviewer";
  const canViewAudit = role === "owner";

  const { count: userCount, error: userCountError } = await admin.from("profiles")
    .select("id", { count: "exact", head: true });
  if (userCountError) return json({ error: "Could not load account totals" }, 503);

  const response: Record<string, unknown> = {
    success: true,
    role,
    signedInEmail: auth.user.email ?? null,
    generatedAt: new Date().toISOString(),
    overview: { registeredProfiles: userCount ?? 0 },
    capabilities: { canReviewPayouts, canViewAudit, canManageAdmins: role === "owner" },
  };

  if (section === "payouts") {
    if (!canReviewPayouts) return json({ error: "Payout review permission required" }, 403);
    const { data: requests, error } = await db.from("payout_requests")
      .select("id,user_id,amount_minor,currency_code,status,destination_type,recipient_hint,requested_at,review_reason,decision_reason")
      .order("requested_at", { ascending: false }).limit(50);
    if (error) return json({ error: "Could not load withdrawal queue" }, 503);
    const rows = requests ?? [];
    const userIds = [...new Set(rows.map((row: any) => row.user_id))];
    const emails = new Map<string, string | null>();
    for (const userId of userIds) {
      const { data } = await admin.auth.admin.getUserById(userId);
      emails.set(userId, data?.user?.email ?? null);
    }
    response.payouts = rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      email: emails.get(row.user_id) ?? null,
      amountMinor: row.amount_minor,
      currency: row.currency_code,
      status: row.status,
      destinationType: row.destination_type,
      recipientHint: row.recipient_hint,
      requestedAt: row.requested_at,
      reviewReason: row.review_reason,
      decisionReason: row.decision_reason,
    }));
    response.payoutCount = rows.length;
  } else if (section === "audit") {
    if (!canViewAudit) return json({ error: "Owner permission required" }, 403);
    const { data: events, error } = await db.from("audit_log")
      .select("id,actor_user_id,actor_type,action,target_type,target_id,reason,created_at")
      .order("created_at", { ascending: false }).limit(50);
    if (error) return json({ error: "Could not load audit history" }, 503);
    response.audit = events ?? [];
  } else if (section !== "overview") {
    return json({ error: "Unknown dashboard section" }, 400);
  }

  return json(response);
});
