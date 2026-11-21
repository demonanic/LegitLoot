// CPAGrip attribution is retired from the initial Hustle release (Taplayad is the only
// owner-selected initial publisher). This canonical source is an inert tombstone: it
// reads no request body, no secrets, creates no Supabase client and calls no RPC, so a
// future deploy cannot mint attribution tokens. Provider-specific code for a later
// provider needs separate owner approval. NOT deployed by this change; the deployed
// staging v5 and its store_cpagrip_attribution_token RPC are unchanged until a separately
// reviewed, owner-authorized staging retirement.
Deno.serve((_request: Request): Response =>
  new Response(JSON.stringify({ error: "Gone" }), {
    status: 410,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  })
);
