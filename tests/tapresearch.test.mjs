// Run: npm install && node --test tests/*.test.mjs
// TapResearch Eligibility API integration (staging, record-only).
// - Database test (PGlite = real Postgres) of supabase/migrations/20261122020000_tapresearch_reward_record_only.sql
// - Policy checks: no Legit Coins or cash posting, no provider secrets in browser code,
//   staging-only origin, provider stays non-openable until owner-approved activation.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");
const MIGRATION = "supabase/migrations/20261122020000_tapresearch_reward_record_only.sql";

let PGlite;
try { ({ PGlite } = await import("@electric-sql/pglite")); } catch { PGlite = null; }
const needsDb = { skip: PGlite ? false : "run `npm install` to enable database tests" };

const USER = "11111111-1111-4111-8111-111111111111";

async function newDb() {
  const db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth; create schema private;
    create table auth.users (id uuid primary key);
    insert into auth.users(id) values ('${USER}');
  `);
  await db.exec(read(MIGRATION));
  return db;
}

const call = (db, cpid, uid, amount, overrides = {}) => {
  const { uid: providerUid = uid, currency = "Cash", type = 3, revenue = 1.25, offer = "o-1", tid = "t-1", did = null } = overrides;
  return db.query(
    "select public.record_tapresearch_reward($1,$2,$3,$4,$5,$6,$7,$8,$9) as r",
    [cpid, providerUid, amount, currency, type, revenue, offer, tid, did],
  ).then((res) => res.rows[0].r.result);
};

test("first reward is recorded against the LegitLoot user, pending review", needsDb, async () => {
  const db = await newDb();
  assert.equal(await call(db, "cp-1", USER, 150), "recorded");
  const { rows } = await db.query("select user_id, review_status, payout_amount from private.tapresearch_rewards");
  assert.deepEqual(rows, [{ user_id: USER, review_status: "pending_review", payout_amount: 150 }]);
});

test("identical retry of the same cpid is a duplicate and adds no row", needsDb, async () => {
  const db = await newDb();
  await call(db, "cp-1", USER, 150);
  assert.equal(await call(db, "cp-1", USER, 150), "duplicate");
  const { rows } = await db.query("select count(*)::int as n from private.tapresearch_rewards");
  assert.equal(rows[0].n, 1);
});

test("a reused cpid with any changed stored event field is rejected", needsDb, async () => {
  const variants = [
    { uid: "different-provider-user" },
    { currency: "Credits" },
    { type: 0 },
    { revenue: 1.26 },
    { offer: "different-offer" },
    { tid: "different-click" },
    { did: "different-device" },
  ];
  for (const variant of variants) {
    const db = await newDb();
    await call(db, "cp-1", USER, 150);
    await assert.rejects(call(db, "cp-1", USER, 150, variant), /Conflicting duplicate/);
    await db.close();
  }
  const db = await newDb();
  await call(db, "cp-1", USER, 150);
  await assert.rejects(call(db, "cp-1", USER, 9999), /Conflicting duplicate/);
});

test("negative payout and revenue are rejected by the database recorder", needsDb, async () => {
  const db = await newDb();
  await assert.rejects(call(db, "cp-negative-payout", USER, -1), /Invalid TapResearch reward data|check constraint/i);
  await assert.rejects(call(db, "cp-negative-revenue", USER, 1, { revenue: -0.01 }), /Invalid TapResearch reward data|check constraint/i);
});

test("a dashboard/test uid that is not a LegitLoot account is recorded unmatched", needsDb, async () => {
  const db = await newDb();
  assert.equal(await call(db, "cp-test", "tapresearch-test-user", 10), "recorded");
  const { rows } = await db.query("select user_id, provider_uid from private.tapresearch_rewards");
  assert.deepEqual(rows, [{ user_id: null, provider_uid: "tapresearch-test-user" }]);
});

test("anon and authenticated cannot call the recorder or read the table", needsDb, async () => {
  const db = await newDb();
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(call(db, "cp-x", USER, 1), /permission denied/);
    await assert.rejects(db.query("select * from private.tapresearch_rewards"), /permission denied/);
    await db.exec("reset role");
  }
});

test("migration never posts to any ledger (no LC, no cash)", () => {
  const sql = read(MIGRATION).split("\n").filter((l) => !l.trim().startsWith("--")).join("\n");
  assert.doesNotMatch(sql, /post_journal_transaction|journal|ledger_account|cash_available|cash_pending/i);
});

test("provider secrets never appear in browser code", () => {
  for (const file of ["earn-providers.js", "earn-hub.js", "app.js", "portal.js"]) {
    const src = read(file);
    assert.doesNotMatch(src, /TAPRESEARCH_API_(TOKEN|SECRET)|api_token|supply_api/i, `${file} must not hold TapResearch credentials`);
  }
});

test("TapResearch is listed but cannot be opened until owner-approved activation", async () => {
  globalThis.window = {};
  await import(new URL("earn-providers.js", root));
  const { providers, states } = globalThis.window.LEGITLOOT_EARN_REGISTRY;
  const tr = providers.find((p) => p.id === "tapresearch");
  assert.ok(tr, "tapresearch entry exists");
  assert.equal(states[tr.state].canOpen, false);
  assert.equal(tr.launch, null);
  assert.match(tr.stateDetail, /built; local handler tests pass/i);
  assert.doesNotMatch(tr.stateDetail, /being tested on our staging system with TapResearch test devices/i);
});

test("Edge Functions are staging-only and the postback requires the documented token", () => {
  const stageUrl = "https://scmnxcsggquwtuyyjnnj.supabase.co";
  const elig = read("supabase/functions/tapresearch-eligibility/handler.ts");
  const eligEntry = read("supabase/functions/tapresearch-eligibility/index.ts");
  assert.ok(elig.includes(`export const STAGING_SUPABASE_URL = "${stageUrl}";`));
  assert.ok(elig.includes('export const STAGING_ORIGIN = "https://build-legitloot-neon-synthwa.legitloot.pages.dev";'));
  assert.ok(!elig.includes("neon-synthwave.legitloot.pages.dev"), "untruncated alias is not the deployed preview origin");
  assert.ok(elig.includes('deps.env("SUPABASE_URL") !== STAGING_SUPABASE_URL'));
  assert.ok(eligEntry.includes("supabaseUrl !== STAGING_SUPABASE_URL"));
  const post = read("supabase/functions/tapresearch-postback/handler.ts");
  const postEntry = read("supabase/functions/tapresearch-postback/index.ts");
  assert.ok(post.includes(`export const STAGING_SUPABASE_URL = "${stageUrl}";`));
  assert.ok(post.includes('deps.env("SUPABASE_URL") !== STAGING_SUPABASE_URL'));
  assert.ok(postEntry.includes("supabaseUrl !== STAGING_SUPABASE_URL"));
  assert.ok(post.includes("if (!sentToken || sentToken !== apiToken)"));
  assert.ok(post.includes("!/^\\d{1,12}$/.test(payoutAmountText)"));
  assert.ok(post.includes("!/^\\d{1,9}(?:\\.\\d{1,6})?$/.test(revenueText)"));
  assert.match(post, /createHmac\("md5"/);
  assert.match(post, /timingSafeEqual/);
  assert.doesNotMatch(post, /journal|legit.?coin.*insert/i);
});
