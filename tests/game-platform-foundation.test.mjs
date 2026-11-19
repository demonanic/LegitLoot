// MIG-02: the restored canonical source of staging migration 20261118080655 must
// (a) be byte-identical to the recovered evidence statement, and
// (b) create the documented schema, RLS, policy and grants when run on real Postgres (PGlite).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (n) => readFileSync(new URL(n, root), "utf8");
let PGlite;
try { ({ PGlite } = await import("@electric-sql/pglite")); } catch { PGlite = null; }
const needsDb = { skip: PGlite ? false : "run `npm install` to enable database tests" };

const FILE = "supabase/migrations/20261118080655_game_platform_foundation.sql";
const migration = () => read(FILE);
const USER = "11111111-1111-4111-8111-111111111111";

test("migration body is byte-identical to the recovered staging statement", () => {
  const evidence = read("docs/evidence/MIG-02_game_platform_foundation_recovery.md");
  const statement = evidence.match(/```sql\n([\s\S]*?)\n```/)[1];
  const file = migration();
  assert.ok(file.includes(statement), "migration must contain the recovered statement verbatim");
  assert.equal(file.slice(file.indexOf(statement) + statement.length).trim(), "", "nothing may follow the recovered statement");
});

test("migration never touches ledger, money or update triggers", () => {
  const sql = migration().replace(/^--.*$/gm, "").toLowerCase();
  assert.ok(!/journal|ledger|post_journal|create trigger|drop table|truncate /.test(sql));
});

async function freshDb() {
  const db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    insert into auth.users(id) values ('${USER}');`);
  await db.exec(migration());
  return db;
}

test("creates the four tables with RLS enabled", needsDb, async () => {
  const db = await freshDb();
  const { rows } = await db.query(`select n.nspname||'.'||c.relname as t, c.relrowsecurity as rls
    from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where c.relkind='r' and (n.nspname,c.relname) in
      (('public','game_registry'),('private','game_saves'),('private','game_events'),('private','game_handoff_tickets'))
    order by 1`);
  assert.deepEqual(rows.map((r) => r.t), ["private.game_events", "private.game_handoff_tickets", "private.game_saves", "public.game_registry"]);
  assert.ok(rows.every((r) => r.rls));
});

test("seeds only the unlisted Zombie Invasion Defense development placeholder", needsDb, async () => {
  const db = await freshDb();
  const { rows } = await db.query("select id, slug, status, is_listed, launch_url from public.game_registry");
  assert.deepEqual(rows, [{ id: "zid", slug: "zombie-invasion-defense", status: "development", is_listed: false, launch_url: null }]);
});

test("anon/authenticated read only listed beta/live games and cannot write the registry", needsDb, async () => {
  const db = await freshDb();
  await db.exec(`insert into public.game_registry(id,slug,title,status,is_listed) values
    ('live-one','live-one','Live One','live',true),('hidden-live','hidden-live','Hidden','live',false),('beta-listed','beta-listed','Beta','beta',true),('dev-listed','dev-listed','Dev','development',true)`);
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    const { rows } = await db.query("select id from public.game_registry order by id");
    assert.deepEqual(rows.map((r) => r.id), ["beta-listed", "live-one"], role);
    await assert.rejects(db.exec("insert into public.game_registry(id,slug,title) values ('zz-new','zz-new','x')"), /permission denied/, role);
    await assert.rejects(db.exec("update public.game_registry set is_listed=true"), /permission denied/, role);
    await db.exec("reset role");
  }
});

test("private game tables are closed to anon/authenticated and open to service_role", needsDb, async () => {
  const db = await freshDb();
  for (const role of ["anon", "authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(db.query("select * from private.game_saves"), /permission denied/, role);
    await assert.rejects(db.query("select * from private.game_events"), /permission denied/, role);
    await assert.rejects(db.query("select * from private.game_handoff_tickets"), /permission denied/, role);
    await db.exec("reset role");
  }
  await db.exec("set role service_role");
  await db.exec(`insert into private.game_saves(user_id,game_id,schema_version,save_data) values ('${USER}','zid',1,'{}')`);
  await db.exec("reset role");
});

test("constraints: id format, save/event uniqueness, idempotency, ticket expiry and origin", needsDb, async () => {
  const db = await freshDb();
  await assert.rejects(db.exec("insert into public.game_registry(id,slug,title) values ('A','a-bad','x')"), /game_registry_id_format|check/);
  await db.exec(`insert into private.game_saves(user_id,game_id,schema_version,save_data) values ('${USER}','zid',1,'{}')`);
  await assert.rejects(db.exec(`insert into private.game_saves(user_id,game_id,schema_version,save_data) values ('${USER}','zid',1,'{}')`), /unique|duplicate/);
  await db.exec(`insert into private.game_events(user_id,game_id,event_type,idempotency_key) values ('${USER}','zid','wave.cleared','idem-0001')`);
  await assert.rejects(db.exec(`insert into private.game_events(user_id,game_id,event_type,idempotency_key) values ('${USER}','zid','wave.cleared','idem-0001')`), /unique|duplicate/);
  await assert.rejects(db.exec(`insert into private.game_events(user_id,game_id,event_type,idempotency_key) values ('${USER}','zid','wave.cleared','short')`), /check/);
  const hash = "'\\x" + "ab".repeat(32) + "'";
  await assert.rejects(db.exec(`insert into private.game_handoff_tickets(ticket_hash,user_id,game_id,target_origin,expires_at) values (${hash},'${USER}','zid','http://insecure.example',now()+interval '5 min')`), /check/);
  await assert.rejects(db.exec(`insert into private.game_handoff_tickets(ticket_hash,user_id,game_id,target_origin,expires_at) values (${hash},'${USER}','zid','https://ok.example',now()-interval '1 min')`), /check/);
  await db.exec(`insert into private.game_handoff_tickets(ticket_hash,user_id,game_id,target_origin,expires_at) values (${hash},'${USER}','zid','https://ok.example',now()+interval '5 min')`);
});

test("re-running the migration is a no-op (idempotent)", needsDb, async () => {
  const db = await freshDb();
  await db.exec(migration());
  const { rows } = await db.query("select count(*)::int as n from public.game_registry");
  assert.equal(rows[0].n, 1);
});
