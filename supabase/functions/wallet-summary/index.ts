import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Authentication required" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json({ error: "Wallet service is not configured" }, 503);
  }

  const token = authHeader.slice("Bearer ".length);
  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return json({ error: "Invalid or expired session" }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "private" },
  });

  const { data: accounts, error: accountError } = await admin
    .from("ledger_accounts")
    .select("id, account_code, wallet_kind, currency_code")
    .eq("owner_user_id", authData.user.id)
    .eq("is_system", false)
    .eq("wallet_kind", "game_credits")
    .eq("currency_code", "LC");

  if (accountError || !accounts) return json({ error: "Wallet summary unavailable" }, 503);
  const ids = accounts.map((account) => account.id);
  if (ids.length === 0) return json({ error: "Wallet accounts not initialized" }, 409);

  const { data: entries, error: entryError } = await admin
    .from("journal_entries")
    .select("account_id, direction, amount, wallet_kind, currency_code, journal_transactions!inner(status)")
    .in("account_id", ids)
    .eq("currency_code", "LC")
    .eq("journal_transactions.status", "posted");

  if (entryError || !entries) return json({ error: "Wallet summary unavailable" }, 503);

  const balances = new Map<string, bigint>();
  for (const account of accounts) balances.set(account.id, 0n);
  for (const entry of entries) {
    if (!balances.has(entry.account_id)) continue;
    if (entry.wallet_kind !== accounts.find((a) => a.id === entry.account_id)?.wallet_kind) {
      return json({ error: "Ledger integrity check failed" }, 503);
    }
    const amount = BigInt(entry.amount);
    const delta = entry.direction === "credit" ? amount : -amount;
    balances.set(entry.account_id, (balances.get(entry.account_id) ?? 0n) + delta);
  }

  const balance = (code: string) => {
    const account = accounts.find((a) => a.account_code === code);
    return account ? (balances.get(account.id) ?? 0n).toString() : "0";
  };

  // LC-only contract (WALLET-01, source only, NOT deployed, NOT executed: the posted-status embed
  // must be verified against staging before any deploy; accounts/entries mirror the proposed RPC filters): no cash/USD
  // buckets and no currency label. Cash is PENDING owner reconciliation (issue #2 proposed a separate ledger;
  // Master Control §2 says no cash balance); no cash change until resolved. LC is never cash-convertible.
  return json({
    legitCoins: {
      available: balance("lootcoins_available"),
      provisional: balance("lootcoins_provisional"),
      deferred: balance("lootcoins_deferred"),
      withdrawable: false,
    },
    generatedAt: new Date().toISOString(),
  });
});
