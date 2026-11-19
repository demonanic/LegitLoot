import { createClient } from "npm:@supabase/supabase-js@2";

const encoder = new TextEncoder();

function equalHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

async function sha256Hex(message: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(message)));
}

// Offerwall.GG sends up to four decimal places. Store exact 1/10,000 LC atoms;
// never use floating-point arithmetic for reward amounts.
function parseLootCoinAtoms(value: string): bigint {
  if (!/^-?\d+(?:\.\d{1,4})?$/.test(value)) throw new Error("Invalid currencyAmount");
  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [whole, fraction = ""] = unsigned.split(".");
  const atoms = BigInt(whole) * 10000n + BigInt((fraction + "0000").slice(0, 4));
  return negative ? -atoms : atoms;
}

function response(body: string, status: number): Response {
  return new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });
}

Deno.serve(async (request: Request) => {
  if (request.method !== "GET" && request.method !== "POST") {
    return response("METHOD NOT ALLOWED", 405);
  }

  const secret = Deno.env.get("OFFERWALL_GG_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret || !supabaseUrl || !serviceRoleKey) return response("SERVICE NOT CONFIGURED", 503);

  const requestUrl = new URL(request.url);
  const params = new URLSearchParams(requestUrl.search);
  let rawBody = "";
  if (request.method === "POST") {
    rawBody = await request.text();
    if (rawBody.length > 16_384) return response("PAYLOAD TOO LARGE", 413);
    const bodyParams = new URLSearchParams(rawBody);
    for (const [key, value] of bodyParams.entries()) params.set(key, value);
  }

  const userId = params.get("userId") ?? "";
  const transactionId = params.get("transactionId") ?? "";
  const currencyAmount = params.get("currencyAmount") ?? "";
  const currencyName = params.get("currencyName") ?? "";
  const payoutUsd = params.get("payoutUsd");
  const timestamp = params.get("timestamp");
  const status = params.get("status") ?? "";
  const signature = (params.get("signature") ?? "").toLowerCase();
  const test = params.get("test") ?? "0";

  // Dashboard test callbacks are acknowledged but can never issue rewards.
  if (test === "1") return response("OK", 200);

  if (!userId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)
      || transactionId.length < 8 || transactionId.length > 64
      || !["credited", "reversed"].includes(status)
      || !currencyAmount || currencyName !== "Loot Coins" || !signature) {
    return response("INVALID CALLBACK", 400);
  }

  let amountAtoms: bigint;
  try {
    amountAtoms = parseLootCoinAtoms(currencyAmount);
  } catch {
    return response("INVALID AMOUNT", 400);
  }
  if (amountAtoms === 0n || (status === "credited" && amountAtoms < 0n)
      || (status === "reversed" && amountAtoms > 0n)
      || amountAtoms > 9000000000000000n || amountAtoms < -9000000000000000n) {
    return response("INVALID AMOUNT", 400);
  }

  let payoutUsdValue: string | null = null;
  if (payoutUsd !== null && payoutUsd !== "") {
    if (!/^-?\d+(?:\.\d{1,6})?$/.test(payoutUsd)) return response("INVALID PAYOUT", 400);
    const payoutNumber = Number(payoutUsd);
    if (!Number.isFinite(payoutNumber) || Math.abs(payoutNumber) > 1000000000
        || (status === "credited" && payoutNumber < 0)
        || (status === "reversed" && payoutNumber > 0)) {
      return response("INVALID PAYOUT", 400);
    }
    payoutUsdValue = payoutUsd;
  }

  let providerTimestamp: string | null = null;
  if (timestamp !== null && timestamp !== "") {
    if (!/^\d{10}$/.test(timestamp)) return response("INVALID TIMESTAMP", 400);
    const parsed = new Date(Number(timestamp) * 1000);
    if (!Number.isFinite(parsed.getTime())) return response("INVALID TIMESTAMP", 400);
    providerTimestamp = parsed.toISOString();
  }

  const signedMessage = `${userId}:${transactionId}:${currencyAmount}`;
  const expected = await hmacSha256Hex(signedMessage, secret);
  if (!equalHex(expected, signature)) return response("FORBIDDEN", 403);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.rpc("process_offerwall_gg_postback", {
    p_user_id: userId,
    p_transaction_id: transactionId,
    p_status: status,
    p_amount_atoms: amountAtoms.toString(),
    p_offer_id: params.get("offerId") ?? "",
    p_offer_name: params.get("offerName") ?? "",
    p_goal_id: params.get("goalId") ?? "",
    // Hash only the signed fields. Unsigned metadata such as timestamp can
    // legitimately differ between retries and must not break idempotency.
    p_payload_digest: await sha256Hex(signedMessage),
  });

  if (error) {
    console.error("Offerwall.GG callback processing failed", error.message);
    return response("RETRY", 500);
  }

  // Record-only (2026-11-19, spec §0.1, audit PROV-07): callbacks are stored for
  // provider reconciliation but never mint Legit Coins. "posted" is no longer an
  // accepted result; if the database still returns it, the record-only migration
  // has not been applied, so fail loudly instead of acknowledging.
  const RECORD_ONLY_RESULTS = ["recorded", "reversal_recorded", "duplicate"];
  if (!data || !RECORD_ONLY_RESULTS.includes(data.result)) {
    console.error("Offerwall.GG callback returned an unexpected result", data?.result);
    return response("RETRY", 500);
  }
  const { error: metadataError } = await supabase.rpc("record_offerwall_gg_metadata", {
    p_user_id: userId,
    p_transaction_id: transactionId,
    p_currency_name: currencyName,
    p_payout_usd: payoutUsdValue,
    p_provider_timestamp: providerTimestamp,
  });
  if (metadataError) {
    console.error("Offerwall.GG metadata recording failed", metadataError.message);
    return response("RETRY", 500);
  }
  return response("OK", 200);
});
