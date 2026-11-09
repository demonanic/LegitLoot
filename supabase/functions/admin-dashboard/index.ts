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
 const admin=createClient(url,serviceRoleKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const db=admin.schema("private");
 const {data:adminRecord,error:roleError}=await db.from("admin_users").select("admin_role,is_active").eq("user_id",auth.user.id).maybeSingle();
 if(roleError)return json({error:"Could not verify administrator access"},503);
 if(!adminRecord?.is_active)return json({error:"Administrator access required"},403);
 let payload:{section?:string;userId?:string}={};
 try{payload=await req.json();}catch{return json({error:"Invalid request body"},400);}
 const section=payload.section||"overview",role=adminRecord.admin_role;
 const canReviewPayouts=role==="owner"||role==="payout_reviewer",canViewAudit=role==="owner",canManageAccounts=role==="owner";
 const {count:userCount,error:userCountError}=await admin.from("profiles").select("id",{count:"exact",head:true});
 if(userCountError)return json({error:"Could not load account totals"},503);
 const response:Record<string,unknown>={success:true,role,signedInEmail:auth.user.email??null,generatedAt:new Date().toISOString(),overview:{registeredProfiles:userCount??0},capabilities:{canReviewPayouts,canViewAudit,canManageAdmins:role==="owner",canManageAccounts}};
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
 }else if(section==="payouts"){
  if(!canReviewPayouts)return json({error:"Payout review permission required"},403);
  const {data:requests,error}=await db.from("payout_requests").select("id,user_id,amount_minor,currency_code,status,destination_type,recipient_hint,requested_at,review_reason,decision_reason").order("requested_at",{ascending:false}).limit(50);
  if(error)return json({error:"Could not load withdrawal queue"},503);
  const rows=requests??[],userIds=[...new Set(rows.map((r:any)=>r.user_id))],emails=new Map<string,string|null>();
  for(const id of userIds){const {data}=await admin.auth.admin.getUserById(id);emails.set(id,data?.user?.email??null);}
  response.payouts=rows.map((r:any)=>({id:r.id,userId:r.user_id,email:emails.get(r.user_id)??null,amountMinor:r.amount_minor,currency:r.currency_code,status:r.status,destinationType:r.destination_type,recipientHint:r.recipient_hint,requestedAt:r.requested_at,reviewReason:r.review_reason,decisionReason:r.decision_reason}));
  response.payoutCount=rows.length;
 }else if(section==="audit"){
  if(!canViewAudit)return json({error:"Owner permission required"},403);
  const {data:events,error}=await db.from("audit_log").select("id,actor_user_id,actor_type,action,target_type,target_id,reason,created_at").order("created_at",{ascending:false}).limit(50);
  if(error)return json({error:"Could not load audit history"},503);response.audit=events??[];
 }else if(section!=="overview")return json({error:"Unknown dashboard section"},400);
 return json(response);
});