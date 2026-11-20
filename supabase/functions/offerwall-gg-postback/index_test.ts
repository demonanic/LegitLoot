import { assertEquals } from "jsr:@std/assert@1";
import { handleRequest } from "./index.ts";

Deno.test("Offerwall.GG callback endpoint rejects GET without processing", () => {
  const response = handleRequest(new Request("https://example.test/callback?userId=synthetic"));
  assertEquals(response.status, 410);
  assertEquals(response.headers.get("cache-control"), "no-store");
});

Deno.test("Offerwall.GG callback endpoint rejects POST without reading or processing body", () => {
  const response = handleRequest(new Request("https://example.test/callback", {
    method: "POST",
    body: "userId=synthetic&currencyAmount=999&status=credited",
  }));
  assertEquals(response.status, 410);
});

Deno.test("Offerwall.GG callback endpoint rejects OPTIONS", () => {
  const response = handleRequest(new Request("https://example.test/callback", { method: "OPTIONS" }));
  assertEquals(response.status, 410);
});
