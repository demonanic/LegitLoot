-- Phase 2 API extensions for disputes and finalizer hardening
create or replace function public.get_my_reward_disputes()
returns jsonb language sql stable security definer set search_path=''
as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',d.id,'provider',d.provider,'offerReference',d.offer_reference,'description',d.description,'status',d.status,'resolution',d.resolution,'createdAt',d.created_at,'updatedAt',d.updated_at)), '[]'::jsonb)
 from private.reward_disputes d where d.user_id=auth.uid();
$$;
revoke all on function public.get_my_reward_disputes() from public,anon; grant execute on function public.get_my_reward_disputes() to authenticated;
create or replace function public.admin_list_reward_disputes(p_status text default null)
returns jsonb language plpgsql security definer set search_path=''
as $$
begin
 if not exists(select 1 from private.admin_users a where a.user_id=auth.uid() and a.is_active) then raise exception 'Admin access required'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',d.id,'userId',d.user_id,'provider',d.provider,'offerReference',d.offer_reference,'description',d.description,'status',d.status,'resolution',d.resolution,'createdAt',d.created_at,'updatedAt',d.updated_at)), '[]'::jsonb) from private.reward_disputes d where p_status is null or d.status=p_status);
end $$;
revoke all on function public.admin_list_reward_disputes(text) from public,anon; grant execute on function public.admin_list_reward_disputes(text) to authenticated;
create or replace function public.admin_update_reward_dispute(p_id uuid,p_status text,p_resolution text,p_note text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_user uuid;
begin
 if not exists(select 1 from private.admin_users a where a.user_id=auth.uid() and a.is_active) then raise exception 'Admin access required'; end if;
 if p_status not in ('under_review','resolved','rejected','closed') then raise exception 'Invalid status'; end if;
 if length(trim(coalesce(p_note,'')))<3 then raise exception 'Audit note required'; end if;
 select user_id into v_user from private.reward_disputes where id=p_id for update;
 if v_user is null then raise exception 'Dispute not found'; end if;
 update private.reward_disputes set status=p_status,resolution=case when p_status in ('resolved','rejected') then nullif(trim(p_resolution),'') else null end,resolved_at=case when p_status in ('resolved','rejected') then now() else null end,updated_at=now() where id=p_id;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event,note) values(p_id,auth.uid(),'admin','status_changed:'||p_status,trim(p_note));
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id,reason) values(auth.uid(),'admin','reward.dispute_status_changed','reward_dispute',p_id::text,trim(p_note));
 return p_status;
end $$;
revoke all on function public.admin_update_reward_dispute(uuid,text,text,text) from public,anon; grant execute on function public.admin_update_reward_dispute(uuid,text,text,text) to authenticated;
create or replace function public.finalize_account_deletion(p_request_id uuid)
returns text language sql security definer set search_path=''
as $$ select private.complete_account_deletion(p_request_id); $$;
revoke all on function public.finalize_account_deletion(uuid) from public,anon,authenticated; grant execute on function public.finalize_account_deletion(uuid) to service_role;