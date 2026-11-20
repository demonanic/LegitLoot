// Production containment candidate for Offerwall.GG.
// This endpoint is intentionally inert. It does not read secrets, parse callback
// payloads, create a Supabase client, or invoke any database RPC.
// Deploy only after the separate owner-approved production release gate.

export function handleRequest(_request: Request): Response {
  return new Response("OFFERWALL_GG_DISABLED", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

Deno.serve(handleRequest);
