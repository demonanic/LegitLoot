// Account credential forms must stay unavailable while Terms/Privacy are drafts.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const read = (n) => readFileSync(new URL("../" + n, import.meta.url), "utf8");

test("legal gate is closed and returns before any handler or client is created", () => {
  const js = read("account-auth.js");
  assert.match(js, /const LEGAL_NOTICES_FINAL = false;/);
  const gate = js.indexOf("if (!LEGAL_NOTICES_FINAL)");
  assert.ok(gate > 0);
  for (const marker of ["createClient", "addEventListener", ".signInWithPassword", "resetPasswordForEmail"]) {
    const at = js.indexOf(marker);
    assert.ok(at === -1 || at > gate, marker + " must come after the legal gate");
  }
});

test("account.html ships the auth panel hidden and says access is paused", () => {
  const html = read("account.html");
  assert.match(html, /<div id="auth-panel" class="auth-panel" hidden>/);
  assert.match(html, /Sign-in and password reset are unavailable while the Terms and Privacy Notice are being finalized/);
  assert.doesNotMatch(html, /Existing users (can|may) sign in/);
});

test("while privacy.html warns against submitting personal info, the gate must stay closed", () => {
  const privacy = read("privacy.html");
  if (/Do not submit personal information/i.test(privacy)) {
    assert.match(read("account-auth.js"), /const LEGAL_NOTICES_FINAL = false;/);
  }
});

test("closed gate at runtime: zero clients, zero handlers, zero config reads, panel hidden", () => {
  const counts = { clients: 0, handlers: 0, configReads: 0 };
  const status = { innerHTML: "" };
  const panel = { hidden: false };
  const el = (id) => (id === "auth-status" ? status : id === "auth-panel" ? panel : { addEventListener() { counts.handlers++; }, hidden: false });
  const window = { supabase: { createClient() { counts.clients++; throw new Error("client created"); } } };
  Object.defineProperty(window, "LEGITLOOT_SUPABASE_CONFIG", { get() { counts.configReads++; return undefined; } });
  const document = { getElementById: el, querySelectorAll: () => ({ forEach() { counts.handlers++; } }) };
  vm.runInNewContext(read("account-auth.js"), { window, document, console });
  assert.deepEqual(counts, { clients: 0, handlers: 0, configReads: 0 });
  assert.equal(panel.hidden, true);
  assert.match(status.innerHTML, /ACCOUNT ACCESS PAUSED/);
});
