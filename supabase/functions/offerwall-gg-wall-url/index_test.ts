import { handler } from "./handler.ts";

Deno.test("Offerwall.GG wall URL handler is inert for every HTTP method", async () => {
  for (const method of ["GET", "POST", "OPTIONS"]) {
    const request = new Request("https://example.test/functions/v1/offerwall-gg-wall-url", {
      method,
      ...(method === "POST" ? { body: "must-not-be-read=true" } : {}),
    });
    const response = handler(request);
    if (response.status !== 410) throw new Error(`${method}: expected HTTP 410, got ${response.status}`);
    if (response.headers.get("cache-control") !== "no-store") {
      throw new Error(`${method}: expected Cache-Control: no-store`);
    }
    if (method === "POST" && request.bodyUsed) {
      throw new Error("POST body must remain unread");
    }
    if (await response.text() !== "OFFERWALL_GG_DISABLED") {
      throw new Error(`${method}: unexpected response body`);
    }
  }
});
