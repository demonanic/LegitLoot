// Entrypoint only. The pure handler lives in handler.ts so tests import it without side effects.
// Deploy with --no-verify-jwt: TapResearch calls this URL directly and has no Supabase session.
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { handleRequest, STAGING_SUPABASE_URL } from "./handler.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
if (supabaseUrl !== STAGING_SUPABASE_URL) {
  throw new Error("tapresearch-postback is restricted to the LegitLoot staging Supabase project");
}
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve((request) =>
  handleRequest(request, {
    env: (name) => Deno.env.get(name),
    recordReward: async (reward) => {
      const { data, error } = await supabase.rpc("record_tapresearch_reward", {
        p_cpid: reward.cpid,
        p_uid: reward.uid,
        p_payout_amount: reward.payoutAmount,
        p_payout_currency: reward.payoutCurrency,
        p_payout_type: reward.payoutType,
        p_revenue_usd: reward.revenueUsd,
        p_offer_identifier: reward.offerIdentifier,
        p_tid: reward.tid,
        p_did: reward.did,
      });
      if (error) throw new Error(error.message);
      return (data as { result?: string } | null)?.result ?? "";
    },
  })
);
