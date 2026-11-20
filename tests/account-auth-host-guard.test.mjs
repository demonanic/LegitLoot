import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../account-auth.js", import.meta.url), "utf8");

function run(hostname) {
  const calls = { createClient: 0 };
  const status = { innerHTML: "", classList: { toggle() {} } };
  const forms = [{ hidden: false }, { hidden: false }];
  const noop = () => {};
  const document = {
    getElementById: (id) => (id === "auth-status" ? status : { hidden: false, addEventListener: noop, classList: { toggle: noop }, querySelector: () => ({}) }),
    querySelectorAll: (sel) => (sel === "form" ? forms : []),
    addEventListener: noop
  };
  const window = {
    location: { hostname, origin: "https://" + hostname, href: "https://" + hostname + "/account" },
    supabase: { createClient: () => { calls.createClient += 1; return { auth: { onAuthStateChange: noop, getSession: async () => ({ data: {} }) } }; } },
    addEventListener: noop
  };
  try { vm.runInNewContext(source, { window, document, console, setTimeout, URL, URLSearchParams }); } catch { /* production path may touch more DOM; only createClient matters */ }
  return { calls, status, forms };
}

for (const host of ["main.legitloot-preview.pages.dev", "abc123.legitloot.pages.dev", "claude-x.legitloot-preview.pages.dev", "localhost", "evil-legitloot.site", "legitloot.site.evil.com"]) {
  test(`fails closed before createClient on ${host}`, () => {
    const r = run(host);
    assert.equal(r.calls.createClient, 0);
    assert.match(r.status.innerHTML, /ACCOUNT DISABLED/);
    assert.ok(r.forms.every((f) => f.hidden === true));
  });
}

for (const host of ["legitloot.site", "www.legitloot.site"]) {
  test(`production host ${host} still initializes the client`, () => {
    assert.equal(run(host).calls.createClient, 1);
  });
}

test("no createClient call precedes the host check", () => {
  assert.ok(source.indexOf("isProductionHost") < source.indexOf("createClient("));
});
