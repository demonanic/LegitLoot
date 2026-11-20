import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../account-auth.js", import.meta.url), "utf8");
const noop = () => {};

function run(hostname) {
  const out = { createClient: 0, listeners: {}, authStateChange: 0, getSession: 0, error: null };
  const els = {};
  const el = (id) => (els[id] ||= {
    id, hidden: false, textContent: "", innerHTML: "", disabled: false, value: "", dataset: {},
    classList: { toggle: noop, add: noop, remove: noop },
    addEventListener: (type) => { (out.listeners[id] ||= []).push(type); },
    querySelector: () => el(id + ":child"),
    append: noop
  });
  const forms = ["signin-form", "signup-form", "reset-form", "recovery-form"].map(el);
  const document = {
    getElementById: el,
    querySelectorAll: (sel) => (sel === "form" ? forms : []),
    createElement: () => ({ textContent: "" }),
    addEventListener: noop
  };
  const client = {
    auth: {
      onAuthStateChange: () => { out.authStateChange += 1; },
      getSession: () => { out.getSession += 1; return Promise.resolve({ data: { session: null }, error: null }); }
    },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) })
  };
  const window = {
    location: { hostname, origin: "https://" + hostname, href: "https://" + hostname + "/account", hash: "", search: "" },
    supabase: { createClient: () => { out.createClient += 1; return client; } },
    addEventListener: noop
  };
  try {
    vm.runInNewContext(source, { window, document, console, setTimeout, URL, URLSearchParams, Intl, Number });
  } catch (error) {
    out.error = error;
  }
  return { out, status: els["auth-status"], forms };
}

const blockedHosts = [
  "main.legitloot-preview.pages.dev",
  "abc123.legitloot.pages.dev",
  "claude-x.legitloot-preview.pages.dev",
  "localhost",
  "www.legitloot.site", // not a verified production alias; add only with Cloudflare custom-domain evidence
  "evil-legitloot.site",
  "legitloot.site.evil.com"
];

for (const host of blockedHosts) {
  test(`fails closed before createClient on ${host}`, () => {
    const { out, status, forms } = run(host);
    assert.equal(out.error, null);
    assert.equal(out.createClient, 0);
    assert.equal(out.authStateChange, 0);
    assert.equal(out.getSession, 0);
    assert.match(status.innerHTML, /ACCOUNT DISABLED/);
    assert.ok(forms.every((f) => f.hidden === true));
    assert.equal(Object.keys(out.listeners).length, 0, "no handlers wired on a blocked host");
  });
}

test("production host legitloot.site initializes without throwing and wires auth handlers", () => {
  const { out } = run("legitloot.site");
  assert.equal(out.error, null, out.error && String(out.error.stack));
  assert.equal(out.createClient, 1);
  for (const id of ["signin-form", "signup-form", "reset-form", "recovery-form", "signout-button"]) {
    assert.ok(out.listeners[id]?.includes(id === "signout-button" ? "click" : "submit"), `${id} handler wired`);
  }
  assert.equal(out.authStateChange, 1);
  assert.equal(out.getSession, 1);
});

test("host check precedes createClient in source", () => {
  assert.ok(source.indexOf("isProductionHost") < source.indexOf("createClient("));
  assert.ok(!source.includes("www.legitloot.site"));
});
