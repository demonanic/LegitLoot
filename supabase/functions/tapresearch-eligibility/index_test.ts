import { clientIpFrom, handleRequest, STAGING_ORIGIN, TAPRESEARCH_OFFER_ENDPOINT } from "./handler.ts";

const USER = "11111111-1111-4111-8111-111111111111";
const baseEnv = (name: string): string | undefined => ({ SUPABASE_URL: "https://scmnxcsggquwtuyyjnnj.supabase.co", TAPRESEARCH_API_TOKEN: "API_TOKEN", TAPRESEARCH_PLACEMENT_TAG: "PLACEMENT_TAG" } as Record<string, string>)[name];

function assertEq(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

function req(headers: Record<string, string> = {}, method = "POST") {
  return new Request("https://example.test/functions/v1/tapresearch-eligibility", {
    method,
    headers: { origin: STAGING_ORIGIN, authorization: "Bearer session", "x-forwarded-for": "203.0.113.7, 10.0.0.1", ...headers },
  });
}

function fakeFetch(status: number, body: unknown) {
  const sent: { url: string; body: Record<string, unknown> }[] = [];
  const fn = ((url: string, init: RequestInit) => {
    sent.push({ url, body: JSON.parse(init.body as string) });
    return Promise.resolve(new Response(JSON.stringify(body), { status }));
  }) as unknown as typeof fetch;
  return { sent, fn };
}

const deps = (fetchFn: typeof fetch, env = baseEnv) => ({ env, fetch: fetchFn, getUserId: (t: string) => Promise.resolve(t === "session" ? USER : null) });

Deno.test("sends user id, end-user IP and placement tag; returns offer details without the token", async () => {
  const f = fakeFetch(200, {
    has_offer: true, offer_reason: 0, reason_comment: "ok",
    offer_url: "https://www.tapresearch.com/router/offers/abc", abandon_url: "https://www.tapresearch.com/x",
    message_hash: { min: 50, max: 300, currency: "Cash" },
  });
  const res = await handleRequest(req(), deps(f.fn));
  assertEq(res.status, 200, "status");
  assertEq(f.sent[0].url, TAPRESEARCH_OFFER_ENDPOINT, "endpoint");
  assertEq(f.sent[0].body.user_identifier, USER, "user_identifier");
  assertEq(f.sent[0].body.client_ip, "203.0.113.7", "client_ip");
  assertEq(f.sent[0].body.placement_tag, "PLACEMENT_TAG", "placement_tag");
  const text = await res.text();
  if (text.includes("API_TOKEN")) throw new Error("token leaked to browser");
  if (text.includes("abandon")) throw new Error("deprecated abandon_url passed through");
  const body = JSON.parse(text);
  assertEq(body.hasOffer, true, "hasOffer");
  assertEq(body.reward.max, 300, "reward max");
});

Deno.test("has_offer false returns the integer reason code only", async () => {
  const f = fakeFetch(200, { has_offer: false, offer_reason: 2, reason_comment: "test mode" });
  const body = await (await handleRequest(req(), deps(f.fn))).json();
  assertEq(body.hasOffer, false, "hasOffer");
  assertEq(body.offerReason, 2, "offerReason");
  assertEq(body.offerUrl, undefined, "no url");
});

Deno.test("offer_url on another origin is never passed to the browser", async () => {
  const f = fakeFetch(200, { has_offer: true, offer_reason: 0, offer_url: "https://evil.example/x" });
  const body = await (await handleRequest(req(), deps(f.fn))).json();
  assertEq(body.hasOffer, false, "hasOffer");
});

Deno.test("TapResearch 401/422/503 map to safe errors", async () => {
  assertEq((await handleRequest(req(), deps(fakeFetch(401, {}).fn))).status, 503, "401");
  assertEq((await handleRequest(req(), deps(fakeFetch(422, { error: "bad" }).fn))).status, 502, "422");
  assertEq((await handleRequest(req(), deps(fakeFetch(503, {}).fn))).status, 503, "503");
});

Deno.test("auth, origin, method and configuration guards", async () => {
  const f = fakeFetch(200, { has_offer: false, offer_reason: 1 });
  assertEq((await handleRequest(req({ authorization: "" }), deps(f.fn))).status, 401, "no auth");
  assertEq((await handleRequest(req({ authorization: "Bearer bad" }), deps(f.fn))).status, 401, "bad session");
  assertEq((await handleRequest(req({ origin: "https://legitloot.site" }), deps(f.fn))).status, 403, "prod origin");
  assertEq((await handleRequest(req({}, "GET"), deps(f.fn))).status, 405, "GET");
  assertEq((await handleRequest(req(), deps(f.fn, () => undefined))).status, 503, "unconfigured");
  const productionEnv = (name: string) => name === "SUPABASE_URL" ? "https://production-project.supabase.co" : baseEnv(name);
  assertEq((await handleRequest(req(), deps(f.fn, productionEnv))).status, 503, "wrong Supabase project");
  assertEq(f.sent.length, 0, "no upstream calls for rejected requests");
});

Deno.test("documented preview origin is accepted; unauthorized origins get 403 without an upstream call", async () => {
  // docs/ENVIRONMENT_SOURCE_OF_TRUTH.md: Cloudflare's truncated preview alias.
  const PREVIEW = "https://build-legitloot-neon-synthwa.legitloot.pages.dev";
  assertEq(STAGING_ORIGIN, PREVIEW, "STAGING_ORIGIN");
  const ok = fakeFetch(200, { has_offer: false, offer_reason: 2 });
  const accepted = await handleRequest(req({ origin: PREVIEW }), deps(ok.fn));
  assertEq(accepted.status, 200, "preview origin");
  assertEq(accepted.headers.get("access-control-allow-origin"), PREVIEW, "CORS allow-origin");
  assertEq(ok.sent.length, 1, "upstream called for the preview origin");
  const blocked = fakeFetch(200, { has_offer: false, offer_reason: 2 });
  for (const origin of [
    "https://build-legitloot-neon-synthwave.legitloot.pages.dev",
    "https://legitloot.site",
    "https://evil.example",
  ]) {
    const res = await handleRequest(req({ origin }), deps(blocked.fn));
    assertEq(res.status, 403, `origin ${origin}`);
  }
  assertEq(blocked.sent.length, 0, "no upstream calls for unauthorized origins");
});

Deno.test("client IP parsing", () => {
  assertEq(clientIpFrom(new Headers({ "x-forwarded-for": "2001:db8::1, 10.0.0.1" })), "2001:db8::1", "ipv6");
  assertEq(clientIpFrom(new Headers({ "cf-connecting-ip": "198.51.100.2" })), "198.51.100.2", "cf");
  assertEq(clientIpFrom(new Headers({ "x-forwarded-for": "<script>" })), null, "junk");
});
