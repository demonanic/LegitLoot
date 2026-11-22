// AUTH-03a: account deletion migration, exercised against the full staging-lineage schema
// (bootstrap + every migration) in PGlite. Owner decisions D1–D4 (Complete Loop #3/#4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (n) => readFileSync(new URL(n, root), "utf8");
let PGlite;
try { ({ PGlite } = await import("@electric-sql/pglite")); } catch { PGlite = null; }

const MIGRATION = "supabase/migrations/20261122010000_account_deletion.sql";
const A = "00000000-0000-4000-8000-00000000000a";
const B = "00000000-0000-4000-8000-00000000000b";
const now = () => Math.floor(Date.now() / 1000);

async function freshDb() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth;
    create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
    create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select nullif(auth.jwt()->>'sub', '')::uuid $$;
    grant usage on schema auth to anon, authenticated;`);
  const files = ["supabase/bootstrap/initial_schema.sql",
    ...readdirSync(new URL("supabase/migrations/", root)).sort().map((f) => `supabase/migrations/${f}`)];
  for (const f of files) await db.exec(read(f).replace(/create extension if not exists pgcrypto;/, ""));
  await db.exec(`insert into auth.users(id, email) values ('${A}', 'a@example.test'), ('${B}', 'b@example.test');
    update public.profiles set username = 'player_a', display_name = 'Player A' where id = '${A}';
    insert into public.game_registry(id, slug, title) values ('zz-test', 'zz-test', 'Test game') on conflict do nothing;
    insert into private.game_saves(user_id, game_id, schema_version, save_data) values ('${A}', 'zz-test', 1, '{"lvl":3}');`);
  return db;
}

// Act as a signed-in player. signedInAgo = seconds since the last sign-in (amr timestamp).
async function as(db, user, signedInAgo = 30) {
  const claims = JSON.stringify({ sub: user, role: "authenticated", amr: [{ method: "password", timestamp: now() - signedInAgo }] });
  await db.exec(`reset role; select set_config('request.jwt.claims', '${claims}', false); set role authenticated;`);
}
const asOwner = (db) => db.exec("reset role; select set_config('request.jwt.claims', '', false);");
const one = async (db, sql) => (await db.query(sql)).rows[0];
const reqOf = async (db, user) => one(db, `select * from private.account_deletion_requests where user_id = '${user}' order by requested_at desc limit 1`);
async function dueNow(db, user) { // skip the 7-day wait, as the server clock would
  await db.exec(`update private.account_deletion_requests set requested_at = now() - interval '8 days', scheduled_for = now() - interval '1 day' where user_id = '${user}' and status = 'pending'`);
}

const skip = PGlite ? false : "PGlite unavailable";

test("migration is in the migrations folder and states the owner decisions", () => {
  const sql = read(MIGRATION);
  assert.match(sql, /D1 7-day cancellable wait/);
  assert.match(sql, /interval '7 days'/);
  assert.doesNotMatch(sql, /delete from private\.(journal|ledger|audit)/, "never deletes ledger or audit rows");
  assert.doesNotMatch(sql, /delete from auth\.users/, "never hard-deletes the Auth user");
});

test("request needs a recent sign-in, schedules 7 days out, and is one per player", { skip }, async () => {
  const db = await freshDb();
  await as(db, A, 3600);
  await assert.rejects(db.query("select public.request_account_deletion()"), /reauth_required/);
  await as(db, A);
  const r = (await one(db, "select public.request_account_deletion() r")).r;
  assert.equal(r.status, "pending");
  const days = (Date.parse(r.scheduledFor) - Date.parse(r.requestedAt)) / 86400000;
  assert.ok(Math.abs(days - 7) < 0.001, `7-day wait, got ${days}`);
  const again = (await one(db, "select public.request_account_deletion() r")).r;
  assert.equal(again.scheduledFor, r.scheduledFor, "idempotent: same request");
  await asOwner(db);
  assert.equal((await one(db, `select count(*)::int n from private.account_deletion_requests where user_id='${A}'`)).n, 1);
});

test("players can cancel during the wait; processing early is refused", { skip }, async () => {
  const db = await freshDb();
  await as(db, A);
  await db.query("select public.request_account_deletion()");
  await asOwner(db);
  const req = await reqOf(db, A);
  await assert.rejects(db.query(`select private.process_account_deletion('${req.id}')`), /waiting period/);
  await as(db, A);
  assert.equal((await one(db, "select public.cancel_account_deletion() r")).r.cancelled, true);
  assert.equal((await one(db, "select public.account_deletion_status() r")).r.status, "none");
  await asOwner(db);
  assert.equal((await reqOf(db, A)).status, "cancelled");
});

test("processing clears personal data, keeps ledger and audit rows, and closes the wallet", { skip }, async () => {
  const db = await freshDb();
  await as(db, A);
  await db.query("select public.request_account_deletion()");
  await asOwner(db);
  await dueNow(db, A);
  const before = await one(db, "select (select count(*) from private.journal_entries)::int j, (select count(*) from private.ledger_accounts)::int l");
  const req = await reqOf(db, A);
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "data_cleared");
  const p = await one(db, `select * from public.profiles where id='${A}'`);
  assert.equal(p.username, null); assert.equal(p.display_name, null); assert.ok(p.deleted_at);
  assert.equal((await one(db, `select count(*)::int n from private.game_saves where user_id='${A}'`)).n, 0);
  assert.equal((await one(db, `select count(*)::int n from private.ledger_accounts where owner_user_id='${A}' and closed_at is null`)).n, 0);
  const after = await one(db, "select (select count(*) from private.journal_entries)::int j, (select count(*) from private.ledger_accounts)::int l");
  assert.deepEqual(after, before, "no ledger rows added or removed");
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "data_cleared", "second run is a no-op");
  assert.equal((await one(db, `select private.complete_account_deletion('${req.id}') s`)).s, "completed");
  const actions = (await db.query(`select action from private.audit_log where target_id='${req.id}' order by id`)).rows.map((r) => r.action);
  assert.deepEqual(actions, ["account.deletion_requested", "account.deletion_processed", "account.deletion_completed"]);
  // Other players are untouched.
  assert.equal((await one(db, `select deleted_at from public.profiles where id='${B}'`)).deleted_at, null);
});

test("a deleted player's old session is locked out", { skip }, async () => {
  const db = await freshDb();
  await as(db, A);
  await db.query("select public.request_account_deletion()");
  await asOwner(db); await dueNow(db, A);
  await db.query(`select private.process_account_deletion('${(await reqOf(db, A)).id}')`);
  await as(db, A);
  await assert.rejects(db.query("select public.get_wallet_summary()"), /Account deleted/);
  await assert.rejects(db.query("select public.request_account_deletion()"), /Account deleted/);
  assert.equal((await db.query(`select * from public.profiles where id='${A}'`)).rows.length, 0, "profile hidden");
  await as(db, B);
  assert.ok((await one(db, "select public.get_wallet_summary() w")).w, "other players unaffected");
});

test("no new postings to a closed wallet", { skip }, async () => {
  const db = await freshDb();
  await as(db, A); await db.query("select public.request_account_deletion()");
  await asOwner(db); await dueNow(db, A);
  await db.query(`select private.process_account_deletion('${(await reqOf(db, A)).id}')`);
  const acct = await one(db, `select id from private.ledger_accounts where owner_user_id='${A}' and account_code='lootcoins_available'`);
  await db.exec(`insert into private.journal_transactions(id, idempotency_key, event_type, source_system, description) values ('00000000-0000-4000-8000-0000000000f1', 'test-closed-1', 'test', 'test', 'test')`);
  await assert.rejects(db.exec(`insert into private.journal_entries(transaction_id, account_id, wallet_kind, currency_code, direction, amount) values ('00000000-0000-4000-8000-0000000000f1', '${acct.id}', 'game_credits', 'LC', 'credit', 1)`), /closed/);
});

test("unpaid cash or an open payout request blocks processing and moves nothing (owner decision pending)", { skip }, async () => {
  const db = await freshDb();
  await as(db, A); await db.query("select public.request_account_deletion()");
  await asOwner(db); await dueNow(db, A);
  const cash = await one(db, `select id from private.ledger_accounts where owner_user_id='${A}' and account_code='cash_available'`);
  await db.exec(`insert into private.journal_transactions(id, idempotency_key, event_type, source_system, description) values ('00000000-0000-4000-8000-0000000000f2', 'test-cash-1', 'test', 'test', 'test');
    insert into private.journal_entries(transaction_id, account_id, wallet_kind, currency_code, direction, amount) values ('00000000-0000-4000-8000-0000000000f2', '${cash.id}', 'cash_usd', 'USD', 'credit', 250)`);
  const req = await reqOf(db, A);
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "blocked");
  const r = await reqOf(db, A);
  assert.equal(r.blocked_reason, "cash_balance_owner_decision");
  assert.equal((await one(db, `select username from public.profiles where id='${A}'`)).username, "player_a", "nothing cleared");
  // The player can still cancel a blocked request.
  await as(db, A);
  assert.equal((await one(db, "select public.cancel_account_deletion() r")).r.cancelled, true);
});

test("players cannot call the server-only steps or read the requests table", { skip }, async () => {
  const db = await freshDb();
  await as(db, A); await db.query("select public.request_account_deletion()");
  await asOwner(db); const req = await reqOf(db, A);
  for (const role of ["authenticated", "anon"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(db.query(`select private.process_account_deletion('${req.id}')`), /permission denied/, role);
    await assert.rejects(db.query(`select private.complete_account_deletion('${req.id}')`), /permission denied/, role);
    await assert.rejects(db.query("select * from private.account_deletion_requests"), /permission denied/, role);
    await db.exec("reset role");
  }
  await db.exec("set role anon");
  await assert.rejects(db.query("select public.request_account_deletion()"), /permission denied/);
  await db.exec("reset role");
});

test("account page offers deletion with a typed confirmation, password check and cancel", () => {
  const html = read("account.html");
  const js = read("account-auth.js");
  assert.match(html, /id="deletion-form"/);
  assert.match(html, /7-day waiting period/);
  assert.match(html, /pattern="DELETE"/);
  assert.match(html, /type="password" autocomplete="current-password"/);
  assert.match(html, /id="deletion-cancel"/);
  assert.match(js, /client\.rpc\("request_account_deletion"\)/);
  assert.match(js, /client\.rpc\("cancel_account_deletion"\)/);
  assert.ok(js.indexOf("signInWithPassword({ email, password") < js.indexOf('client.rpc("request_account_deletion")'), "password re-checked before the request");
  assert.doesNotMatch(html.match(/id="deletion-panel"[\s\S]*?<\/section>/)[0], /cash|withdraw/i, "no cash promises in deletion copy");
});
