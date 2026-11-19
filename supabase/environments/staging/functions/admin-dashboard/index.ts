import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,"Content-Type":"application/json","Cache-Control":"no-store"}});
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
 if(req.method!=="POST")return json({error:"Method not allowed"},405);
 const authorization=req.headers.get("Authorization");
 if(!authorization?.startsWith("Bearer "))return json({error:"Sign-in required"},401);
 const url=Deno.env.get("SUPABASE_URL"),anonKey=Deno.env.get("SUPABASE_ANON_KEY"),serviceRoleKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!anonKey||!serviceRoleKey)return json({error:"Server configuration unavailable"},503);
 const userClient=createClient(url,anonKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:auth,error:authError}=await userClient.auth.getUser(authorization.slice(7));
 if(authError||!auth.user)return json({error:"Invalid session"},401);
 let payload:{section?:string;userId?:string}={};
 try{payload=await req.json();}catch{return json({error:"Invalid request body"},400);}
 const section=payload.section||"overview";
 const admin=createClient(url,serviceRoleKey,{auth:{persistSession:false,autoRefreshToken:false}});
 // This RPC is the sole authority for administrator role and private operational data.
 // It is executable only by service_role and independently checks the supplied actor.
 const {data:base,error:baseError}=await admin.rpc("admin_dashboard_payload",{p_actor_user_id:auth.user.id,p_section:section==="accounts"?"overview":section});
 if(baseError){
  if(baseError.code==="42501")return json({error:"Administrator access required"},403);
  if(baseError.code==="22023")return json({error:baseError.message},400);
  return json({error:"Administrator data service unavailable"},503);
 }
 const role=base.role;
 const canManageAccounts=role==="owner";
 const response:Record<string,unknown>={...base,signedInEmail:auth.user.email??null,generatedAt:new Date().toISOString(),capabilities:{...(base.capabilities||{}),canManageAccounts}};
 if(section==="accounts"){
  if(!canManageAccounts)return json({error:"Owner permission required"},403);
  if(payload.userId){
   const {data:profile,error}=await admin.from("profiles").select("id,username,display_name,avatar_path,created_at,updated_at").eq("id",payload.userId).maybeSingle();
   if(error)return json({error:"Could not load selected profile"},503);
   if(!profile)return json({error:"Account profile not found"},404);
   const {data:user,error:userError}=await admin.auth.admin.getUserById(payload.userId);
   if(userError||!user.user)return json({error:"Registered account record unavailable"},404);
   response.profile={id:profile.id,email:user.user.email??null,emailConfirmed:Boolean(user.user.email_confirmed_at),lastSignInAt:user.user.last_sign_in_at??null,createdAt:user.user.created_at,username:profile.username,displayName:profile.display_name,avatarPath:profile.avatar_path,profileCreatedAt:profile.created_at,profileUpdatedAt:profile.updated_at};
  }else{
   const {data:profiles,error}=await admin.from("profiles").select("id,username,display_name,created_at").order("created_at",{ascending:false}).limit(1000);
   if(error)return json({error:"Could not load registered profiles"},503);
   const {data:users,error:userError}=await admin.auth.admin.listUsers({page:1,perPage:1000});
   if(userError)return json({error:"Could not load registered account identities"},503);
   const authById=new Map((users.users||[]).map((u:any)=>[u.id,u]));
   response.accounts=(profiles||[]).map((p:any)=>{const u:any=authById.get(p.id);return{id:p.id,email:u?.email??null,emailConfirmed:Boolean(u?.email_confirmed_at),createdAt:u?.created_at??p.created_at,username:p.username,displayName:p.display_name,isOwner:p.id===auth.user.id};});
   response.accountCount=(profiles||[]).length;
  }
 }else if(!["overview","payouts","audit"].includes(section))return json({error:"Unknown dashboard section"},400);
 return json(response);
});