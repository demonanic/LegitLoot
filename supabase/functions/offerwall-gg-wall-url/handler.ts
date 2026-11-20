// RETIRED (owner decision 2026-11-20): Offerwall.GG is permanently removed from LegitLoot.
// Inert HTTP 410 tombstone for offerwall-gg-wall-url. Pure and side-effect free: it does not
// start a server, read the request body, read secrets or environment variables, create a
// Supabase client, call any RPC, or generate or launch any provider URL.
// See docs/security/OFFERWALL_GG_RETIREMENT.md. Do not restore the previous behavior.
export function handleRequest(_request: Request): Response {
  return new Response("OFFERWALL_GG_RETIRED", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
