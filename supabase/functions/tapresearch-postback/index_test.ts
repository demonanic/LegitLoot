import { createHmac } from "node:crypto";
import { handleRequest, splitSignature, type TapResearchReward } from "./handler.ts";

const SECRET = "test-api-secret";
const TOKEN = "test-api-token";
const env = (name: string) => ({ SUPABASE_URL: "https://scmnxcsggquwtuyyjnnj.supabase.co", TAPRESEARCH_API_SECRET: SECRET, TAPRESEARCH_API_TOKEN: TOKEN } as Record<string, string>)[name];

function sign(unsignedQuery: string): string {
  const message = decodeURIComponent(unsignedQuery);
  return createHmac("md5", SECRET).update(message, "utf8").digest("hex");
}

function signedUrl(unsignedQuery: string): string {
  return `https://example.test/functions/v1/tapresearch-postback?${unsignedQuery}&sig=${sign(unsignedQuery)}`;
}

const BASE = `api_token=${TOKEN}&cpid=cp-123&uid=11111111-1111-4111-8111-111111111111&payout_amount=150&payout_currency=Cash&payout_type=3&revenue=1.25&tid=t-9&offer_identifier=o-1`;

function assertEq(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

function recorder(result = "recorded") {
  const calls: TapResearchReward[] = [];
  return { calls, recordReward: (r: TapResearchReward) => { calls.push(r); return Promise.resolve(result); } };
}

Deno.test("valid signature records the reward and returns 200", async () => {
  const rec = recorder();
  const res = await handleRequest(new Request(signedUrl(BASE)), { env, recordReward: rec.recordReward });
  assertEq(res.status, 200, "status");
  assertEq(await res.text(), "OK", "body");
  assertEq(rec.calls.length, 1, "calls");
  assertEq(rec.calls[0].cpid, "cp-123", "cpid");
  assertEq(rec.calls[0].payoutAmount, 150, "payout");
  assertEq(rec.calls[0].revenueUsd, "1.25", "revenue");
});

Deno.test("duplicate cpid is acknowledged with 200 so TapResearch stops retrying", async () => {
  const rec = recorder("duplicate");
  const res = await handleRequest(new Request(signedUrl(BASE)), { env, recordReward: rec.recordReward });
  assertEq(res.status, 200, "status");
});

Deno.test("tampered payout is rejected with 403 and nothing is recorded", async () => {
  const rec = recorder();
  const good = signedUrl(BASE);
  const res = await handleRequest(new Request(good.replace("payout_amount=150", "payout_amount=9999")), { env, recordReward: rec.recordReward });
  assertEq(res.status, 403, "status");
  assertEq(rec.calls.length, 0, "calls");
});

Deno.test("missing sig is rejected and wrong secret is rejected", async () => {
  const rec = recorder();
  assertEq((await handleRequest(new Request(`https://e.test/x?${BASE}`), { env, recordReward: rec.recordReward })).status, 400, "no sig");
  const otherEnv = (n: string) => (n === "TAPRESEARCH_API_SECRET" ? "other" : env(n));
  assertEq((await handleRequest(new Request(signedUrl(BASE)), { env: otherEnv, recordReward: rec.recordReward })).status, 403, "wrong secret");
  assertEq(rec.calls.length, 0, "calls");
});

Deno.test("signature covers extra unknown fields and literal + is kept", async () => {
  const rec = recorder();
  const query = `${BASE}&extra_field=a%20b&tag=x+y`;
  const res = await handleRequest(new Request(signedUrl(query)), { env, recordReward: rec.recordReward });
  assertEq(res.status, 200, "status");
  const split = splitSignature(`${query}&sig=abc`)!;
  if (!split.message.includes("tag=x+y") || !split.message.includes("extra_field=a b")) {
    throw new Error("percent-decode must keep literal + and decode %20");
  }
});

Deno.test("a signed but foreign or missing api_token is rejected", async () => {
  const rec = recorder();
  const foreign = await handleRequest(new Request(signedUrl(BASE.replace(TOKEN, "someone-else"))), { env, recordReward: rec.recordReward });
  assertEq(foreign.status, 403, "foreign token");
  const withoutToken = BASE.replace(`api_token=${TOKEN}&`, "");
  const missing = await handleRequest(new Request(signedUrl(withoutToken)), { env, recordReward: rec.recordReward });
  assertEq(missing.status, 403, "missing token");
  assertEq(rec.calls.length, 0, "no record");
});

Deno.test("negative payout and revenue are rejected before recording", async () => {
  const rec = recorder();
  const negativePayout = await handleRequest(new Request(signedUrl(BASE.replace("payout_amount=150", "payout_amount=-1"))), { env, recordReward: rec.recordReward });
  assertEq(negativePayout.status, 400, "negative payout");
  const negativeRevenue = await handleRequest(new Request(signedUrl(BASE.replace("revenue=1.25", "revenue=-0.01"))), { env, recordReward: rec.recordReward });
  assertEq(negativeRevenue.status, 400, "negative revenue");
  assertEq(rec.calls.length, 0, "no record");
});

Deno.test("production Supabase project is rejected even with valid callback credentials", async () => {
  const rec = recorder();
  const productionEnv = (name: string) => name === "SUPABASE_URL" ? "https://production-project.supabase.co" : env(name);
  const res = await handleRequest(new Request(signedUrl(BASE)), { env: productionEnv, recordReward: rec.recordReward });
  assertEq(res.status, 503, "wrong Supabase project");
  assertEq(rec.calls.length, 0, "no record");
});

Deno.test("database failure returns 500 so TapResearch retries", async () => {
  const res = await handleRequest(new Request(signedUrl(BASE)), {
    env,
    recordReward: () => Promise.reject(new Error("db down")),
  });
  assertEq(res.status, 500, "status");
});

Deno.test("only GET is accepted and unconfigured secrets return 503", async () => {
  const rec = recorder();
  assertEq((await handleRequest(new Request(signedUrl(BASE), { method: "POST", body: "x" }), { env, recordReward: rec.recordReward })).status, 405, "post");
  assertEq((await handleRequest(new Request(signedUrl(BASE)), { env: () => undefined, recordReward: rec.recordReward })).status, 503, "unconfigured");
});
