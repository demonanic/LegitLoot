-- Phase 2 remaining user-protection foundations (staging)
create table if not exists private.reward_disputes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 provider text not null, offer_reference text, description text not null check(length(trim(description)) between 10 and 4000),
 status text not null default 'open' check(status in ('open','under_review','resolved','rejected','closed')),
 resolution text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), resolved_at timestamptz
);
alter table private.reward_disputes enable row level security;
revoke all on private.reward_disputes from anon,authenticated,public;
grant select,insert on private.reward_disputes to authenticated;
create policy reward_disputes_owner_read on private.reward_disputes for select to authenticated using(user_id=auth.uid());
create policy reward_disputes_owner_insert on private.reward_disputes for insert to authenticated with check(user_id=auth.uid() and status='open' and resolution is null and resolved_at is null);
create table if not exists private.reward_dispute_events(id bigint generated always as identity primary key, dispute_id uuid not null references private.reward_disputes(id) on delete cascade, actor_user_id uuid, actor_type text not null check(actor_type in ('player','admin','system')), event text not null, note text, created_at timestamptz not null default now());
alter table private.reward_dispute_events enable row level security;
revoke all on private.reward_dispute_events from anon,authenticated,public;
grant select on private.reward_dispute_events to authenticated;
create policy dispute_events_owner_read on private.reward_dispute_events for select to authenticated using(exists(select 1 from private.reward_disputes d where d.id=dispute_id and d.user_id=auth.uid()));
create or replace function public.submit_reward_dispute(p_provider text,p_offer_reference text,p_description text) returns uuid language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_id uuid; begin
 if v_user is null then raise exception 'Authentication required'; end if;
 if length(trim(coalesce(p_provider,'')))<2 or length(trim(coalesce(p_description,'')))<10 then raise exception 'Provider and detailed description required'; end if;
 insert into private.reward_disputes(user_id,provider,offer_reference,description) values(v_user,trim(p_provider),nullif(trim(p_offer_reference),''),trim(p_description)) returning id into v_id;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event) values(v_id,v_user,'player','submitted');
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id) values(v_user,'player','reward.dispute_submitted','reward_dispute',v_id::text); return v_id; end $$;
revoke all on function public.submit_reward_dispute(text,text,text) from public,anon; grant execute on function public.submit_reward_dispute(text,text,text) to authenticated;
create table if not exists private.retention_policy_registry(data_category text primary key, retention_days integer check(retention_days is null or retention_days>0), rationale text, approved_by_owner boolean not null default false, approved_at timestamptz, enforcement_status text not null default 'not_enforced' check(enforcement_status in ('not_enforced','dry_run','enforced')), updated_at timestamptz not null default now());
alter table private.retention_policy_registry enable row level security; revoke all on private.retention_policy_registry from public,anon,authenticated; grant all on private.retention_policy_registry to service_role,postgres;
insert into private.retention_policy_registry(data_category,rationale) values('consent_evidence','Draft schedule; owner/legal approval required'),('reward_dispute_records','Draft schedule; owner/legal approval required'),('audit_records','Draft schedule; owner/legal approval required'),('provider_event_evidence','Draft schedule; owner/legal approval required'),('inactive_account_data','Draft schedule; owner/legal approval required') on conflict(data_category) do nothing;
create or replace function public.finalize_account_deletion(p_request_id uuid) returns text language plpgsql security definer set search_path='' as $$
declare v_user uuid; v_status text; begin
 select user_id,status into v_user,v_status from private.account_deletion_requests where id=p_request_id for update;
 if v_user is null then raise exception 'Unknown request'; end if;
 if v_status='completed' then return 'completed'; end if;
 if v_status<>'data_cleared' then raise exception 'Request must be data_cleared first'; end if;
 delete from auth.users where id=v_user;
 update private.account_deletion_requests set status='completed',completed_at=now() where id=p_request_id;
 insert into private.audit_log(actor_type,action,target_type,target_id) values('system','account.deletion_identity_finalized','account_deletion_request',p_request_id::text); return 'completed'; end $$;
revoke all on function public.finalize_account_deletion(uuid) from public,anon,authenticated; grant execute on function public.finalize_account_deletion(uuid) to service_role;
