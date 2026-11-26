import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const headers={ "content-type":"application/json" };
Deno.serve(async(req:Request)=>{
 if(req.method!=="POST") return new Response("Method not allowed",{status:405});
 const expected=Deno.env.get("ACCOUNT_DELETION_JOB_SECRET");
 if(!expected||req.headers.get("x-account-deletion-job-secret")!==expected) return new Response("Unauthorized",{status:401});
 const url=Deno.env.get("SUPABASE_URL"), key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 if(!url||!key) return new Response("Missing configuration",{status:500});
 const sb=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}});
 const {data:requests,error}=await sb.schema("private").from("account_deletion_requests").select("id,user_id,status,scheduled_for").in("status",["pending","blocked","data_cleared"]).lte("scheduled_for",new Date().toISOString()).order("scheduled_for",{ascending:true}).limit(25);
 if(error) return new Response(JSON.stringify({error:"Query failed"}),{status:500,headers});
 const results=[];
 for(const r of requests??[]){
  try{
   let status=r.status;
   if(status!=="data_cleared"){const {data,error}=await sb.schema("private").rpc("process_account_deletion",{p_request_id:r.id});if(error)throw error;status=data;}
   if(status==="blocked"){results.push({id:r.id,status});continue;}
   if(status==="data_cleared"){
    // Soft deletion; SQL profile/wallet guards provide immediate application-level lockout.
    // JWTs already issued may remain valid until expiry. Never hard-delete Auth or ledger data.
    const {error:e}=await sb.auth.admin.deleteUser(r.user_id,true);if(e&&!/not found|deleted/i.test(e.message))throw e;
    const {data:done,error:c}=await sb.schema("private").rpc("complete_account_deletion",{p_request_id:r.id});if(c)throw c;
    results.push({id:r.id,status:done});
   }else results.push({id:r.id,status});
  }catch(_){results.push({id:r.id,status:"retry_required"});}
 }
 return new Response(JSON.stringify({processed:results.length,results}),{status:200,headers});
});
