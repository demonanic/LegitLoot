import { handleRequest } from "./index.ts";

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

Deno.test("GET callbacks are disabled without processing", () => {
  const response = handleRequest(new Request("https://example.test/callback?userId=synthetic"));
  assert(response.status === 410, "expected HTTP 410");
  assert(response.headers.get("cache-control") === "no-store", "expected no-store");
});

Deno.test("POST callbacks are disabled without processing the body", () => {
  const response = handleRequest(new Request("https://example.test/callback", {
    method: "POST",
    body: "userId=synthetic&currencyAmount=999&status=credited",
  }));
  assert(response.status === 410, "expected HTTP 410");
});

Deno.test("OPTIONS requests are disabled", () => {
  const response = handleRequest(new Request("https://example.test/callback", { method: "OPTIONS" }));
  assert(response.status === 410, "expected HTTP 410");
});
