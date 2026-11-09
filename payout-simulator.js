(() => {
  const config=window.LEGITLOOT_SUPABASE_CONFIG,auth=document.getElementById("sim-auth"),app=document.getElementById("sim-app");
  let client,targets=[],selectedTarget="";
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(Number(n||0)/100);
  const cents=v=>{if(!/^\d+(\.\d{1,2})?$/.test(String(v)))throw new Error("Enter a valid dollar amount with up to two decimal places.");const n=Math.round(Number(v)*100);if(!Number.isSafeInteger(n)||n<=0)throw new Error("Enter a positive amount.");return n;};
  const call=async body=>{const {data,error}=await client.functions.invoke("payout-simulator",{body});if(error)throw new Error(error.message||"Simulator request failed");if(data?.error)throw new Error(data.error);return data;};
  const message=s=>{auth.textContent=s;};
  const targetName=()=>targets.find(t=>t.id===selectedTarget)?.label||"selected player";
  const refresh=async()=>{
    if(!selectedTarget)return;
    const d=await call({action:"state",targetUserId:selectedTarget});
    $("sim-available").textContent=money(d.wallet.availableMinor);$("sim-reserved").textContent=money(d.wallet.reservedMinor);
    $("sim-paid").textContent=money(d.wallet.paidMinor);$("sim-issued").textContent=money(d.wallet.totalIssuedMinor);
    const rows=d.withdrawals||[];
    $("sim-queue").innerHTML=rows.length?'<table class="sim-table"><thead><tr><th>Created</th><th>Amount</th><th>Rail / label</th><th>Status</th><th>Test actions</th></tr></thead><tbody>'+rows.map(r=>{
      let actions="";
      if(r.status==="pending_review")actions='<button class="filter-chip" data-action="approve" data-id="'+esc(r.id)+'">APPROVE</button> <button class="filter-chip" data-action="reject" data-id="'+esc(r.id)+'">REJECT</button>';
      if(r.status==="approved"||r.status==="processing")actions='<button class="filter-chip" data-action="pending" data-id="'+esc(r.id)+'">PROVIDER PENDING</button> <button class="filter-chip" data-action="success" data-id="'+esc(r.id)+'">SIMULATE SUCCESS</button> <button class="filter-chip" data-action="failure" data-id="'+esc(r.id)+'">SIMULATE FAILURE</button>';
      return '<tr><td>'+esc(new Date(r.createdAt).toLocaleString())+'</td><td>'+money(r.amountMinor)+'</td><td>'+esc(r.destinationType)+'<br><span class="sim-small">'+esc(r.destinationLabel)+'</span></td><td class="sim-status">'+esc(r.status)+'</td><td>'+actions+'</td></tr>';
    }).join("")+'</tbody></table>':'<p>No simulated withdrawals for this player.</p>';
    const events=d.events||[];
    $("sim-events").innerHTML=events.length?'<table class="sim-table"><thead><tr><th>Time</th><th>Event</th><th>Amount</th><th>Details</th></tr></thead><tbody>'+events.map(e=>'<tr><td>'+esc(new Date(e.createdAt).toLocaleString())+'</td><td>'+esc(e.eventType)+'</td><td>'+money(e.amountMinor)+'</td><td>'+esc(JSON.stringify(e.details||{}))+'<br><span class="sim-small">Actor: '+esc(e.actorUserId||"owner")+'</span></td></tr>').join("")+'</tbody></table>':'<p>No test events recorded for this player.</p>';
    $("target-player-status").textContent="Viewing isolated simulator data for "+targetName()+".";
  };
  const loadTargets=async()=>{
    const d=await call({action:"targets"});targets=(d.accounts||[]).map(p=>({...p,label:p.displayName||p.username||("Player "+p.id.slice(0,8))}));
    const select=$("target-player");
    select.innerHTML=targets.map(p=>'<option value="'+esc(p.id)+'">'+esc(p.label)+(p.username&&p.displayName?" · @"+esc(p.username):"")+'</option>').join("");
    if(!targets.length)throw new Error("No registered player profiles were returned.");
    selectedTarget=targets[0].id;select.value=selectedTarget;
  };
  $("target-player").addEventListener("change",async e=>{selectedTarget=e.target.value;try{await refresh();message("Target changed. Simulator data is now scoped to "+targetName()+".");}catch(err){message(err.message);}});
  $("issue-form").addEventListener("submit",async e=>{
    e.preventDefault();try{const amountMinor=cents($("issue-amount").value),reason=$("issue-reason").value.trim();
      if(!confirm("Issue "+money(amountMinor)+" in artificial staging funds to "+targetName()+"? These funds have no cash value."))return;
      const d=await call({action:"issue_funds",targetUserId:selectedTarget,amountMinor,reason,idempotencyKey:crypto.randomUUID()});
      message(d.duplicate?"This issuance was already processed.":"Artificial test funds issued to "+targetName()+". No real money was created.");await refresh();
    }catch(err){message(err.message);}
  });
  $("withdraw-form").addEventListener("submit",async e=>{
    e.preventDefault();try{const amountMinor=cents($("withdraw-amount").value);if(amountMinor<1000)throw new Error("Simulator minimum withdrawal is $10.00.");
      const rail=$("withdraw-rail").value;if(!confirm("Create a simulated "+rail+" withdrawal for "+money(amountMinor)+" for "+targetName()+"? No real destination or payment will be used."))return;
      await call({action:"create_withdrawal",targetUserId:selectedTarget,amountMinor,destinationType:rail,destinationLabel:"TEST: simulated "+rail+" destination",idempotencyKey:crypto.randomUUID()});
      message("Test withdrawal created for "+targetName()+". No real payout was attempted.");await refresh();
    }catch(err){message(err.message);}
  });
  $("sim-queue").addEventListener("click",async e=>{
    const b=e.target.closest("button[data-action]");if(!b)return;const action=b.dataset.action,id=b.dataset.id;
    try{if(action==="approve"||action==="reject"){const reason=prompt("Enter a reason for this simulated "+action+" (at least 5 characters):");if(reason===null)return;if(reason.trim().length<5)throw new Error("A reason of at least 5 characters is required.");
      if(!confirm("Confirm simulated "+action+" for "+targetName()+"? This does not contact a payment provider."))return;
      await call({action:"decide_withdrawal",targetUserId:selectedTarget,withdrawalId:id,decision:action,reason});
    }else{if(!confirm("Simulate provider outcome: "+action.toUpperCase()+" for "+targetName()+"? No real provider will be contacted."))return;
      await call({action:"provider_result",targetUserId:selectedTarget,withdrawalId:id,outcome:action});}
      message("Simulation updated for "+targetName()+". No real payout was attempted.");await refresh();
    }catch(err){message(err.message);}
  });
  $("sim-refresh").addEventListener("click",()=>refresh().catch(e=>message(e.message)));
  $("sim-signout").addEventListener("click",async()=>{await client.auth.signOut();app.hidden=true;message("SIGNED OUT · Simulator access has ended.");});
  const boot=async()=>{
    if(!config||config.environment!=="staging"||!window.supabase){message("Staging configuration missing. Access denied.");return;}
    client=window.supabase.createClient(config.url,config.publishableKey);
    const {data:{session},error}=await client.auth.getSession();if(error||!session){message("Sign in with your staging owner account first.");return;}
    const {data,error:verifyError}=await client.auth.getUser();if(verifyError||!data.user){message("Session verification failed. Sign in again.");return;}
    try{await loadTargets();await refresh();app.hidden=false;message("Owner verified. Simulator is isolated from real wallets and payment providers.");}
    catch(err){message("Access denied or simulator unavailable: "+err.message);}
  };
  boot();
})();