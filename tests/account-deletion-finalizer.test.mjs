import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source=readFileSync(new URL("../supabase/functions/account-deletion-finalizer/index.ts",import.meta.url),"utf8");
test("finalizer requires secret and POST",()=>{
 assert.match(source,/req\.method!==\"POST\"/);
 assert.match(source,/ACCOUNT_DELETION_JOB_SECRET/);
 assert.match(source,/x-account-deletion-job-secret/);
});
test("finalizer uses SQL processing and soft delete, never direct ledger writes",()=>{
 assert.match(source,/process_account_deletion/);
 assert.match(source,/deleteUser\(r\.user_id,true\)/);
 assert.match(source,/complete_account_deletion/);
 assert.doesNotMatch(source,/from\(\"journal_entries\"\)|from\(\"ledger_accounts\"\)/);
});
test("bounded batch and retry-safe completion path",()=>{
 assert.match(source,/limit\(25\)/);
 assert.match(source,/status===\"data_cleared\"/);
 assert.match(source,/retry_required/);
});
