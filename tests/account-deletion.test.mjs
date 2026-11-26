// AUTH-03a: account deletion migration, exercised against the full staging-lineage schema
// (bootstrap + every migration) in PGlite. Owner decisions D1–D4 (Complete Loop #3/#4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (n) => readFileSync(new URL(n, root), "utf8");
let PGlite;
try { ({ PGlite } = await import("@electric-sql/pglite")); } catch { PGlite = null; }

const MIGRATION = "supabase/migrations/20261126010000_auth_03_account_deletion.sql";
const EXPORT_MIGRATION = "supabase/migrations/20261126020000_auth_03_account_export.sql";
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
  await db.exec(read("supabase/bootstrap/initial_schema.sql").replace(/create extension if not exists pgcrypto;/, ""));
  // These staging-only prerequisites are created after bootstrap but before the guarded
  // Moonetix staging migrations that require them.
  // Staging-only tables present in the live staging schema but omitted from the base bootstrap.
  await db.exec(`create table private.admin_users (
      user_id uuid primary key references auth.users(id),
      admin_role text not null,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      created_by uuid, deactivated_at timestamptz, deactivated_by uuid
    );
    create table public.game_registry (
      id text primary key, slug text not null unique, title text not null
    );
    create table private.game_saves (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id),
      game_id text not null references public.game_registry(id),
      schema_version integer not null,
      save_data jsonb not null,
      revision bigint not null default 1,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      unique(user_id, game_id)
    );
    create table private.game_handoff_tickets (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id),
      created_at timestamptz not null default now()
    );
    create table private.game_events (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id),
      event_type text not null default 'test',
      created_at timestamptz not null default now()
    );
    create table private.cpagrip_attribution_tokens (
      id uuid primary key default gen_random_uuid(), token_hash text not null unique,
      user_id uuid not null references auth.users(id) on delete restrict,
      offer_id text, status text not null check (status in ('active','revoked','expired')),
      created_at timestamptz not null default now(), expires_at timestamptz, revoked_at timestamptz,
      metadata jsonb not null default '{}'::jsonb
    );
    create table private.payout_simulator_withdrawals (
      id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete restrict,
      amount_minor bigint not null check (amount_minor >= 50),
      currency_code text not null check (currency_code = 'USD'),
      destination_type text not null check (destination_type in ('paypal','venmo')),
      destination_label text not null check (length(trim(destination_label)) between 3 and 80),
      status text not null check (status in ('pending_review','approved','processing','paid','rejected','failed','cancelled')),
      idempotency_key text not null, decision_reason text,
      provider_outcome text check (provider_outcome in ('pending','success','failure')),
      created_at timestamptz not null default now(), decided_at timestamptz, completed_at timestamptz,
      actor_user_id uuid not null references auth.users(id) on delete restrict,
      unique(user_id,idempotency_key)
    );`);

  const migrations = readdirSync(new URL("supabase/migrations/", root)).sort();
  for (const file of migrations) {
    await db.exec(read("supabase/migrations/" + file).replace(/create extension if not exists pgcrypto;/, ""));
  }
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
  assert.match(sql, /delete from private\.cpagrip_attribution_tokens/);
  assert.match(sql, /destination_label = 'REDACTED'/);
});

test("account export is a read-only authenticated RPC with an empty search path", () => {
  const sql = read(EXPORT_MIGRATION);
  assert.match(sql, /create or replace function public\.export_account_data\(\)/i);
  assert.match(sql, /security definer/i);
  assert.match(sql, /set search_path = ''/i);
  assert.match(sql, /grant execute on function public\.export_account_data\(\) to authenticated/i);
  assert.match(sql, /revoke all on function public\.export_account_data\(\) from public, anon, service_role/i);
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /private\.is_account_deleted\(v_user\)/);
  assert.doesNotMatch(sql, /recipient_ciphertext|raw_user_meta_data|idempotency_key/i);
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
  await db.exec(`insert into private.cpagrip_attribution_tokens(token_hash,user_id,status,metadata)
      values ('test-token-hash-a','${A}','active','{"source":"test"}');
    insert into private.payout_simulator_withdrawals(user_id,amount_minor,currency_code,destination_type,destination_label,status,idempotency_key,actor_user_id)
      values ('${A}',500,'USD','paypal','sam.private@example.test','pending_review','deletion-test-a','${A}');`);
  const before = await one(db, "select (select count(*) from private.journal_entries)::int j, (select count(*) from private.ledger_accounts)::int l");
  const req = await reqOf(db, A);
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "data_cleared");
  const p = await one(db, `select * from public.profiles where id='${A}'`);
  assert.equal(p.username, null); assert.equal(p.display_name, null); assert.ok(p.deleted_at);
  assert.equal((await one(db, `select count(*)::int n from private.game_saves where user_id='${A}'`)).n, 0);
  assert.equal((await one(db, `select count(*)::int n from private.cpagrip_attribution_tokens where user_id='${A}'`)).n, 0, "attribution token removed");
  assert.equal((await one(db, `select destination_label from private.payout_simulator_withdrawals where user_id='${A}'`)).destination_label, "REDACTED", "destination label erased while financial history remains");
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
  await assert.rejects(db.query("select public.get_player_wallet_summary()"), /Account deleted/);
  await assert.rejects(db.query("select public.get_wallet_summary()"), /Account deleted/);
  await assert.rejects(db.query("select public.export_account_data()"), /Account deleted/);
  await assert.rejects(db.query("select public.request_account_deletion()"), /Account deleted/);
  assert.equal((await db.query(`select * from public.profiles where id='${A}'`)).rows.length, 0, "profile hidden");
  await as(db, B);
  assert.ok((await one(db, "select public.get_player_wallet_summary() w")).w, "other players unaffected");
});

test("no new postings to a closed wallet", { skip }, async () => {
  const db = await freshDb();
  await as(db, A); await db.query("select public.request_account_deletion()");
  await asOwner(db); await dueNow(db, A);
  await db.query(`select private.process_account_deletion('${(await reqOf(db, A)).id}')`);
  const acct = await one(db, `select id from private.ledger_accounts where owner_user_id='${A}' and account_code='loot_coins_available'`);
  await db.exec(`insert into private.journal_transactions(id, idempotency_key, event_type, source_system, description) values ('00000000-0000-4000-8000-0000000000f1', 'test-closed-1', 'test', 'test', 'test')`);
  await assert.rejects(db.exec(`insert into private.journal_entries(transaction_id, account_id, wallet_kind, currency_code, direction, amount) values ('00000000-0000-4000-8000-0000000000f1', '${acct.id}', 'loot_coins', 'LC', 'credit', 1)`), /closed/);
});

async function postCash(db, user, code, n) {
  const acct = await one(db, `select id from private.ledger_accounts where owner_user_id='${user}' and account_code='${code}'`);
  const tx = `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
  await db.exec(`insert into private.journal_transactions(id, idempotency_key, event_type, source_system, description) values ('${tx}', 'test-cash-${n}', 'test', 'test', 'test');
    insert into private.journal_entries(transaction_id, account_id, wallet_kind, currency_code, direction, amount) values ('${tx}', '${acct.id}', 'cash_usd', 'USD', 'credit', 250)`);
}
async function dueRequest(db, user) {
  await as(db, user); await db.query("select public.request_account_deletion()");
  await asOwner(db); await dueNow(db, user);
  return reqOf(db, user);
}

for (const bucket of ["cash_available", "cash_pending", "cash_withdrawal_reserved", "cash_held"]) {
  test(`unpaid cash in ${bucket} blocks processing and moves nothing (owner decision pending)`, { skip }, async () => {
    const db = await freshDb();
    const req = await dueRequest(db, A);
    await postCash(db, A, bucket, 900);
    assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "blocked");
    assert.equal((await reqOf(db, A)).blocked_reason, "cash_balance_owner_decision");
    assert.equal((await one(db, `select username from public.profiles where id='${A}'`)).username, "player_a", "nothing cleared");
    await as(db, A);
    const st = (await one(db, "select public.account_deletion_status() r")).r;
    assert.equal(st.status, "blocked");
    assert.equal(st.blockedReason, "cash_balance_owner_decision");
    assert.equal((await one(db, "select public.cancel_account_deletion() r")).r.cancelled, true, "blocked request can be cancelled");
  });
}

test("cash already paid out does not block deletion", { skip }, async () => {
  const db = await freshDb();
  const req = await dueRequest(db, A);
  await postCash(db, A, "cash_paid", 901);
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "data_cleared");
});

test("an open payout request blocks processing", { skip }, async () => {
  const db = await freshDb();
  const req = await dueRequest(db, A);
  await db.exec(`insert into private.payout_requests(user_id, amount_minor, idempotency_key) values ('${A}', 500, 'payout-test-1')`);
  assert.equal((await one(db, `select private.process_account_deletion('${req.id}') s`)).s, "blocked");
  assert.equal((await reqOf(db, A)).blocked_reason, "open_payout_request");
});

test("player wallet RPC preserves the Earned Loot and LootCoins contract", { skip }, async () => {
  const db = await freshDb();
  await as(db, B);
  const w = (await one(db, "select public.get_player_wallet_summary() w")).w;
  assert.equal(w.contractVersion, 1);
  assert.equal(w.earnedLoot.code, "EL");
  assert.equal(w.earnedLoot.availableUnits, "0");
  assert.equal(w.earnedLoot.pendingUnits, "0");
  assert.equal(w.lootCoins.code, "LC");
  assert.equal(w.lootCoins.availableAtoms, "0");
  assert.equal(w.lootCoins.cashValue, null);
  assert.equal(w.lootCoins.withdrawable, false);
  assert.equal(w.lootCoins.transferable, false);
  assert.equal(w.pendingAvailable, false);
  assert.equal(w.pendingConvertible, false);
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

test("account export returns only the authenticated player's profile, wallets and records", { skip }, async () => {
  const db = await freshDb();
  await db.exec(`insert into private.game_saves(user_id,game_id,schema_version,save_data)
    values ('${B}','zz-test',1,'{"lvl":9}');`);

  await as(db, A);
  const exportA = (await one(db, "select public.export_account_data() data")).data;
  assert.equal(exportA.exportVersion, 1);
  assert.equal(exportA.account.email, "a@example.test");
  assert.equal(exportA.account.username, "player_a");
  assert.equal(exportA.walletSummary.earnedLoot.unitsLabel.length > 0, true);
  assert.equal(exportA.walletSummary.lootCoins.cashValue, null);
  assert.equal(exportA.walletSummary.lootCoins.withdrawable, false);
  assert.equal(exportA.walletSummary.lootCoins.transferable, false);
  assert.ok(Array.isArray(exportA.ledgerAccounts));
  assert.ok(Array.isArray(exportA.ledgerHistory));
  assert.ok(Array.isArray(exportA.earnedLootLots));
  assert.ok(Array.isArray(exportA.earnedLootMovements));
  assert.ok(Array.isArray(exportA.providerRewardEvents));
  assert.ok(Array.isArray(exportA.lootCoinPurchases));
  assert.ok(Array.isArray(exportA.payoutRequests));
  assert.equal(exportA.gameSaves.length, 1);
  assert.equal(exportA.gameSaves[0].gameId, "zz-test");
  assert.equal(exportA.gameSaves[0].saveData.lvl, 3);
  assert.equal(Object.hasOwn(exportA, "userId"), false);
  assert.equal(Object.hasOwn(exportA, "rawUserMetaData"), false);

  await as(db, B);
  const exportB = (await one(db, "select public.export_account_data() data")).data;
  assert.equal(exportB.account.email, "b@example.test");
  assert.equal(exportB.gameSaves.length, 1);
  assert.equal(exportB.gameSaves[0].saveData.lvl, 9);
  assert.notEqual(exportB.account.email, exportA.account.email);

  await asOwner(db);
  await db.exec("set role anon");
  await assert.rejects(db.query("select public.export_account_data()"), /permission denied/);
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
  for (const state of ["pending", "blocked", "data_cleared"]) assert.match(js, new RegExp(`"${state}"`), state);
  assert.ok(js.indexOf("signInWithPassword({ email, password") < js.indexOf('client.rpc("request_account_deletion")'), "password re-checked before the request");
  assert.match(js, /client\.auth\.signOut\(\{ scope: "global" \}\)/, "request revokes refresh sessions on all devices");
  assert.match(html.match(/id="deletion-panel"[\s\S]*?<\/section>/)[0], /unpaid cash balance or open payout request/i);
});

test("account page exposes the account export action and JSON download", () => {
  const html = read("account.html");
  const js = read("account-auth.js");
  assert.match(html, /id="data-export-panel"/);
  assert.match(html, /id="export-data"/);
  assert.match(js, /client\.rpc\("export_account_data"\)/);
  assert.match(js, /application\/json|type: "application\/json"/);
  assert.match(js, /legitloot-account-export-/);
});

test("account registration is closed on the staging account page", () => {
  const html = read("account.html");
  const js = read("account-auth.js");
  assert.doesNotMatch(html, /id="signup-form"|data-auth-tab="signup"/);
  assert.match(html, /NEW ACCOUNT REGISTRATION IS CLOSED/);
  assert.doesNotMatch(js, /auth\.signUp/);
  assert.match(js, /STAGING_PROJECT_URL/);
  assert.match(js, /STAGING_PREVIEW_HOSTS/);
});

test("service-role public wrappers process a due deletion request", { skip }, async () => {
  const db = await freshDb();
  const req = await dueRequest(db, A);
  await db.exec("set role service_role");
  const rows = (await db.query("select * from public.claim_due_account_deletion_batch()")).rows;
  assert.ok(rows.some((row) => row.id === req.id));
  assert.equal((await one(db, "select public.process_account_deletion_job('" + req.id + "') s")).s, "data_cleared");
  assert.equal((await one(db, "select public.complete_account_deletion_job('" + req.id + "') s")).s, "completed");
  await db.exec("reset role");
});
test("account page shows distinct pending, blocked and data-cleared states", async () => {
  const vm = await import("node:vm");
  const els = {};
  const el = (id) => (els[id] ??= { id, hidden: false, textContent: "", dataset: {}, innerHTML: "", classList: { toggle() {} },
    addEventListener() {}, querySelector: () => ({ disabled: false }), reset() {}, append() {}, value: "" });
  const document = { getElementById: el, querySelectorAll: () => [], createElement: () => el("tmp") };
  const client = { rpc: async () => ({ data: null }), from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({}) }) }) }),
    auth: { onAuthStateChange() {}, getSession: () => new Promise(() => {}), getUser: async () => ({ data: {} }) } };
  const window = { LEGITLOOT_SUPABASE_CONFIG: { environment: "staging", url: "https://scmnxcsggquwtuyyjnnj.supabase.co", publishableKey: "k" },
    supabase: { createClient: () => client }, setTimeout, clearTimeout, location: { origin: "https://x", hostname: "staging-auth-03-earnedloot-i.legitloot-preview.pages.dev" } };
  // Expose showDeletion for the test by appending a hook inside the IIFE.
  const src = read("account-auth.js").replace(/\}\)\(\);\s*$/, "window.__showDeletion = showDeletion;\n})();");
  vm.runInNewContext(src, { window, document, console });
  const show = window.__showDeletion;
  const text = () => els["deletion-scheduled-text"].textContent;

  show({ status: "pending", scheduledFor: "2026-11-29T00:00:00Z" });
  assert.match(text(), /scheduled for deletion on/);
  assert.equal(els["deletion-cancel"].hidden, false);

  show({ status: "blocked", scheduledFor: "2026-11-29T00:00:00Z", blockedReason: "cash_balance_owner_decision" });
  assert.match(text(), /on hold because your account still holds an unpaid cash balance/);
  assert.doesNotMatch(text(), /scheduled for deletion on/, "blocked is not shown as scheduled");
  assert.doesNotMatch(text(), /contact|support|@/i, "no unverified support route offered");
  assert.equal(els["deletion-cancel"].hidden, false);

  show({ status: "data_cleared" });
  assert.match(text(), /personal data has been cleared/);
  assert.equal(els["deletion-cancel"].hidden, true, "cannot cancel after data is cleared");
  assert.equal(els["deletion-request"].hidden, true, "request form stays hidden");

  show({ status: "none" });
  assert.equal(els["deletion-request"].hidden, false);
});
