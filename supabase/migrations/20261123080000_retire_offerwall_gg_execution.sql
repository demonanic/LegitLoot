-- Permanently retire the legacy provider posting and metadata RPCs.
-- Keep function definitions and historical records for auditability, but remove
-- execution rights from application roles in every environment.
do $$
begin
  if to_regprocedure('private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)') is not null then
    execute 'revoke execute on function private.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated, service_role';
  end if;
  if to_regprocedure('public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text)') is not null then
    execute 'revoke execute on function public.process_offerwall_gg_postback(uuid,text,text,bigint,text,text,text,text) from public, anon, authenticated, service_role';
  end if;
  if to_regprocedure('private.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamptz)') is not null then
    execute 'revoke execute on function private.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamptz) from public, anon, authenticated, service_role';
  end if;
  if to_regprocedure('public.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamptz)') is not null then
    execute 'revoke execute on function public.record_offerwall_gg_metadata(uuid,text,text,numeric,timestamptz) from public, anon, authenticated, service_role';
  end if;
end
$$;
