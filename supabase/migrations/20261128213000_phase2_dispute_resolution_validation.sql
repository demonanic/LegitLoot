create or replace function public.admin_update_reward_dispute(p_id uuid,p_status text,p_resolution text,p_note text)
returns text language plpgsql security definer set search_path=''
as $$
declare v_user uuid; v_old text;
begin
 if not exists(select 1 from private.admin_users a where a.user_id=auth.uid() and a.is_active) then raise exception 'Admin access required'; end if;
 if p_status not in ('under_review','resolved','rejected','closed') then raise exception 'Invalid status'; end if;
 if length(trim(coalesce(p_note,'')))<3 then raise exception 'Audit note required'; end if;
 if p_status in ('resolved','rejected') and length(trim(coalesce(p_resolution,'')))<3 then raise exception 'Resolution details required'; end if;
 select user_id,status into v_user,v_old from private.reward_disputes where id=p_id for update;
 if v_user is null then raise exception 'Dispute not found'; end if;
 update private.reward_disputes set status=p_status,resolution=case when p_status in ('resolved','rejected') then trim(p_resolution) else null end,resolved_at=case when p_status in ('resolved','rejected') then now() else null end,updated_at=now() where id=p_id;
 insert into private.reward_dispute_events(dispute_id,actor_user_id,actor_type,event,note) values(p_id,auth.uid(),'admin','status_changed:'||p_status,trim(p_note));
 insert into private.audit_log(actor_user_id,actor_type,action,target_type,target_id,reason) values(auth.uid(),'admin','reward.dispute_status_changed','reward_dispute',p_id::text,trim(p_note));
 return p_status;
end $$;
revoke all on function public.admin_update_reward_dispute(uuid,text,text,text) from public,anon; grant execute on function public.admin_update_reward_dispute(uuid,text,text,text) to authenticated;