(() => {
  const status = document.getElementById("admin-identity");
  const content = document.getElementById("admin-content");
  const sectionContent = document.getElementById("section-content");
  const heading = document.getElementById("section-heading");
  const refresh = document.getElementById("admin-refresh");
  const config = window.LEGITLOOT_SUPABASE_CONFIG;
  let client;
  let currentRole = null;
  let currentSection = "overview";
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const money = (minor, currency="USD") => new Intl.NumberFormat("en-US",{style:"currency",currency}).format(Number(minor||0)/100);
  const invoke = async (section) => {
    const {data,error} = await client.functions.invoke("admin-dashboard",{body:{section}});
    if(error) throw new Error(error.message || "Dashboard request failed");
    if(data?.error) throw new Error(data.error);
    return data;
  };
  const load = async (section="overview") => {
    currentSection = section;
    sectionContent.textContent = "Loading verified server data…";
    heading.innerHTML = "<h2>"+({overview:"OPERATIONS OVERVIEW",payouts:"WITHDRAWAL QUEUE",audit:"ADMIN AUDIT HISTORY"}[section]||"ADMIN")+"</h2>";
    try {
      const data = await invoke(section);
      currentRole = data.role;
      document.getElementById("metric-users").textContent = data.overview?.registeredProfiles ?? "—";
      document.getElementById("metric-role").textContent = data.role || "—";
      document.getElementById("metric-payouts").textContent = data.payoutCount ?? "Open queue";
      document.getElementById("audit-tab").hidden = !data.capabilities?.canViewAudit;
      if(section==="overview"){
        sectionContent.innerHTML = '<p>Administrator identity verified server-side.</p><p>Role: <span class="status">'+esc(data.role)+'</span></p><p>Registered profiles: '+esc(data.overview?.registeredProfiles ?? 0)+'</p><p class="muted">Withdrawal submission and payout execution are not enabled. This console is read-only in this build.</p>';
      } else if(section==="payouts"){
        const rows = data.payouts || [];
        document.getElementById("metric-payouts").textContent = rows.length;
        sectionContent.innerHTML = rows.length ? '<div class="table-scroll"><table class="admin-table"><thead><tr><th>Requested</th><th>Player</th><th>Amount</th><th>Rail</th><th>Destination hint</th><th>Status</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(new Date(r.requestedAt).toLocaleString())+'</td><td>'+esc(r.email||r.userId)+'</td><td>'+esc(money(r.amountMinor,r.currency))+'</td><td>'+esc(r.destinationType||"—")+'</td><td>'+esc(r.recipientHint||"—")+'</td><td class="status">'+esc(r.status)+'</td></tr>').join("")+'</tbody></table></div>' : '<p>No withdrawal requests have been submitted.</p><p class="muted">This queue is currently read-only. No approval or payout actions are available.</p>';
      } else if(section==="audit"){
        const rows=data.audit||[];
        sectionContent.innerHTML=rows.length?'<div class="table-scroll"><table class="admin-table"><thead><tr><th>Time</th><th>Actor type</th><th>Action</th><th>Target</th><th>Reason</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(new Date(r.created_at).toLocaleString())+'</td><td>'+esc(r.actor_type)+'</td><td>'+esc(r.action)+'</td><td>'+esc(r.target_type+" "+(r.target_id||""))+'</td><td>'+esc(r.reason||"—")+'</td></tr>').join("")+'</tbody></table></div>':'<p>No audit events recorded yet.</p>';
      }
    } catch(error) {
      sectionContent.textContent = error.message;
      if(!content.hidden) status.textContent = "Dashboard data could not be loaded: "+error.message;
    }
  };
  const boot = async () => {
    if(!config || config.environment!=="staging" || !window.supabase){status.textContent="Staging configuration missing. Access denied.";return;}
    client=window.supabase.createClient(config.url,config.publishableKey);
    const {data:{session},error}=await client.auth.getSession();
    if(error||!session){status.textContent="Sign in with your staging account first.";return;}
    const {data,error:verifyError}=await client.auth.getUser();
    if(verifyError||!data.user){status.textContent="Session verification failed. Sign in again.";return;}
    status.textContent="Signed in: "+(data.user.email||"verified user")+". Checking server-side administrator role…";
    try {
      const overview=await invoke("overview");
      currentRole=overview.role;
      document.getElementById("metric-users").textContent=overview.overview?.registeredProfiles??0;
      document.getElementById("metric-role").textContent=overview.role;
      document.getElementById("audit-tab").hidden=!overview.capabilities?.canViewAudit;
      content.hidden=false;
      status.textContent="Administrator access verified · "+overview.role;
      await load("overview");
    } catch(error) {
      status.textContent="Access denied or dashboard unavailable: "+error.message;
    }
  };
  document.querySelectorAll("[data-section]").forEach(button=>button.addEventListener("click",()=>{
    document.querySelectorAll("[data-section]").forEach(b=>b.classList.toggle("active",b===button));
    load(button.dataset.section);
  }));
  refresh.addEventListener("click",()=>load(currentSection));
  boot();
})();
