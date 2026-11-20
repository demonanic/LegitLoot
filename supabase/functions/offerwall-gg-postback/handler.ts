// Pure, side-effect-free handler for the Offerwall.GG containment candidate.
// Safe to import from tests: this module does not start a server, read secrets,
// parse callback payloads, create a Supabase client, or invoke database RPCs.
export function handleRequest(_request: Request): Response {
  return new Response("OFFERWALL_GG_DISABLED", {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
