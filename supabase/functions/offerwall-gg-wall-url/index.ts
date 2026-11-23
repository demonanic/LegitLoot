// Permanently disabled: the provider integration has been retired.
// Keep this endpoint as an inert 410 response so stale clients cannot launch it.
Deno.serve((_request: Request) => new Response("PROVIDER_RETIRED", {
  status: 410,
  headers: {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  },
}));
