-- Phase 2 hardening: bounded dispute intake and monotonic status transitions.
-- Staging PR migration. No data destruction.
create or replace function public.submit_reward_dispute(p_provider text,p_offer_reference text,p_description text)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid(); v_id uuid; v_count integer;
begin
 if v_user is null then raise exception 'Authentication required'; end if;
 if length(trim(coalesce(p_provider,'')))<2 or length(trim(p_provider))>120 then raise exception 'Provider must be 2-120 characters'; end if;
 if p_offer_reference is not null and length(trim(p_offer_reference))>200 then raise exception 'Offer reference too long'; end if;
 if length(trim(coalesce(p_description,'')))<10 or length(trim(p_description))>4000 then raise exception 'Description must be 10-4000 characters'; end if;
 select count(*) into v_count from private.reward_disputes where user_id=v_user and created_at >= now()-interval '24 hours';
 if v_count>=3 then raise exception 'Dispute submission limit reached; try again later'; end if;
 insert into private.reward_disputes(user_id,provider,offer_reference,description)
 values(v_user,trim(p_provider),nullif(trim(p_offer_reference),''),trim(p_description)) returning id into v_id;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event) values(v_id,v_user,'player','submitted');
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id) values(v_user,'player','reward.dispute_submitted','reward_dispute',v_id::text);
 return v_id;
end $$;
revoke all on function public.submit_reward_dispute(text,text,text) from public,anon;
grant execute on function public.submit_reward_dispute(text,text,text) to authenticated;

create or replace function public.admin_update_reward_dispute(p_id uuid,p_status text,p_resolution text,p_note text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_user uuid; v_old text;
begin
 if not exists(select 1 from private.admin_users a where a.user_id=auth.uid() and a.is_active) then raise exception 'Admin access required'; end if;
 if p_status not in ('under_review','resolved','rejected','closed') then raise exception 'Invalid status'; end if;
 if length(trim(coalesce(p_note,'')))<3 or length(trim(p_note))>2000 then raise exception 'Audit note required and limited to 2000 characters'; end if;
 if p_status in ('resolved','rejected') and length(trim(coalesce(p_resolution,'')))<3 then raise exception 'Resolution required'; end if;
 if p_resolution is not null and length(p_resolution)>4000 then raise exception 'Resolution too long'; end if;
 select user_id,status into v_user,v_old from private.reward_disputes where id=p_id for update;
 if v_user is null then raise exception 'Dispute not found'; end if;
 if v_old in ('resolved','rejected','closed') then raise exception 'Terminal dispute status cannot be reopened or changed'; end if;
 if v_old='open' and p_status not in ('under_review','resolved','rejected','closed') then raise exception 'Invalid transition'; end if;
 if v_old='under_review' and p_status not in ('resolved','rejected','closed') then raise exception 'Invalid transition'; end if;
 update private.reward_disputes set status=p_status,
   resolution=case when p_status in ('resolved','rejected') then trim(p_resolution) else null end,
   resolved_at=case when p_status in ('resolved','rejected','closed') then now() else null end,
   updated_at=now()
 where id=p_id;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event,note) values(p_id,auth.uid(),'admin','status_changed:'||p_status,trim(p_note));
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id,reason) values(auth.uid(),'admin','reward.dispute_status_changed','reward_dispute',p_id::text,trim(p_note));
 return p_status;
end $$;
revoke all on function public.admin_update_reward_dispute(uuid,text,text,text) from public,anon;
grant execute on function public.admin_update_reward_dispute(uuid,text,text,text) to authenticated;
