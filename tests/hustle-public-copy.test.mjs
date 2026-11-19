import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const pages = readdirSync(new URL("../", import.meta.url)).filter((f) => f.endsWith(".html"));

test("public navigation labels the earn.html route 'Hustle', never 'Earn'", () => {
  for (const page of pages) {
    const html = read(page);
    for (const m of html.matchAll(/<a[^>]*href="earn\.html"[^>]*>([^<]*)<\/a>/g)) {
      assert.ok(!/^\s*earn\s*$/i.test(m[1].replace(/<[^>]*>/g, "")), `${page}: nav link still says Earn`);
    }
    assert.ok(!html.includes("<span>EARN</span>"), `${page}: bottom nav still says EARN`);
  }
});

test("homepage LC steps do not list provider offers as an LC source", () => {
  assert.ok(!/Complete offers/i.test(read("index.html")));
});

test("homepage feature card names the owner-approved launch titles, not the placeholder", () => {
  const html = read("index.html");
  assert.ok(!html.includes("Zombie Invasion Defense"));
  assert.ok(html.includes("Zombies vs Heavy Metal"));
  assert.ok(html.includes("Rocket 2 Nowhere"));
});
