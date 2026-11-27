import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={ "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"authorization, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS" };
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
 if(req.method!=="POST") return respond({error:"Method not allowed"},405);
 const url=Deno.env.get("SUPABASE_URL"), anon=Deno.env.get("SUPABASE_ANON_KEY"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anon||!key) return respond({error:"Service unavailable"},503);
 const bearer=req.headers.get("Authorization")||"";
 if(!bearer.startsWith("Bearer ")) return respond({error:"Authentication required"},401);
 const auth=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data,error}=await auth.auth.getUser(bearer.slice(7));
 if(error||!data.user) return respond({error:"Invalid session"},401);
 const admin=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:actor,error:actorErr}=await admin.schema("private").from("admin_users").select("admin_role,is_active").eq("user_id",data.user.id).maybeSingle();
 if(actorErr||!actor?.is_active||actor.admin_role!=="owner") return respond({error:"Owner access required"},403);
 let body; try{body=await req.json()}catch{return respond({error:"Invalid JSON"},400)}
 const action=body?.action;
 if(action==="search"){
  const search=String(body.search||"").trim();
  if(search.length<2||search.length>120) return respond({error:"Search must be 2–120 characters"},400);
  const {data:result,error}=await admin.rpc("admin_search_users",{p_actor_user_id:data.user.id,p_search:search,p_limit:Math.min(50,Math.max(1,Number(body.limit)||25))});
  if(error)return respond({error:"Search failed"},500);
  await admin.schema("private").from("audit_log").insert({actor_user_id:data.user.id,actor_type:"admin",action:"admin_user_search",target_type:"user_search",reason:null,metadata:{query_length:search.length,result_count:result?.results?.length||0}});
  return respond(result);
 }
 if(action==="detail"){
  const target=String(body.userId||"");
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target))return respond({error:"Invalid user ID"},400);
  const {data:result,error}=await admin.rpc("admin_user_detail",{p_actor_user_id:data.user.id,p_target_user_id:target});
  if(error)return respond({error:error.code==="P0002"?"User not found":"Detail retrieval failed"},error.code==="P0002"?404:500);
  await admin.schema("private").from("audit_log").insert({actor_user_id:data.user.id,actor_type:"admin",action:"admin_user_detail_view",target_type:"user",target_id:target,metadata:{view:"read_only_user_detail"}});
  return respond(result);
 }
 return respond({error:"Unsupported action"},400);
});