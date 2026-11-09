(() => {
 const status=document.getElementById("admin-identity"),content=document.getElementById("admin-content"),sectionContent=document.getElementById("section-content"),heading=document.getElementById("section-heading"),refresh=document.getElementById("admin-refresh"),config=window.LEGITLOOT_SUPABASE_CONFIG;
 let client,currentSection="overview";
 const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
 const money=(n,c="USD")=>new Intl.NumberFormat("en-US",{style:"currency",currency:c}).format(Number(n||0)/100);
 const invoke=async(section,extra={})=>{const {data,error}=await client.functions.invoke("admin-dashboard",{body:{section,...extra}});if(error)throw new Error(error.message||"Dashboard request failed");if(data?.error)throw new Error(data.error);return data;};
 const showProfile=async id=>{sectionContent.textContent="Loading verified profile…";try{const d=await invoke("accounts",{userId:id}),p=d.profile;sectionContent.innerHTML='<div class="admin-card"><small>PLAYER PROFILE · READ ONLY</small><h2>'+esc(p.displayName||p.username||"Unnamed player")+'</h2><p>Email: '+esc(p.email||"Unavailable")+'</p><p>Username: '+esc(p.username||"Not set")+'</p><p>Account ID: <code>'+esc(p.id)+'</code></p><p>Email confirmed: '+(p.emailConfirmed?"Yes":"No")+'</p><p>Registered: '+esc(new Date(p.createdAt).toLocaleString())+'</p><p>Last sign-in: '+esc(p.lastSignInAt?new Date(p.lastSignInAt).toLocaleString():"Not recorded")+'</p><p class="muted">Read-only profile view. Passwords, authentication secrets, and private credentials are never exposed.</p><button id="accounts-back" class="filter-chip" type="button">BACK TO PLAYER LIST</button></div>';document.getElementById("accounts-back").addEventListener("click",()=>load("accounts"));}catch(e){sectionContent.textContent=e.message;}};
 const load=async(section="overview")=>{
  currentSection=section;sectionContent.textContent="Loading verified server data…";
  heading.innerHTML="<h2>"+({overview:"OPERATIONS OVERVIEW",payouts:"WITHDRAWAL QUEUE",audit:"ADMIN AUDIT HISTORY",accounts:"REGISTERED PLAYER ACCOUNTS"}[section]||"ADMIN")+"</h2>";
  try{
   const d=await invoke(section);
   document.getElementById("metric-users").textContent=d.overview?.registeredProfiles??"—";
   document.getElementById("metric-role").textContent=d.role||"—";
   document.getElementById("metric-payouts").textContent=d.payoutCount??"Open queue";
   document.getElementById("audit-tab").hidden=!d.capabilities?.canViewAudit;
   document.getElementById("accounts-tab").hidden=!d.capabilities?.canManageAccounts;
   if(section==="overview")sectionContent.innerHTML='<p>Administrator identity verified server-side.</p><p>Role: <span class="status">'+esc(d.role)+'</span></p><p>Registered profiles: '+esc(d.overview?.registeredProfiles??0)+'</p><p class="muted">Real withdrawals and payout execution remain disabled. Use the isolated staging payout simulator for artificial funds and simulated outcomes.</p>';
   else if(section==="accounts"){
    if(d.profile){await showProfile(d.profile.id);return;}
    const rows=d.accounts||[];
    sectionContent.innerHTML='<p>Registered accounts: '+esc(d.accountCount??rows.length)+'</p><div class="table-scroll"><table class="admin-table"><thead><tr><th>Player</th><th>Email</th><th>Verified</th><th>Registered</th><th>Profile</th></tr></thead><tbody>'+rows.map(a=>'<tr><td>'+esc(a.displayName||a.username||"Unnamed player")+(a.isOwner?' <span class="status">OWNER</span>':"")+'</td><td>'+esc(a.email||"Unavailable")+'</td><td>'+(a.emailConfirmed?"Yes":"No")+'</td><td>'+esc(new Date(a.createdAt).toLocaleDateString())+'</td><td><button class="filter-chip" data-profile-id="'+esc(a.id)+'" type="button">VIEW PROFILE</button></td></tr>').join("")+'</tbody></table></div><p class="muted">Automatically populated from registered profiles. Refresh to load newly registered players.</p>';
    sectionContent.querySelectorAll("[data-profile-id]").forEach(b=>b.addEventListener("click",()=>showProfile(b.dataset.profileId)));
   }else if(section==="payouts"){
    const rows=d.payouts||[];document.getElementById("metric-payouts").textContent=rows.length;
    sectionContent.innerHTML=rows.length?'<div class="table-scroll"><table class="admin-table"><thead><tr><th>Requested</th><th>Player</th><th>Amount</th><th>Rail</th><th>Destination hint</th><th>Status</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(new Date(r.requestedAt).toLocaleString())+'</td><td>'+esc(r.email||r.userId)+'</td><td>'+esc(money(r.amountMinor,r.currency))+'</td><td>'+esc(r.destinationType||"—")+'</td><td>'+esc(r.recipientHint||"—")+'</td><td class="status">'+esc(r.status)+'</td></tr>').join("")+'</tbody></table></div>':'<p>No withdrawal requests have been submitted.</p><p class="muted">Read-only. No payout action is available.</p>';
   }else if(section==="audit"){const rows=d.audit||[];sectionContent.innerHTML=rows.length?'<div class="table-scroll"><table class="admin-table"><thead><tr><th>Time</th><th>Actor type</th><th>Action</th><th>Target</th><th>Reason</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(new Date(r.created_at).toLocaleString())+'</td><td>'+esc(r.actor_type)+'</td><td>'+esc(r.action)+'</td><td>'+esc(r.target_type+" "+(r.target_id||""))+'</td><td>'+esc(r.reason||"—")+'</td></tr>').join("")+'</tbody></table></div>':'<p>No audit events recorded yet.</p>';}
  }catch(e){sectionContent.textContent=e.message;if(!content.hidden)status.textContent="Dashboard data could not be loaded: "+e.message;}
 };
 const boot=async()=>{
  if(!config||config.environment!=="staging"||!window.supabase){status.textContent="Staging configuration missing. Access denied.";return;}
  client=window.supabase.createClient(config.url,config.publishableKey);
  const {data:{session},error}=await client.auth.getSession();if(error||!session){status.textContent="Sign in with your staging owner account first.";return;}
  const {data,error:verifyError}=await client.auth.getUser();if(verifyError||!data.user){status.textContent="Session verification failed. Sign in again.";return;}
  status.textContent="Signed in: "+(data.user.email||"verified user")+". Checking server-side administrator role…";
  try{const d=await invoke("overview");document.getElementById("metric-users").textContent=d.overview?.registeredProfiles??0;document.getElementById("metric-role").textContent=d.role;document.getElementById("audit-tab").hidden=!d.capabilities?.canViewAudit;document.getElementById("accounts-tab").hidden=!d.capabilities?.canManageAccounts;content.hidden=false;status.textContent="Administrator access verified · "+d.role;await load("overview");}catch(e){status.textContent="Access denied or dashboard unavailable: "+e.message;}
 };
 document.querySelectorAll("[data-section]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-section]").forEach(x=>x.classList.toggle("active",x===b));load(b.dataset.section);}));
 refresh.addEventListener("click",()=>load(currentSection));boot();
})();