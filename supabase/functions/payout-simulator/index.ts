import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (body: unknown, status=200) => new Response(JSON.stringify(body), {
  status, headers: {...cors,"Content-Type":"application/json","Cache-Control":"no-store"}
});
const fail = (message: string, status=400) => reply({error:message},status);
const validMinor = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number)>0;

Deno.serve(async (req: Request) => {
  if (req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if (req.method!=="POST") return fail("Method not allowed",405);
  const bearer=req.headers.get("Authorization");
  if (!bearer?.startsWith("Bearer ")) return fail("Sign-in required",401);

  const url=Deno.env.get("SUPABASE_URL");
  const anon=Deno.env.get("SUPABASE_ANON_KEY");
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url||!anon||!service) return fail("Server configuration unavailable",503);

  const authClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:auth,error:authError}=await authClient.auth.getUser(bearer.slice(7));
  if (authError||!auth.user) return fail("Invalid session",401);

  let body: Record<string,unknown>;
  try { body=await req.json(); } catch { return fail("Invalid JSON body"); }
  const action=body.action;
  const client=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
  let rpcName: string;
  let args: Record<string,unknown>;

  if (action==="state") {
    rpcName="payout_simulator_state";
    args={p_actor_user_id:auth.user.id};
  } else if (action==="issue_funds") {
    if (!validMinor(body.amountMinor)||body.amountMinor>25000) return fail("Enter an integer-cent amount from $0.01 to $250.00.");
    if (typeof body.reason!=="string"||body.reason.trim().length<5||body.reason.trim().length>300) return fail("A reason between 5 and 300 characters is required.");
    if (typeof body.idempotencyKey!=="string"||body.idempotencyKey.length<8||body.idempotencyKey.length>128) return fail("Invalid idempotency key.");
    rpcName="payout_simulator_issue_funds";
    args={p_actor_user_id:auth.user.id,p_amount_minor:body.amountMinor,p_idempotency_key:body.idempotencyKey,p_reason:body.reason.trim()};
  } else if (action==="create_withdrawal") {
    if (!validMinor(body.amountMinor)) return fail("Withdrawal amount must be positive integer cents.");
    if (body.destinationType!=="paypal"&&body.destinationType!=="venmo") return fail("Choose PayPal or Venmo simulation.");
    if (typeof body.destinationLabel!=="string"||!body.destinationLabel.startsWith("TEST:")) return fail("Only a clearly labeled simulated destination is allowed.");
    if (typeof body.idempotencyKey!=="string"||body.idempotencyKey.length<8||body.idempotencyKey.length>128) return fail("Invalid idempotency key.");
    rpcName="payout_simulator_create_withdrawal";
    args={p_actor_user_id:auth.user.id,p_amount_minor:body.amountMinor,p_destination_type:body.destinationType,p_destination_label:body.destinationLabel,p_idempotency_key:body.idempotencyKey};
  } else if (action==="decide_withdrawal") {
    if (typeof body.withdrawalId!=="string"||!["approve","reject"].includes(String(body.decision))) return fail("Invalid withdrawal decision.");
    if (typeof body.reason!=="string"||body.reason.trim().length<5||body.reason.trim().length>300) return fail("A decision reason between 5 and 300 characters is required.");
    rpcName="payout_simulator_decide_withdrawal";
    args={p_actor_user_id:auth.user.id,p_withdrawal_id:body.withdrawalId,p_decision:body.decision,p_reason:body.reason.trim()};
  } else if (action==="provider_result") {
    if (typeof body.withdrawalId!=="string"||!["pending","success","failure"].includes(String(body.outcome))) return fail("Invalid simulated provider outcome.");
    rpcName="payout_simulator_provider_result";
    args={p_actor_user_id:auth.user.id,p_withdrawal_id:body.withdrawalId,p_outcome:body.outcome};
  } else {
    return fail("Unknown simulator action.");
  }

  const {data,error}=await client.rpc(rpcName,args);
  if (error) {
    if (error.code==="42501") return fail("Owner access required.",403);
    if (error.code==="22023") return fail(error.message,400);
    return fail("Simulator operation failed safely. No live payout was attempted.",503);
  }
  return reply(data);
});
