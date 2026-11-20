import test from "node:test";
import assert from "node:assert/strict";
import { handler } from "../supabase/functions/offerwall-gg-wall-url/handler.mjs";

for (const method of ["GET", "POST", "OPTIONS"]) {
  test(`Offerwall.GG wall URL handler returns inert 410 for ${method}`, async () => {
    const request = new Request("https://example.test/functions/v1/offerwall-gg-wall-url", {
      method,
      ...(method === "POST" ? { body: "must-not-be-read=true" } : {}),
    });
    const response = handler(request);
    assert.equal(response.status, 410);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(await response.text(), "OFFERWALL_GG_DISABLED");
    assert.equal(request.bodyUsed, false, "request body must remain unread");
  });
}
