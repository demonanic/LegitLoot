import { handleRequest } from "./handler.ts";

Deno.test("offerwall-gg-wall-url is an inert 410 tombstone for every method", async () => {
  for (const method of ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"]) {
    const hasBody = method === "POST" || method === "PUT";
    const request = new Request("https://example.test/functions/v1/offerwall-gg-wall-url?userId=u&amount=1", {
      method,
      ...(hasBody ? { body: "must-not-be-read=true" } : {}),
    });
    const response = handleRequest(request);
    if (response.status !== 410) throw new Error(`${method}: expected 410, got ${response.status}`);
    if (response.headers.get("cache-control") !== "no-store") throw new Error(`${method}: expected no-store`);
    if (hasBody && request.bodyUsed) throw new Error(`${method}: body must remain unread`);
    if (method !== "HEAD" && (await response.text()) !== "OFFERWALL_GG_RETIRED") throw new Error(`${method}: unexpected body`);
  }
});
