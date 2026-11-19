import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve((req: Request) => {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: {
      ...headers,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    }});
  }
  return new Response(JSON.stringify({ error: "This one-time provisioning endpoint is permanently closed." }), {
    status: 410,
    headers,
  });
});
