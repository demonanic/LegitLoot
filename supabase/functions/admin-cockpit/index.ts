import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigin=(origin:string)=>origin==="https://legitloot.site"||origin==="https://www.legitloot.site"||/^https:\/\/[a-z0-9-]+\.(?:legitloot|legitloot-preview)\.pages\.dev$/i.test(origin);
const corsFor=(origin:string|null)=>({ ...(origin&&allowedOrigin(origin)?{"Access-Control-Allow-Origin":origin}:{}), "Access-Control-Allow-Headers":"authorization, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS", "Vary":"Origin" });
const respond=(body:unknown,status=200,origin:string|null=null)=>new Response(JSON.stringify(body),{status,headers:{...corsFor(origin),"Content-Type":"application/json","Cache-Control":"no-store"}});
Deno.serve(async(req)=>{
 const origin=req.headers.get("Origin");
 if(req.method==="OPTIONS") return new Response("ok",{headers:corsFor(origin)});
 if(req.method!=="POST") return respond({error:"Method not allowed"},405,origin);
 const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anon||!key) return respond({error:"Service unavailable"},503,origin);
 const bearer=req.headers.get("Authorization")||"";
 if(!bearer.startsWith("Bearer ")) return respond({error:"Authentication required"},401,origin);
 const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await auth.auth.getUser(bearer.slice(7));
 if(error||!data.user) return respond({error:"Invalid session"},401,origin);
 const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 let body; try{body=await req.json()}catch{return respond({error:"Invalid JSON"},400,origin)}
 const action=body?.action;
 if(action==="overview"){
  const {data:result,error}=await admin.rpc("admin_cockpit_overview",{p_actor_user_id:data.user.id});
  if(error)return respond({error:"Overview retrieval failed"},500,origin);
  return respond(result,200,origin);
 }
 if(action==="section"){
  const section=String(body.section||"").trim();
  const allowed=["providers","redemptions","security","audit","lc_issuance"];
  if(!allowed.includes(section)) return respond({error:"Unsupported section"},400,origin);
  const {data:result,error}=await admin.rpc("admin_cockpit_section",{p_actor_user_id:data.user.id,p_section:section});
  if(error)return respond({error:"Section retrieval failed"},500,origin);
  return respond(result,200,origin);
 }
 if(action==="search"){
  const search=String(body.search||"").trim();
  if(search.length<2||search.length>120) return respond({error:"Search must be 2–120 characters"},400,origin);
  const {data:result,error}=await admin.rpc("admin_search_users",{p_actor_user_id:data.user.id,p_search:search,p_limit:Math.min(50,Math.max(1,Number(body.limit)||25))});
  if(error)return respond({error:"Search failed"},500,origin);
  return respond(result,200,origin);
 }
 if(action==="detail"){
  const target=String(body.userId||"");
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target))return respond({error:"Invalid user ID"},400,origin);
  const {data:result,error}=await admin.rpc("admin_user_detail",{p_actor_user_id:data.user.id,p_target_user_id:target});
  if(error)return respond({error:error.code==="P0002"?"User not found":"Detail retrieval failed"},error.code==="P0002"?404:500,origin);
  return respond(result,200,origin);
 }
 return respond({error:"Unsupported action"},400,origin);
});