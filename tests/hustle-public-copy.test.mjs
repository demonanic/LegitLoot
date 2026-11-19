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

test("earn.html title, description and accessible labels use Hustle terminology", () => {
  const html = read("earn.html");
  assert.match(html, /<title>Hustle — LegitLoot<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]*Hustle providers[^"]*"/);
  assert.ok(html.includes('aria-label="Hustle categories"'));
  assert.ok(html.includes('aria-label="Hustle providers"'));
  assert.ok(!/<title>[^<]*earn/i.test(html), "title still says Earn");
  assert.ok(!/aria-label="[^"]*earning/i.test(html), "an accessible label still says Earning");
  assert.ok(!/<meta name="description" content="[^"]*earning/i.test(html), "description still says earning");
});

test("Hustle status copy and provider disclaimer use approved wording", () => {
  assert.ok(!/earning provider/i.test(read("earn-hub.js")), "earn-hub.js user-visible text still says earning provider");
  assert.ok(read("earn-hub.js").includes("No Hustle provider is open to players right now"));
  const earn = read("earn.html");
  assert.ok(!earn.includes("not guaranteed earnings"));
  assert.match(earn, /Provider activity never credits Legit Coins and does not create a LegitLoot cash payout or wallet credit/);
  assert.match(earn, /provider's responsibility/);
});

test("homepage LC steps name challenges and seasonal events, not a placeholder", () => {
  const html = read("index.html");
  assert.ok(!html.includes("Uses announced later"));
  assert.ok(html.includes("Weekly challenges &amp; seasonal events"));
  assert.ok(html.includes("What LC can be used for has not been announced."));
});
