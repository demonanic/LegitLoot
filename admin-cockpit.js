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
  if (!session?.access_token) {
    showSession(null);
    throw new Error("Your session is no longer available. Please sign in again.");
  }
  const response = await fetch(SUPABASE_URL + "/functions/v1/admin-cockpit", {
    method: "POST",
    headers: { Authorization: "Bearer " + session.access_token, "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    cache: "no-store",
    body: JSON.stringify({ action, ...payload })
  });
  let body;
  try { body = await response.json(); } catch { throw new Error("The admin service returned an invalid response."); }
  if (!response.ok) {
    if (response.status === 401) {
      await client.auth.signOut();
      throw new Error("Your session expired. Please sign in again.");
    }
    if (response.status === 403) throw new Error(body?.error || "Access denied. This account is not authorized for admin data.");
    throw new Error(body?.error || "Admin request failed (" + response.status + ").");
  }
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
let sessionInitialized = false;
function syncSession(session) {
  showSession(session);
  if (session && !sessionInitialized) {
    sessionInitialized = true;
    setView(activeView);
  } else if (!session) {
    sessionInitialized = false;
  }
}
client.auth.onAuthStateChange((_event, session) => syncSession(session));
client.auth.getSession().then(({ data }) => syncSession(data.session)).catch(() => syncSession(null));

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
  const valid = ["overview","users","wallets","redemptions","support","security","analytics","providers","audit","lc"];
  if (!valid.includes(name)) name = "overview";
  activeView = name;
  document.querySelectorAll(".view-panel").forEach((node) => { node.hidden = node.id !== "view-" + name; });
  document.querySelectorAll(".nav-item").forEach((node) => node.classList.toggle("active", node.dataset.view === name));
  const labels = { overview:"Command Center",users:"User Management",wallets:"Wallets & Ledger",redemptions:"Redemptions",support:"Support",security:"Security & Risk",analytics:"Website Analytics",providers:"Provider Operations",audit:"Audit Log",lc:"LC Issuance" };
  $("page-title").textContent = labels[name];
  $("heading").textContent = labels[name];
  $("section-kicker").textContent = "OPERATIONS / " + name.toUpperCase();
  $("sidebar").classList.remove("open");
  if (name === "overview" && !overviewSnapshot) loadOverview();
  if (["providers","redemptions","security","audit","lc"].includes(name)) loadSection(name);
  if (name === "users") $("query").focus({ preventScroll: true });
}
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
document.querySelectorAll("[data-open-view]").forEach((button) => button.addEventListener("click", () => setView(button.dataset.openView)));


function renderTable(rows, columns) {
  if (!rows?.length) return '<div class="empty-state"><b>No records</b><p>No matching records exist in the current staging source.</p></div>';
  return '<div class="data"><table class="data-table"><thead><tr>' + columns.map((c)=>'<th>'+esc(c.label)+'</th>').join("") + '</tr></thead><tbody>' + rows.map((r)=>'<tr>'+columns.map((c)=>'<td>'+esc(r[c.key] == null ? "—" : (typeof r[c.key]==="object" ? JSON.stringify(r[c.key]) : r[c.key]))+'</td>').join("")+'</tr>').join("") + '</tbody></table></div>';
}
function renderCounts(obj) {
  if (!obj || !Object.keys(obj).length) return '<p class="muted">No counts available.</p>';
  return '<div class="module-grid">'+Object.entries(obj).map(([k,v])=>'<div class="metric-card"><div class="metric-label">'+esc(k)+'</div><div class="metric-value">'+esc(v)+'</div></div>').join("")+'</div>';
}
async function loadSection(view) {
  const mapping={providers:"providers",redemptions:"redemptions",security:"security",audit:"audit",lc:"lc_issuance"};
  const target=$(view==="lc"?"lc-content":view==="redemptions"?"redemption-content":view+"-content");
  if(!target)return;
  target.innerHTML='<p class="muted">Loading secure read-only data…</p>';
  try{
    const data=await api("section",{section:mapping[view]});
    if(view==="providers"){
      target.innerHTML='<h3>Provider registry</h3>'+renderTable(data.providers,[{key:"name",label:"Provider"},{key:"key",label:"Key"},{key:"type",label:"Type"},{key:"status",label:"Status"},{key:"offerCount",label:"Offers"},{key:"eventCount",label:"Events"},{key:"updatedAt",label:"Updated"}])+'<h3>Recent provider events</h3>'+renderTable(data.recentEvents,[{key:"provider",label:"Provider"},{key:"eventType",label:"Event"},{key:"status",label:"Status"},{key:"signatureValid",label:"Signature valid"},{key:"receivedAt",label:"Received"},{key:"rejectionReason",label:"Reason"}]);
    }else if(view==="redemptions"){
      target.innerHTML=renderTable(data.requests,[{key:"requestedAt",label:"Requested"},{key:"userId",label:"User ID"},{key:"amountMinor",label:"Amount (minor units)"},{key:"currency",label:"Currency"},{key:"status",label:"Status"},{key:"destinationType",label:"Destination"},{key:"recipientHint",label:"Recipient hint"},{key:"reviewReason",label:"Review"},{key:"decisionReason",label:"Decision"}]);
    }else if(view==="security"){
      target.innerHTML='<h3>Provider event status</h3>'+renderCounts(data.providerStatusCounts)+'<h3>Signature-invalid events</h3><div class="metric-card"><div class="metric-label">Signature-invalid count</div><div class="metric-value">'+esc(data.signatureInvalidCount)+'</div></div><h3>Moonetix reward statuses</h3>'+renderCounts(data.moonetixStatusCounts)+'<h3>Account deletion request statuses</h3>'+renderCounts(data.deletionStatusCounts)+'<h3>Flagged provider events</h3>'+renderTable(data.flaggedEvents,[{key:"provider",label:"Provider"},{key:"eventType",label:"Event"},{key:"status",label:"Status"},{key:"signatureValid",label:"Signature valid"},{key:"receivedAt",label:"Received"},{key:"reason",label:"Reason"}])+'<h3>Pending deletion requests</h3>'+renderTable(data.pendingDeletionRequests,[{key:"requestedAt",label:"Requested"},{key:"userId",label:"User ID"},{key:"status",label:"Status"},{key:"scheduledFor",label:"Scheduled"},{key:"blockedReason",label:"Blocked reason"}]);
    }else if(view==="audit"){
      target.innerHTML=renderTable(data.events,[{key:"createdAt",label:"Time"},{key:"actorUserId",label:"Actor ID"},{key:"actorType",label:"Actor"},{key:"action",label:"Action"},{key:"targetType",label:"Target"},{key:"targetId",label:"Target ID"},{key:"reason",label:"Reason"}]);
    }else if(view==="lc"){
      target.innerHTML='<h3>Game issuance records</h3>'+renderTable(data.issuance,[{key:"createdAt",label:"Created"},{key:"userId",label:"User ID"},{key:"sourceType",label:"Source"},{key:"sourceEventId",label:"Source ID"},{key:"amountAtoms",label:"LC atoms"},{key:"transactionId",label:"Journal transaction"}])+'<h3>LC journal transactions</h3>'+renderTable(data.transactions,[{key:"createdAt",label:"Created"},{key:"userId",label:"User ID"},{key:"eventType",label:"Event"},{key:"source",label:"Source"},{key:"status",label:"Status"},{key:"reversalOf",label:"Reversal of"},{key:"description",label:"Description"},{key:"entries",label:"Entries"}]);
    }
  }catch(error){
    target.innerHTML='<div class="empty-state"><b>Read endpoint unavailable</b><p>'+esc(error.message)+' The draft backend is not deployed yet.</p></div>';
  }
}
function setMetric(id, value) { const node = $(id); if (node) node.textContent = value == null ? "—" : fmtNum(value); }
function setNotice(message, kind = "info") {
  const node = $("notice");
  if (!message) { node.hidden = true; node.textContent = ""; return; }
  node.hidden = false;
  node.className = "notice " + kind;
  node.textContent = message;
}
async function loadOverview() {
  setNotice("Loading verified staging overview…");
  try {
    const result = await api("overview");
    overviewSnapshot = result;
    const overview = result.overview || {};
    setMetric("metric-users", overview.registeredProfiles);
    setMetric("metric-rewards", overview.rewardAllocations);
    setMetric("metric-events", overview.providerEvents);
    setMetric("metric-payouts", overview.payoutRequests);
    setMetric("metric-audit", overview.auditCount);
    setMetric("metric-game", overview.gameEventCount);
    setMetric("audit-count-inline", overview.auditCount);
    $("description").textContent = "Owner-authorized aggregate staging data. No production metrics implied.";
    const walletTotals = overview.walletTotals || [];
    $("wallet-summary").innerHTML = walletTotals.length ? walletTotals.map((w) => {
      const amount = Number(w.userNetAtoms || 0) / Number(w.scale || 1);
      const shown = amount.toLocaleString(undefined,{maximumFractionDigits:6});
      return '<div class="wallet-row"><div><b>' + esc(w.walletKind) + ' / ' + esc(w.currency) + ' / ' + esc(w.accountCode) + '</b><small>Scale ' + esc(w.scale) + ' · ' + esc(w.accountCount) + ' accounts</small></div><strong>' + esc(shown) + ' ' + esc(w.currency) + '</strong></div>';
    }).join("") : '<p class="muted">No active user wallet accounts in the verified aggregate.</p>';
    const warnings = result.dataWarnings || [];
    setNotice(warnings.length ? warnings.join(" ") : "Overview loaded from the audited owner-only read endpoint. Values are journal-derived user account totals; cash, EL and LC remain separate.");
  } catch (error) {
    overviewSnapshot = null;
    setNotice("Overview backend is not yet deployed/available: " + error.message + ". This preview shows no fabricated data.", "warning");
    ["metric-users","metric-rewards","metric-events","metric-payouts","metric-audit","metric-game","audit-count-inline"].forEach((id) => setMetric(id, null));
    $("wallet-summary").innerHTML = '<p class="muted">Wallet totals are unavailable until the owner-only overview RPC is deployed and verified.</p>';
  }
}
async function refreshCurrentView() {
  if (activeView === "overview") return loadOverview();
  if (activeView === "users") {
    const query = $("query").value.trim();
    if (query.length >= 2) return searchUsers();
  }
  if (["providers","redemptions","security","audit","lc"].includes(activeView)) return loadSection(activeView);
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
      ["Email",user.email],["Email verification",user.email_confirmed_at ? "Verified" : "Unverified"],
      ["Username",user.username],["Display name",user.display_name],["User ID",user.id],
      ["Registered",user.auth_created_at],["Last sign-in",user.last_sign_in_at],
      ["Age eligibility",user.age_eligible === true ? "Eligible" : user.age_eligible === false ? "Not eligible" : "Not recorded"],
      ["Terms accepted",user.terms_accepted_at],["Privacy accepted",user.privacy_accepted_at],
      ["Account deletion status",user.deletion_status || "No request recorded"],
      ["Active admin role",user.active_admin ? "Yes" : "No"],
      ["Profile updated",user.updated_at],["Profile deleted",user.deleted_at]
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

// The initial view is loaded only after Supabase has resolved the session.
