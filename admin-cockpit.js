import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const SUPABASE_URL="https://scmnxcsggquwtuyyjnnj.supabase.co";
const SUPABASE_ANON_KEY="REPLACE_WITH_PROJECT_PUBLISHABLE_KEY";
const client=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
const $=id=>document.getElementById(id);
const auth=$("auth"),app=$("app"),msg=$("msg"),results=$("results"),detail=$("detail"),details=$("details");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function call(action,payload={}){const {data:{session}}=await client.auth.getSession();if(!session)throw Error("Session expired");const r=await fetch(SUPABASE_URL+"/functions/v1/admin-cockpit",{method:"POST",headers:{Authorization:"Bearer "+session.access_token,"Content-Type":"application/json",apikey:SUPABASE_ANON_KEY},body:JSON.stringify({action,...payload})});const j=await r.json();if(!r.ok)throw Error(j.error||"Request failed");return j}
function showSession(s){auth.hidden=!!s;app.hidden=!s;if(s)$("who").textContent=s.user.email}
client.auth.onAuthStateChange((_e,s)=>showSession(s));client.auth.getSession().then(({data})=>showSession(data.session));
$("login").onclick=async()=>{ $("authmsg").textContent="";const {error}=await client.auth.signInWithPassword({email:$("email").value,password:$("password").value});$("authmsg").textContent=error?.message||"";};
$("logout").onclick=()=>client.auth.signOut();
$("search").onclick=async()=>{msg.textContent="Searching…";results.innerHTML="";detail.hidden=true;try{const j=await call("search",{search:$("query").value});msg.textContent=j.results.length+" result(s)";results.innerHTML=j.results.map(u=>'<article class="result"><strong>'+esc(u.displayName||u.username||"(no profile name)")+'</strong><div>'+esc(u.email)+'</div><small>'+esc(u.userId)+'</small><div>Balances: '+esc(JSON.stringify(u.balances))+'</div><button data-id="'+esc(u.userId)+'">View details</button></article>').join("");results.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>loadDetail(b.dataset.id));}catch(e){msg.textContent=e.message}};
$("query").addEventListener("keydown",e=>{if(e.key==="Enter")$("search").click()});
async function loadDetail(id){detail.hidden=false;details.textContent="Loading…";try{const j=await call("detail",{userId:id});details.innerHTML='<pre>'+esc(JSON.stringify(j,null,2))+'</pre>'}catch(e){details.textContent=e.message}}