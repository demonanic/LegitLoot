import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://scmnxcsggquwtuyyjnnj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ukFXb72cBXgcbgJIaQhD5w_NPIR7dGS";
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = (id) => document.getElementById(id);
const auth = $("auth"), app = $("app"), results = $("results"), detail = $("detail"), details = $("details");
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtNum = (n) => Number(n || 0).toLocaleString();
let activeView = "overview";
let lastSession = null;
let overviewSnapshot = null;

async function api(action, payload = {}) {
  const { data: { session } } = await client.auth.getSession();
  if (!session?.access_token) throw new Error("Session expired. Sign in again.");
  const response = await fetch(SUPABASE_URL + "/functions/v1/admin-cockpit", {
    method: "POST",
    headers: { Authorization: "Bearer " + session.access_token, "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    cache: "no-store",
    body: JSON.stringify({ action, ...payload })
  });
  let body;
  try { body = await response.json(); } catch { throw new Error("The admin service returned an invalid response."); }
  if (!response.ok) throw new Error(body?.error || "Admin request failed (" + response.status + ").");
  return body;
}
function showSession(session) {
  lastSession = session;
  auth.hidden = !!session;
  app.hidden = !session;
  if (session) $("who").textContent = session.user?.email || "Owner session";
  if (!session) {
    overviewSnapshot = null;
    if (results) results.replaceChildren();
    if (details) details.replaceChildren();
  }
}
client.auth.onAuthStateChange((_event, session) => showSession(session));
client.auth.getSession().then(({ data }) => showSession(data.session));

$("login").addEventListener("click", async () => {
  $("authmsg").textContent = "";
  $("login").disabled = true;
  try {
    const { error } = await client.auth.signInWithPassword({ email: $("email").value.trim(), password: $("password").value });
    if (error) throw error;
  } catch (error) {
    $("authmsg").textContent = error?.message || "Unable to sign in.";
  } finally { $("login").disabled = false; }
});
$("password").addEventListener("keydown", (event) => { if (event.key === "Enter") $("login").click(); });
$("logout").addEventListener("click", async () => { await client.auth.signOut(); });
$("menu").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("refresh").addEventListener("click", () => refreshCurrentView());
$("close-detail").addEventListener("click", () => { detail.hidden = true; details.replaceChildren(); });

function setView(name) {
  const valid = ["overview","users","wallets","redemptions","support","security","analytics","providers","audit"];
  if (!valid.includes(name)) name = "overview";
  activeView = name;
  document.querySelectorAll(".view-panel").forEach((node) => { node.hidden = node.id !== "view-" + name; });
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === name));
  const labels = { overview:"Command Center",users:"User Management",wallets:"Wallets & Ledger",redemptions:"Redemptions",support:"Support",security:"Security & Risk",analytics:"Website Analytics",providers:"Provider Operations",audit:"Audit Log" };
  $("page-title").textContent = labels[name];
  $("heading").textContent = labels[name];
  $("section-kicker").textContent = "OPERATIONS / " + name.toUpperCase();
  $("sidebar").classList.remove("open");
  if (name === "overview" && !overviewSnapshot) loadOverview();
  if (name === "users") $("query").focus({ preventScroll: true });
}
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelectorAll("[data-open-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.openView)));

function setMetric(id, value) { const node = $(id); if (node) node.textContent = value == null ? "—" : fmtNum(value); }
function setNotice(message, kind = "info") {
  const node = $("notice");
  if (!message) { node.hidden = true; node.textContent = ""; return; }
  node.hidden = false;
  node.className = "notice " + kind;
  node.textContent = message;
}
async function loadOverview() {
  overviewSnapshot = null;
  ["metric-users","metric-rewards","metric-events","metric-payouts","metric-audit","metric-game","audit-count-inline"].forEach((id) => setMetric(id, null));
  $("description").textContent = "The command-center overview endpoint is not yet connected. This panel will show verified staging metrics only after its owner-only backend read is implemented and approved for staging.";
  setNotice("Overview metrics unavailable: the deployed admin-cockpit API currently supports user search and detail only. Wallet balances remain withheld pending ledger reconciliation. No metrics are simulated.", "warning");
}
async function refreshCurrentView() {
  if (activeView === "overview") return loadOverview();
  if (activeView === "users") {
    const query = $("query").value.trim();
    if (query.length >= 2) return searchUsers();
  }
  setNotice("This module is currently read-only or awaiting a verified data source.");
}

$("search").addEventListener("click", searchUsers);
$("query").addEventListener("keydown", (event) => { if (event.key === "Enter") searchUsers(); });
async function searchUsers() {
  const query = $("query").value.trim();
  $("msg").textContent = "";
  results.replaceChildren();
  detail.hidden = true;
  if (query.length < 2) { $("msg").textContent = "Enter at least two characters."; return; }
  $("search").disabled = true;
  $("msg").textContent = "Searching…";
  try {
    const response = await api("search", { search: query });
    const rows = response.results || [];
    $("msg").textContent = rows.length + (rows.length === 1 ? " account found" : " accounts found");
    if (!rows.length) {
      results.innerHTML = '<div class="empty-state"><b>No matching account</b><p>Try another email, username, display name or user ID fragment.</p></div>';
      return;
    }
    results.innerHTML = rows.map((user) => {
      const wallets = (user.balances || []).map((balance) =>
        '<span class="tag">' + esc(balance.walletKind) + " · " + esc(balance.currency) + "</span>"
      ).join("");
      return '<article class="result"><strong>' + esc(user.displayName || user.username || "(No profile name)") +
        '</strong><div>' + esc(user.email || "No email") + '</div><small>' + esc(user.userId) +
        '</small><div class="result-meta">' + (wallets || '<span class="tag">No wallet summary</span>') +
        '</div><div class="result-actions"><button class="secondary-button" data-user-id="' + esc(user.userId) + '">View account details →</button></div></article>';
    }).join("");
    results.querySelectorAll("[data-user-id]").forEach((button) => button.addEventListener("click", () => loadUserDetail(button.dataset.userId)));
  } catch (error) {
    $("msg").textContent = error.message;
  } finally { $("search").disabled = false; }
}

function renderKeyValues(container, entries) {
  container.innerHTML = '<div class="kv-grid">' + entries.map(([label, value]) =>
    '<div class="kv"><small>' + esc(label) + '</small><b>' + esc(value == null || value === "" ? "Not available" : value) + '</b></div>'
  ).join("") + "</div>";
}
async function loadUserDetail(userId) {
  detail.hidden = false;
  details.innerHTML = '<p class="muted">Loading account detail…</p>';
  try {
    const response = await api("detail", { userId });
    const user = response.user || {};
    const accountRows = (response.accounts || []).map((account) =>
      '<tr><td>' + esc(account.walletKind) + '</td><td>' + esc(account.currency) + '</td><td>' + esc(account.accountCode) +
      '</td><td>' + esc(account.scale) + '</td><td>' + esc(account.closedAt ? "Closed" : "Open") + '</td></tr>'
    ).join("");
    const historyRows = (response.recentLedgerActivity || []).map((tx) =>
      '<tr><td>' + esc(tx.created_at) + '</td><td>' + esc(tx.event_type) + '</td><td>' + esc(tx.source_system) +
      '</td><td>' + esc(tx.status) + '</td><td>' + esc(tx.description) + '</td></tr>'
    ).join("");
    details.innerHTML = '<div class="kv-grid">' + [
      ["Email", user.email],["Username", user.username],["Display name", user.display_name],
      ["User ID", user.id],["Registered", user.auth_created_at],["Last sign-in", user.last_sign_in_at],
      ["Profile updated", user.updated_at],["Profile deleted", user.deleted_at]
    ].map(([key,value]) => '<div class="kv"><small>' + esc(key) + '</small><b>' + esc(value) + '</b></div>').join("") +
    '</div><h3>Wallet accounts</h3><div class="data"><table class="data-table"><thead><tr><th>Wallet</th><th>Currency</th><th>Account</th><th>Scale</th><th>Status</th></tr></thead><tbody>' +
    (accountRows || '<tr><td colspan="5">No wallet accounts found.</td></tr>') +
    '</tbody></table></div><h3>Recent ledger activity</h3><div class="data"><table class="data-table"><thead><tr><th>Created</th><th>Event</th><th>Source</th><th>Status</th><th>Description</th></tr></thead><tbody>' +
    (historyRows || '<tr><td colspan="5">No ledger history found.</td></tr>') + '</tbody></table></div>';
    detail.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    details.textContent = error.message;
  }
}

setView("overview");
