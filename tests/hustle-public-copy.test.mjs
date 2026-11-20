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

test("homepage LC steps list only the approved sources, in order", () => {
  const html = read("index.html");
  const block = html.match(/<ul class="ll-coins__steps">([\s\S]*?)<\/ul>/);
  assert.ok(block, "LC steps list not found");
  const steps = [...block[1].matchAll(/<li>[\s\S]*?<span>([\s\S]*?)<\/span>[\s\S]*?<\/li>/g)]
    .map((m) => m[1].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim());
  assert.deepEqual(steps, ["Complete verified in-game milestones", "Earn Legit Coins", "Weekly challenges & seasonal events"]);
});

test("homepage meta description and LC headline limit LC to the approved sources", () => {
  const html = read("index.html");
  const approved = "verified in-game milestones, weekly challenges and seasonal events";
  assert.ok(!/earned by playing/i.test(html), "broad 'earned by playing' wording remains");
  const meta = html.match(/<meta name="description" content="([^"]*)"/);
  assert.ok(meta && meta[1].includes(`earned only through ${approved}`), "meta description must limit LC to approved sources");
  assert.ok(html.includes(`<p>Earned only through ${approved}. Never cash.</p>`), "LC headline must limit LC to approved sources");
});

test("provider registry and hub never reference LC or open a Taplayad wall", () => {
  const reg = readFileSync(new URL("../earn-providers.js", import.meta.url), "utf8");
  const hub = readFileSync(new URL("../earn-hub.js", import.meta.url), "utf8");
  assert.doesNotMatch(reg, /launch:\s*Object\.freeze/);
  assert.doesNotMatch(reg + hub, /journal|ledger|\.rpc\(/i);
  assert.doesNotMatch(hub, /recordedTemplate/);
});
