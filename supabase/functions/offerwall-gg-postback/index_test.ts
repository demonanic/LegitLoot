import { handleRequest } from "./handler.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

Deno.test("GET callbacks are disabled", () => {
  const request = new Request("https://example.test/callback?userId=synthetic");
  const response = handleRequest(request);
  assert(response.status === 410, "expected HTTP 410");
  assert(response.headers.get("cache-control") === "no-store", "expected no-store");
  assert(response.headers.get("content-type")?.startsWith("text/plain") === true, "expected plain text response");
  assert(request.bodyUsed === false, "GET request body must not be read");
});

Deno.test("POST callbacks are disabled without reading the body", () => {
  const request = new Request("https://example.test/callback", {
    method: "POST",
    body: "userId=synthetic&currencyAmount=999&status=credited",
  });
  const response = handleRequest(request);
  assert(response.status === 410, "expected HTTP 410");
  assert(response.headers.get("cache-control") === "no-store", "expected no-store");
  assert(request.bodyUsed === false, "POST body must not be read");
});

Deno.test("OPTIONS requests are disabled", () => {
  const request = new Request("https://example.test/callback", { method: "OPTIONS" });
  const response = handleRequest(request);
  assert(response.status === 410, "expected HTTP 410");
  assert(response.headers.get("cache-control") === "no-store", "expected no-store");
});
