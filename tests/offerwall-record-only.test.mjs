// HISTORICAL REGRESSION / FORENSIC TEST of the FORMER record-only migration (audit PROV-07 / M2-T3).
// SUPERSEDED: the owner's permanent-retirement decision (docs/security/OFFERWALL_GG_RETIREMENT.md)
// replaces the record-only policy. Offerwall.GG now has NO active callback processing and NO
// callback recording; nothing here describes current behavior or current deployment state.
// The tests are preserved as the historical record of how the former record-only migration behaved.
// Run: npm install && node --test tests/*.test.mjs
// Database test (PGlite = real Postgres 16 in Node) of the former behavior: callbacks were to be
// recorded but never post a Legit Coins journal entry.
// Uses the real table DDL from the staging-lineage migration and the real routines:
// - historical pre-record-only snapshot: private.process_offerwall_gg_postback as exported from staging
//   (supabase/environments/staging/schema-snapshot/routines.sql) — NOT the live runtime
// - former record-only: supabase/migrations/20261119145340_offerwall_gg_record_only.sql
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

let PGlite;
try { ({ PGlite } = await import("@electric-sql/pglite")); } catch { PGlite = null; }
const needsDb = { skip: PGlite ? false : "run `npm install` to enable database tests" };
if (!PGlite) console.warn("offerwall-record-only: @electric-sql/pglite not installed; database tests skipped");

const USER = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";

function between(text, start, end) {
  const i = text.indexOf(start);
  assert.ok(i >= 0, `missing: ${start}`);
  const j = text.indexOf(end, i);
  assert.ok(j > i, `missing end after: ${start}`);
  return text.slice(i, j);
}

// Minimal platform schema plus the real Offerwall.GG tables.
async function newDb() {
  const db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role;
    create schema auth; create table auth.users(id uuid primary key);
    insert into auth.users(id) values ('${USER}'), ('${OTHER}');
    create schema private;
    create table private.ledger_accounts(
      id uuid primary key default gen_random_uuid(), owner_user_id uuid, account_code text,
      wallet_kind text, currency_code text, is_system boolean default false);
    insert into private.ledger_accounts(owner_user_id, account_code, wallet_kind, currency_code, is_system) values
      ('${USER}','lootcoins_available','game_credits','LC',false),
      (null,'platform_lootcoins_issuance','game_credits','LC',true);
    -- Canary: any call to post a journal transaction is captured here.
    create table private.journal_canary(idempotency_key text, entries jsonb);
    create function private.post_journal_transaction(p_key text, p_type text, p_source text, p_ref text,
      p_description text, p_entries jsonb, p_metadata jsonb) returns uuid language plpgsql as $$
    begin insert into private.journal_canary values (p_key, p_entries); return gen_random_uuid(); end $$;
  `);
  const migration = read("supabase/migrations/20261109130000_offerwall_gg_callback_pipeline.sql");
  await db.exec(between(migration, "create table if not exists private.offerwall_gg_conversions", "revoke all on private.offerwall_gg_conversions"));
  return db;
}

// HISTORICAL pre-record-only snapshot (forensic evidence). It is NOT the live staging runtime:
// live staging postback v8 and its routine are record-only, and Offerwall.GG is retired.
const historicalPreRecordOnlyRoutine = () => {
  const snapshot = read("supabase/environments/staging/schema-snapshot/routines.sql");
  return between(snapshot, "CREATE OR REPLACE FUNCTION private.process_offerwall_gg_postback", "-- private.provision_initial_owner_admin");
};
const recordOnlyMigration = () => read("supabase/migrations/20261119145340_offerwall_gg_record_only.sql");

const call = async (db, { user = USER, tx = "txn-00000001", status = "credited", atoms = 50000, digest = "d1" } = {}) =>
  (await db.query(
    "select private.process_offerwall_gg_postback($1::uuid,$2,$3,$4::bigint,'offer','Offer','goal',$5) as r",
    [user, tx, status, atoms, digest])).rows[0].r;
const count = async (db, table) => Number((await db.query(`select count(*)::int as n from ${table}`)).rows[0].n);

test("control: the HISTORICAL pre-record-only snapshot routine posted an LC journal entry (not current staging state)", needsDb, async () => {
  const db = await newDb();
  await db.exec(historicalPreRecordOnlyRoutine());
  assert.equal((await call(db)).result, "posted");
  assert.equal(await count(db, "private.journal_canary"), 1);
});

test("record-only: a verified credit is recorded and posts no LC", needsDb, async () => {
  const db = await newDb();
  await db.exec(historicalPreRecordOnlyRoutine());
  await db.exec(recordOnlyMigration());
  assert.equal((await call(db)).result, "recorded");
  assert.equal(await count(db, "private.journal_canary"), 0);
  const event = (await db.query("select result, amount_atoms::int as amount_atoms from private.offerwall_gg_callback_events")).rows[0];
  assert.deepEqual({ ...event }, { result: "recorded", amount_atoms: 50000 });
  assert.equal((await db.query("select status from private.offerwall_gg_conversions")).rows[0].status, "credited");
});

test("record-only: identical retries are duplicates; conflicting retries are rejected", needsDb, async () => {
  const db = await newDb();
  await db.exec(recordOnlyMigration());
  await call(db);
  assert.equal((await call(db)).result, "duplicate");
  await assert.rejects(call(db, { digest: "different" }), /Conflicting duplicate/);
  await assert.rejects(call(db, { user: OTHER }), /Conflicting duplicate/);
  assert.equal(await count(db, "private.offerwall_gg_callback_events"), 1);
  assert.equal(await count(db, "private.journal_canary"), 0);
});

test("record-only: reversals are matched and recorded, never post LC", needsDb, async () => {
  const db = await newDb();
  await db.exec(recordOnlyMigration());
  await assert.rejects(call(db, { status: "reversed", atoms: -50000 }), /before its original credit/);
  await call(db);
  await assert.rejects(call(db, { status: "reversed", atoms: -40000, digest: "r1" }), /does not match/);
  assert.equal((await call(db, { status: "reversed", atoms: -50000, digest: "r2" })).result, "reversal_recorded");
  assert.equal((await call(db, { status: "reversed", atoms: -50000, digest: "r2" })).result, "duplicate");
  // A reversal that differs from the stored one is rejected, never reported as a duplicate.
  await assert.rejects(call(db, { status: "reversed", atoms: -50000, digest: "r3" }), /Conflicting duplicate/);
  assert.equal((await db.query("select status from private.offerwall_gg_conversions")).rows[0].status, "reversed");
  assert.equal(await count(db, "private.journal_canary"), 0);
});

test("record-only: invalid input is rejected before anything is stored", needsDb, async () => {
  const db = await newDb();
  await db.exec(recordOnlyMigration());
  await assert.rejects(call(db, { status: "paid" }), /Invalid Offerwall.GG callback data/);
  await assert.rejects(call(db, { atoms: 0 }), /Invalid Offerwall.GG callback data/);
  await assert.rejects(call(db, { tx: "short" }), /Invalid Offerwall.GG callback data/);
  await assert.rejects(call(db, { atoms: -5 }), /sign does not match/);
  assert.equal(await count(db, "private.offerwall_gg_callback_events"), 0);
});

test("record-only: the routine can only return the three documented results", () => {
  const sql = recordOnlyMigration().replace(/--.*$/gm, "");
  const results = [...sql.matchAll(/jsonb_build_object\('result',\s*'([a-z_]+)'\)/g)].map((m) => m[1]).sort();
  assert.deepEqual([...new Set(results)], ["duplicate", "recorded", "reversal_recorded"]);
});

test("record-only migration never references the ledger", () => {
  const sql = recordOnlyMigration().replace(/--.*$/gm, "");
  assert.ok(!/post_journal_transaction|ledger_accounts|journal_entries/i.test(sql));
});

// The two Edge Function source assertions that used to follow were retired with the
// functions themselves (owner decision 2026-11-20). See tests/offerwall-retirement.test.mjs.
