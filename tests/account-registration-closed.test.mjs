import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Master Execution Control §13 E1: new public registration is paused; existing sign-in and
// account access (including recovery) are preserved. Authentication is NOT disabled entirely.
// Backend Auth disable_signup remains unverified/owner-gated; these are UI/source assertions only.
const html = readFileSync(new URL("../account.html", import.meta.url), "utf8");
const js = readFileSync(new URL("../account-auth.js", import.meta.url), "utf8");

test("registration stays closed in the UI: no signup form, tab, button or client signUp call", () => {
  assert.doesNotMatch(html, /id="signup-form"|data-auth-tab="signup"|CREATE ACCOUNT/i);
  assert.doesNotMatch(js, /auth\.signUp|signup-form/);
  assert.match(html, /New registration is closed/);
});

test("existing sign-in and password reset are preserved (not gated off, panel not hidden)", () => {
  assert.doesNotMatch(html, /id="auth-panel"[^>]*\bhidden\b/);
  assert.doesNotMatch(html + js, /ACCOUNT ACCESS PAUSED|LEGAL_NOTICES_FINAL|are unavailable while the Terms/);
  assert.match(js, /signInWithPassword/);
  assert.match(js, /resetPasswordForEmail/);
  assert.match(html, /Existing users can sign in or reset their password/);
});

test("staging-only fail-closed config guard still precedes client creation", () => {
  const guard = js.indexOf('config.environment !== "staging"');
  const create = js.indexOf("createClient(config.url");
  assert.ok(guard > -1 && create > guard, "staging guard must run before createClient");
});
