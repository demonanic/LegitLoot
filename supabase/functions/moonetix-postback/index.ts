import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const encoder = new TextEncoder();
const decimalReward = /^(0|[1-9][0-9]*)(?:\.[0-9]{1,3})?$/;
const decimalUsd = /^(0|[1-9][0-9]*)(?:\.[0-9]{1,6})?$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hexToBytes(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]{64}$/i.test(hex)) return null;
  const out = new Uint8Array(32);
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function verifyPostback(
  secret: string,
  tx: string,
  userId: string,
  reward: string,
  status: string,
  givenHash: string,
): Promise<boolean> {
  const signature = hexToBytes(givenHash);
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signatureBuffer = new Uint8Array(signature).buffer;
  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBuffer,
    encoder.encode(tx + ":" + userId + ":" + reward + ":" + status),
  );
}

async function digestPayload(parts: string[]): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(parts.join("|")));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (request: Request) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const tx = url.searchParams.get("tx") ?? "";
  const userId = url.searchParams.get("user") ?? "";
  const eventId = url.searchParams.get("event") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const reward = url.searchParams.get("reward") ?? "";
  const payout = url.searchParams.get("payout") ?? "";
  const currency = url.searchParams.get("currency") ?? "";
  const givenHash = url.searchParams.get("hash") ?? "";

  if (!tx || tx.length > 160 || !uuidPattern.test(userId) || !eventId || eventId.length > 160
    || !["1", "2"].includes(status) || !decimalReward.test(reward)
    || !decimalUsd.test(payout) || currency !== "EL" || !givenHash) {
    return new Response("Invalid postback parameters", { status: 400 });
  }

  const secret = Deno.env.get("MOONETIX_POSTBACK_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!secret || !supabaseUrl || !serviceRoleKey) {
    return new Response("Postback service is not configured", { status: 503 });
  }

  let valid = false;
  try {
    valid = await verifyPostback(secret, tx, userId, reward, status, givenHash);
  } catch {
    return new Response("Signature verification unavailable", { status: 503 });
  }
  if (!valid) return new Response("Invalid signature", { status: 403 });

  const payloadDigest = await digestPayload([
    tx, userId, eventId, status, reward, payout, currency,
  ]);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.rpc("record_moonetix_postback", {
    p_user_id: userId,
    p_transaction_id: tx,
    p_event_id: eventId,
    p_status: Number(status),
    p_currency_code: currency,
    p_reward_raw: reward,
    p_payout_usd_raw: payout,
    p_payload_digest: payloadDigest,
    p_signature_valid: true,
    p_is_test: tx.startsWith("test_"),
  });

  if (error) {
    // Never log the secret, signature, or raw callback URL.
    console.error("Moonetix postback storage failed", { code: error.code ?? "unknown" });
    return new Response("Postback could not be stored", { status: 503 });
  }

  return new Response("OK", { status: 200 });
});
