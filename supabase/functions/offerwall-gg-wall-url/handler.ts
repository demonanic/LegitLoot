// Side-effect-free disabled handler for Offerwall.GG wall URL creation.
// This module does not read request bodies, secrets, environment variables, or Supabase.
export function handler(_request: Request): Response {
  return new Response("OFFERWALL_GG_DISABLED", {
    status: 410,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
