-- Canonical source for staging migration 20261118080655 (game_platform_foundation).
-- Recovered read-only from supabase_migrations.schema_migrations.statements[1] on the
-- staging project and verified against the live catalog (docs/evidence/MIG-02_game_platform_foundation_recovery.md).
-- Already applied to staging; do NOT re-run there. Idempotent (IF NOT EXISTS / ON CONFLICT) by construction.
-- Not yet applied to production (production lineage differs; see docs/ENVIRONMENT_SOURCE_OF_TRUTH.md MIG-01).
-- The SQL below this header is byte-identical to the recorded statement.
create schema if not exists private;

create table if not exists public.game_registry (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text,
  launch_url text,
  status text not null default 'development'
    check (status in ('development', 'beta', 'live', 'disabled')),
  is_listed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb
    check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint game_registry_id_format check (id ~ '^[a-z0-9][a-z0-9_-]{1,47}$')
);

alter table public.game_registry enable row level security;
drop policy if exists "Public can view listed games" on public.game_registry;
create policy "Public can view listed games"
  on public.game_registry for select
  to anon, authenticated
  using (is_listed = true and status in ('beta', 'live'));

revoke insert, update, delete, truncate, references, trigger
  on public.game_registry from anon, authenticated;
grant select on public.game_registry to anon, authenticated;

insert into public.game_registry
  (id, slug, title, description, status, is_listed, metadata)
values
  ('zid', 'zombie-invasion-defense', 'Zombie Invasion Defense',
   'A deterministic survival defense game.', 'development', false,
   '{"save_schema_version":1,"legacy_storage_keys":["zid.salvage","zid.survivors","zid.tutorial","zid.ranges"]}'::jsonb)
on conflict (id) do nothing;

create table if not exists private.game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null references public.game_registry(id) on update cascade on delete restrict,
  schema_version integer not null check (schema_version >= 1),
  revision bigint not null default 1 check (revision >= 1),
  save_data jsonb not null check (jsonb_typeof(save_data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);

create index if not exists game_saves_user_updated_idx
  on private.game_saves (user_id, updated_at desc);

alter table private.game_saves enable row level security;
revoke all on private.game_saves from public, anon, authenticated;
grant usage on schema private to service_role;
grant all on private.game_saves to service_role;

create table if not exists private.game_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null references public.game_registry(id) on update cascade on delete restrict,
  event_type text not null check (event_type ~ '^[a-z][a-z0-9_.-]{1,63}$'),
  idempotency_key text not null check (length(idempotency_key) between 8 and 160),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  unique (user_id, game_id, idempotency_key)
);

create index if not exists game_events_user_game_created_idx
  on private.game_events (user_id, game_id, created_at desc);

alter table private.game_events enable row level security;
revoke all on private.game_events from public, anon, authenticated;
grant all on private.game_events to service_role;

create table if not exists private.game_handoff_tickets (
  ticket_hash bytea primary key check (octet_length(ticket_hash) = 32),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null references public.game_registry(id) on update cascade on delete cascade,
  target_origin text not null check (target_origin ~ '^https://[^/]+$'),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now(),
  check (expires_at > created_at)
);

create index if not exists game_handoff_tickets_expiry_idx
  on private.game_handoff_tickets (expires_at)
  where consumed_at is null;

alter table private.game_handoff_tickets enable row level security;
revoke all on private.game_handoff_tickets from public, anon, authenticated;
grant all on private.game_handoff_tickets to service_role;
