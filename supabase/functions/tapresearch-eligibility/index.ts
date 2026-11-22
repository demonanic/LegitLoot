// Entrypoint only. The pure handler lives in handler.ts so tests import it without side effects.
import { createClient } from "npm:@supabase/supabase-js@2.108.2";
import { handleRequest, STAGING_SUPABASE_URL } from "./handler.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
if (supabaseUrl !== STAGING_SUPABASE_URL) {
  throw new Error("tapresearch-eligibility is restricted to the LegitLoot staging Supabase project");
}
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve((request) =>
  handleRequest(request, {
    env: (name) => Deno.env.get(name),
    fetch,
    getUserId: async (accessToken) => {
      const { data, error } = await supabase.auth.getUser(accessToken);
      return error || !data.user ? null : data.user.id;
    },
  })
);
