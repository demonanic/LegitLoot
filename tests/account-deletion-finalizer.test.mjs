import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const functionSource = readFileSync(
  new URL("../supabase/functions/account-deletion-finalizer/index.ts", import.meta.url),
  "utf8",
);
const migrationSource = readFileSync(
  new URL("../supabase/migrations/20261126010000_auth_03_account_deletion.sql", import.meta.url),
  "utf8",
);

test("finalizer requires POST and a configured secret header", () => {
  assert.match(functionSource, /request\.method !== "POST"/);
  assert.match(functionSource, /ACCOUNT_DELETION_JOB_SECRET/);
  assert.match(functionSource, /x-account-deletion-job-secret/);
  assert.match(functionSource, /function safeEqual/);
});

test("finalizer uses the public, service-role-only RPC facade", () => {
  assert.match(functionSource, /rpc\(\s*"claim_due_account_deletion_batch"/);
  assert.match(functionSource, /rpc\(\s*"process_account_deletion_job"/);
  assert.match(functionSource, /rpc\(\s*"complete_account_deletion_job"/);
  assert.doesNotMatch(functionSource, /\.schema\(["']private["']\)/);
  assert.doesNotMatch(functionSource, /from\(["']account_deletion_requests["']\)/);
});

test("migration keeps the private schema private and exposes only service-role job RPCs", () => {
  for (const signature of [
    "public.claim_due_account_deletion_batch()",
    "public.process_account_deletion_job(uuid)",
    "public.complete_account_deletion_job(uuid)",
  ]) {
    assert.ok(migrationSource.includes(signature), `missing wrapper ${signature}`);
    assert.match(
      migrationSource,
      new RegExp(`revoke all on function ${signature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} from public, anon, authenticated`, "i"),
    );
    assert.match(
      migrationSource,
      new RegExp(`grant execute on function ${signature.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} to service_role`, "i"),
    );
  }
});

test("deletion finalizer retains SQL processing, soft delete, and completion", () => {
  assert.match(functionSource, /process_account_deletion_job/);
  assert.match(functionSource, /deleteUser\([\s\S]*?true,\s*\)/);
  assert.match(functionSource, /complete_account_deletion_job/);
  assert.match(functionSource, /retry_required/);
  assert.match(functionSource, /status: retryRequired > 0 \? 207 : 200/);
});

test("batch query stays bounded and closed-account ledger records are not directly edited", () => {
  assert.match(migrationSource, /limit 25/i);
  assert.doesNotMatch(functionSource, /from\(["']journal_entries["']\)|from\(["']ledger_accounts["']\)/);
});
