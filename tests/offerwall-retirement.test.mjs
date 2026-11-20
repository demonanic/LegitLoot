// Run: node --test tests/*.test.mjs
// Offerwall.GG permanent retirement guard (docs/security/OFFERWALL_GG_RETIREMENT.md).
// Static checks over canonical sources, snapshots/manifests, the proposed staging SQL and
// the frontend. They prove nothing about what is deployed; deployment is verified separately.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[\s;{}])\/\/.*$/gm, "$1");
const FUNCTIONS = ["offerwall-gg-postback", "offerwall-gg-wall-url"];

test("canonical Offerwall.GG functions are inert 410 tombstones", () => {
  for (const fn of FUNCTIONS) {
    const dir = `supabase/functions/${fn}/`;
    assert.deepEqual(readdirSync(new URL(dir, root)).sort(), ["handler.ts", "index.ts", "index_test.ts"], `${fn} file set`);
    const handler = stripComments(read(`${dir}handler.ts`));
    assert.match(handler, /status:\s*410/);
    assert.match(handler, /OFFERWALL_GG_RETIRED/);
    const index = stripComments(read(`${dir}index.ts`));
    assert.match(index, /^\s*import \{ handleRequest \} from "\.\/handler\.ts";\s*Deno\.serve\(handleRequest\);\s*$/);
    for (const [name, src] of [["handler", handler], ["index", index]]) {
      assert.ok(!/Deno\.env|createClient|supabase|\.rpc\(|\.json\(|\.text\(|\.formData\(|request\.body|URL\(|fetch\(|hmac|crypto|SECRET|serviceRole|SERVICE_ROLE/i.test(src.replace(/from "\.\/handler\.ts"/, "")), `${fn}/${name}.ts must stay side-effect free`);
    }
  }
});

test("no source imports anything else into the tombstones", () => {
  for (const fn of FUNCTIONS) {
    for (const file of ["handler.ts", "index.ts"]) {
      const imports = [...read(`supabase/functions/${fn}/${file}`).matchAll(/^\s*import\s[^;]*from\s+["']([^"']+)["']/gm)].map((m) => m[1]);
      assert.ok(imports.every((i) => i === "./handler.ts"), `${fn}/${file} imports ${imports}`);
    }
  }
});

test("no active launcher remains in the frontend", () => {
  assert.ok(!existsSync(new URL("offerwall-launch.js", root)), "offerwall-launch.js must stay deleted");
  for (const file of readdirSync(root).filter((f) => /\.(html|js)$/.test(f) && f !== "earn-providers.js")) {
    const src = read(file);
    assert.ok(!/offerwall-gg-wall-url|offerwall\.gg\/wall|offerwall-launch/i.test(src), `${file} references the retired launcher`);
  }
});

test("staging snapshots of the retired functions are marked retired / do-not-deploy", () => {
  for (const fn of FUNCTIONS) {
    const marker = `supabase/environments/staging/functions/${fn}/RETIRED.md`;
    assert.ok(existsSync(new URL(marker, root)), `${marker} missing`);
    assert.match(read(marker), /DO NOT DEPLOY/);
  }
  for (const env of ["staging", "production"]) {
    const manifest = JSON.parse(read(`supabase/environments/${env}/DEPLOYED_FUNCTIONS_MANIFEST.json`));
    for (const fn of FUNCTIONS) {
      const entry = manifest.functions.find((f) => f.slug === fn);
      assert.ok(entry, `${env} manifest must keep the historical ${fn} entry`);
      assert.equal(entry.retired, true, `${env}/${fn} must be flagged retired`);
      assert.equal(entry.do_not_deploy_snapshot, true, `${env}/${fn} must be flagged do_not_deploy_snapshot`);
    }
  }
});

test("production snapshot sources of the retired functions are marked do-not-deploy", () => {
  for (const fn of FUNCTIONS) {
    const marker = `supabase/environments/production/functions/${fn}/RETIRED.md`;
    assert.ok(existsSync(new URL(marker, root)), `${marker} missing`);
    assert.match(read(marker), /DO NOT DEPLOY/);
  }
});

test("proposed staging SQL retires the routines without deleting data or touching the ledger", () => {
  const sql = read("supabase/proposed/staging/20261120160000_offerwall_gg_retirement.sql");
  assert.match(sql, /DO NOT APPLY/);
  const code = sql.replace(/--.*$/gm, "");
  assert.ok(!/\bdrop\s+(table|schema|column)\b|\bdelete\s+from\b|\btruncate\b/i.test(code), "must not delete data");
  assert.ok(!/post_journal_transaction|ledger_accounts|journal_entries|ledger/i.test(code), "must not reference the ledger");
  const bodies = [...code.matchAll(/\$function\$([\s\S]*?)\$function\$/g)].map((m) => m[1].trim());
  assert.equal(bodies.length, 4);
  for (const body of bodies) assert.match(body, /^begin\s+raise exception 'Offerwall\.GG is permanently retired';\s+end;$/);
  assert.equal([...code.matchAll(/revoke all on function/g)].length, 4);
  assert.match(code, /update private\.providers[\s\S]*status = 'retired'[\s\S]*approved_reward_model = null[\s\S]*approval_reference = null[\s\S]*terms_url = null[\s\S]*terms_verified_at = null[\s\S]*where provider_key = 'offerwall_gg'/);
  assert.equal([...code.matchAll(/update private\./g)].length, 1, "only the provider row may be updated");
});

test("proposed SQL recovery plan is forward-only and never restores the callback path", () => {
  const header = read("supabase/proposed/staging/20261120160000_offerwall_gg_retirement.sql").split("begin;")[0];
  assert.ok(!/\breversible\b/i.test(header), "header must not call the retirement reversible (forward-only, no rollback)");
  assert.match(header, /non-destructive, no data deleted; forward-only/);
  assert.match(header, /FORWARD-ONLY, FAIL-CLOSED/);
  assert.match(header, /Do NOT re-apply the record-only callback migration/);
  assert.ok(!/\bRollback:/i.test(header), "no rollback-to-old-path instructions");
  assert.ok(!/re-grant EXECUTE to\s+service_role only|restore the provider row from the staging snapshot/i.test(header));
});

test("the staging routine snapshot is never described as current deployment state", () => {
  const t = read("tests/offerwall-record-only.test.mjs");
  assert.ok(!/currently deployed|deployedRoutine/i.test(t), "snapshot must be named historical, not current/deployed");
  assert.match(t, /historicalPreRecordOnlyRoutine/);
  assert.match(t, /HISTORICAL pre-record-only snapshot/);
  assert.ok(!/"deployed"/.test(t), "source-list must not label the snapshot \"deployed\"");
  assert.ok(!/callbacks must be recorded but must never post/i.test(t), "unqualified record-only contract must not appear");
  assert.match(t, /SUPERSEDED/);
  assert.match(t, /HISTORICAL REGRESSION \/ FORENSIC TEST of the FORMER record-only migration/);
  assert.match(t, /permanent-retirement decision/);
});

test("the proposed retirement SQL is not in an auto-applied migrations directory", () => {
  const migrations = readdirSync(new URL("supabase/migrations/", root));
  assert.ok(!migrations.some((m) => /retire/i.test(m)));
});

function listFiles(dir, out = []) {
  for (const entry of readdirSync(new URL(dir + "/", root), { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    if (entry.isDirectory()) listFiles(path, out); else out.push(path);
  }
  return out;
}

test("no deployable path (workflows, scripts, configs) selects a retired snapshot or deploys a retired function", () => {
  const candidates = [
    ...listFiles(".github"),
    ...readdirSync(root).filter((f) => /^(package\.json|Makefile|.*\.(sh|toml|ya?ml))$/.test(f)),
    ...["supabase/config.toml"].filter((f) => existsSync(new URL(f, root))),
    ...(existsSync(new URL("scripts/", root)) ? listFiles("scripts") : []),
    ...listFiles("supabase").filter((f) => /\.(sh|toml|ya?ml|json)$/.test(f) && !/DEPLOYED_FUNCTIONS_MANIFEST\.json$/.test(f)),
  ];
  for (const file of new Set(candidates)) {
    const src = read(file);
    assert.ok(!/environments\/(staging|production)\/functions\/offerwall-gg/.test(src), `${file} selects a retired snapshot`);
    assert.ok(!/functions\s+deploy[^\n]*offerwall-gg/i.test(src), `${file} deploys a retired function`);
  }
});

test("the website registry has no Offerwall.GG record, name, launch or origin", () => {
  const registry = read("earn-providers.js");
  assert.ok(!/offerwall[-. _]?gg/i.test(registry), "no Offerwall.GG id/name/function in the registry");
  assert.ok(!/offerwall\.gg/i.test(registry), "no offerwall.gg origin in the registry");
  assert.ok(!/launch:\s*Object\.freeze/.test(registry), "no provider may carry a launch block in this release");
  assert.match(registry, /id: "taplayad"/);
  assert.match(registry, /state: "pending_approval"/);
  assert.ok(!/id: "cpagrip"/.test(registry), "CPAGrip is not part of the initial registry");
});
