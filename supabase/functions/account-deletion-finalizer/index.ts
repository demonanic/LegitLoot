import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const JSON_HEADERS = {
  "content-type": "application/json",
  "cache-control": "no-store",
};

function safeEqual(expected: string, supplied: string): boolean {
  const left = new TextEncoder().encode(expected);
  const right = new TextEncoder().encode(supplied);
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i++) mismatch |= left[i] ^ right[i];
  return mismatch === 0;
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const expectedSecret = Deno.env.get("ACCOUNT_DELETION_JOB_SECRET") ?? "";
  const suppliedSecret = request.headers.get("x-account-deletion-job-secret") ?? "";
  if (!expectedSecret || !safeEqual(expectedSecret, suppliedSecret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response("Missing configuration", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // The private schema is deliberately not exposed via PostgREST. These public
  // RPC facades are EXECUTE-granted only to service_role by the migration.
  const { data: requests, error: queryError } = await supabase.rpc(
    "claim_due_account_deletion_batch",
  );
  if (queryError) {
    return new Response(JSON.stringify({ error: "Query failed" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  const results: Array<{ id: string; status: string }> = [];
  for (const deletion of requests ?? []) {
    try {
      let status = deletion.status as string;

      if (status !== "data_cleared") {
        const { data, error } = await supabase.rpc(
          "process_account_deletion_job",
          { p_request_id: deletion.id },
        );
        if (error) throw error;
        status = data as string;
      }

      if (status === "blocked") {
        results.push({ id: deletion.id, status });
        continue;
      }

      if (status === "data_cleared") {
        // User metadata lives in auth.users.raw_user_meta_data and is separate
        // from public.profiles. Remove every user-editable metadata key first.
        // A retry after a completed soft-delete skips this step.
        const { data: authData, error: lookupError } = await supabase.auth.admin.getUserById(
          deletion.user_id,
        );
        if (lookupError && !/not found|deleted/i.test(lookupError.message)) {
          throw lookupError;
        }
        if (authData?.user && !authData.user.deleted_at) {
          const currentMetadata = authData.user.user_metadata ?? {};
          const clearedMetadata = Object.fromEntries(
            Object.keys(currentMetadata).map((key) => [key, null]),
          );
          if (Object.keys(clearedMetadata).length > 0) {
            const { error: metadataError } = await supabase.auth.admin.updateUserById(
              deletion.user_id,
              { user_metadata: clearedMetadata },
            );
            if (metadataError) throw metadataError;
          }
        }

        // Soft deletion invalidates refresh sessions, but previously issued JWTs
        // remain valid until expiry. SQL profile/wallet guards close sensitive reads.
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          deletion.user_id,
          true,
        );
        if (deleteError && !/not found|deleted/i.test(deleteError.message)) {
          throw deleteError;
        }

        const { data: completed, error: completionError } = await supabase.rpc(
          "complete_account_deletion_job",
          { p_request_id: deletion.id },
        );
        if (completionError) throw completionError;
        results.push({ id: deletion.id, status: completed as string });
      } else {
        results.push({ id: deletion.id, status });
      }
    } catch {
      // Do not return provider, Auth, SQL, or secret-bearing error details.
      results.push({ id: deletion.id, status: "retry_required" });
    }
  }

  const retryRequired = results.filter((item) => item.status === "retry_required").length;
  return new Response(
    JSON.stringify({ processed: results.length, retryRequired, results }),
    {
      status: retryRequired > 0 ? 207 : 200,
      headers: JSON_HEADERS,
    },
  );
});
