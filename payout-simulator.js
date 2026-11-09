(() => {
  const config=window.LEGITLOOT_SUPABASE_CONFIG;
  const auth=document.getElementById("sim-auth");
  const app=document.getElementById("sim-app");
  let client;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n||0)/100);
  const cents=v=>{if(!/^\d+(\.\d{1,2})?$/.test(String(v)))throw new Error("Enter a valid dollar amount with up to two decimal places.");const n=Math.round(Number(v)*100);if(!Number.isSafeInteger(n)||n<=0)throw new Error("Enter a positive amount.");return n;};
  const call=async body=>{const {data,error}=await client.functions.invoke("payout-simulator",{body});if(error)throw new Error(error.message||"Simulator request failed");if(data?.error)throw new Error(data.error);return data;};
  const message=(s)=>{auth.textContent=s;};
  const refresh=async()=>{
    const d=await call({action:"state"});
    $("sim-available").textContent=money(d.wallet.availableMinor);
    $("sim-reserved").textContent=money(d.wallet.reservedMinor);
    $("sim-paid").textContent=money(d.wallet.paidMinor);
    $("sim-issued").textContent=money(d.wallet.totalIssuedMinor);
    const rows=d.withdrawals||[];
    $("sim-queue").innerHTML=rows.length?'<table class="sim-table"><thead><tr><th>Created</th><th>Amount</th><th>Rail / label</th><th>Status</th><th>Test actions</th></tr></thead><tbody>'+rows.map(r=>{
      let actions="";
      if(r.status==="pending_review") actions='<button class="filter-chip" data-action="approve" data-id="'+esc(r.id)+'">APPROVE</button> <button class="filter-chip" data-action="reject" data-id="'+esc(r.id)+'">REJECT</button>';
      if(r.status==="approved"||r.status==="processing") actions='<button class="filter-chip" data-action="pending" data-id="'+esc(r.id)+'">PROVIDER PENDING</button> <button class="filter-chip" data-action="success" data-id="'+esc(r.id)+'">SIMULATE SUCCESS</button> <button class="filter-chip" data-action="failure" data-id="'+esc(r.id)+'">SIMULATE FAILURE</button>';
      return '<tr><td>'+esc(new Date(r.createdAt).toLocaleString())+'</td><td>'+money(r.amountMinor)+'</td><td>'+esc(r.destinationType)+'<br><span class="sim-small">'+esc(r.destinationLabel)+'</span></td><td class="sim-status">'+esc(r.status)+'</td><td>'+actions+'</td></tr>';
    }).join("")+'</tbody></table>':'<p>No simulated withdrawals yet.</p>';
    const events=d.events||[];
    $("sim-events").innerHTML=events.length?'<table class="sim-table"><thead><tr><th>Time</th><th>Event</th><th>Amount</th><th>Details</th></tr></thead><tbody>'+events.map(e=>'<tr><td>'+esc(new Date(e.createdAt).toLocaleString())+'</td><td>'+esc(e.eventType)+'</td><td>'+money(e.amountMinor)+'</td><td>'+esc(JSON.stringify(e.details||{}))+'</td></tr>').join("")+'</tbody></table>':'<p>No test events recorded.</p>';
  };
  $("issue-form").addEventListener("submit",async e=>{
    e.preventDefault();
    try{
      const amountMinor=cents($("issue-amount").value);
      const reason=$("issue-reason").value.trim();
      if(!confirm("Issue "+money(amountMinor)+" in artificial staging funds? These funds have no cash value."))return;
      const d=await call({action:"issue_funds",amountMinor,reason,idempotencyKey:crypto.randomUUID()});
      message(d.duplicate?"This issuance was already processed.":"Artificial test funds issued. No real money was created.");
      await refresh();
    }catch(err){message(err.message);}
  });
  $("withdraw-form").addEventListener("submit",async e=>{
    e.preventDefault();
    try{
      const amountMinor=cents($("withdraw-amount").value);
      if(amountMinor<50)throw new Error("Simulator minimum withdrawal is $0.50.");
      const rail=$("withdraw-rail").value;
      if(!confirm("Create a simulated "+rail+" withdrawal for "+money(amountMinor)+"? No real destination or payment will be used."))return;
      await call({action:"create_withdrawal",amountMinor,destinationType:rail,destinationLabel:"TEST: simulated "+rail+" destination",idempotencyKey:crypto.randomUUID()});
      message("Test withdrawal created and funds reserved in the isolated simulator.");
      await refresh();
    }catch(err){message(err.message);}
  });
  $("sim-queue").addEventListener("click",async e=>{
    const b=e.target.closest("button[data-action]");
    if(!b)return;
    const action=b.dataset.action,id=b.dataset.id;
    try{
      if(action==="approve"||action==="reject"){
        const reason=prompt("Enter a reason for this simulated "+action+" (at least 5 characters):");
        if(reason===null)return;
        if(reason.trim().length<5)throw new Error("A reason of at least 5 characters is required.");
        if(!confirm("Confirm simulated "+action+"? This does not contact a payment provider."))return;
        await call({action:"decide_withdrawal",withdrawalId:id,decision:action,reason});
      }else{
        const outcome=action;
        if(!confirm("Simulate provider outcome: "+outcome.toUpperCase()+"? No real provider will be contacted."))return;
        await call({action:"provider_result",withdrawalId:id,outcome});
      }
      message("Simulation updated. No real payout was attempted.");
      await refresh();
    }catch(err){message(err.message);}
  });
  $("sim-refresh").addEventListener("click",()=>refresh().catch(e=>message(e.message)));
  $("sim-signout").addEventListener("click",async()=>{await client.auth.signOut();app.hidden=true;message("SIGNED OUT · Simulator access has ended.");});
  const boot=async()=>{
    if(!config||config.environment!=="staging"||!window.supabase){message("Staging configuration missing. Access denied.");return;}
    client=window.supabase.createClient(config.url,config.publishableKey);
    const {data:{session},error}=await client.auth.getSession();
    if(error||!session){message("Sign in with your staging owner account first.");return;}
    const {data,error:verifyError}=await client.auth.getUser();
    if(verifyError||!data.user){message("Session verification failed. Sign in again.");return;}
    try{
      await call({action:"state"});
      app.hidden=false;
      message("Owner verified. Simulator is isolated from real wallets and payment providers.");
      await refresh();
    }catch(err){message("Access denied or simulator unavailable: "+err.message);}
  };
  boot();
})();