-- IDEBP schema DESIGN DRAFT. Not applied to any database.
-- Generate a Supabase migration with the CLI, then adapt/test this in a dedicated
-- staging project. Public profile fields only; verification/contact secrets private.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  website_url text not null check (website_url ~ '^https?://'),
  canonical_domain text not null,
  publisher text,
  about text not null check (char_length(about) between 1 and 600),
  description_language text not null default 'en',
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  coverage text[] not null default '{}',
  kinds text[] not null check (cardinality(kinds)>0),
  content_types text[] not null check (cardinality(content_types)>0),
  methods text[] not null default '{}',
  topics text[] not null default '{}',
  research_languages text[] not null check (cardinality(research_languages)>0),
  editorial_process text[] not null default '{}',
  orientation text[] not null default '{}',
  access_type text not null check (access_type in ('free','mixed','paid')),
  logo_path text,
  banner_path text,
  approved_public_contacts jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft','pending_email','pending_ownership','review','published','hidden','archived')),
  provenance text not null default 'source_declared' check (provenance in ('source_declared','editor_added')),
  checked_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index source_country on public.sources(country_code) where status='published';
create index source_kinds on public.sources using gin(kinds);
create index source_languages on public.sources using gin(research_languages);
create index source_coverage on public.sources using gin(coverage);
-- Duplicate domain detection is a workflow check: one organisation may legitimately
-- have multiple separately described collections on the same domain.
create index source_domain on public.sources(canonical_domain);

create table private.source_managers (
  source_id uuid not null references public.sources on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('owner','editor')),
  granted_at timestamptz not null default now(),
  primary key(source_id,user_id)
);
create index source_manager_user on private.source_managers(user_id);
create table private.admin_roles (
  user_id uuid primary key references auth.users on delete cascade,
  state text not null default 'invited' check(state in ('invited','active','suspended')),
  must_set_password boolean not null default true,
  invited_by uuid references auth.users,
  created_at timestamptz not null default now()
);
create table private.source_verifications (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources on delete cascade,
  requested_by uuid not null references auth.users,
  kind text not null check(kind in ('email_domain','dns_txt','website_file','manual','organisation','social','affiliation')),
  state text not null default 'pending' check(state in ('pending','confirmed','rejected','expired')),
  evidence jsonb not null default '{}'::jsonb,
  token_hash text,
  expires_at timestamptz,
  decided_by uuid references auth.users,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.source_links (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources on delete cascade,
  target_source_id uuid references public.sources on delete set null,
  kind text not null check(kind in ('social','reference','society_affiliation')),
  url text not null check(url ~ '^https?://'),
  confirmed_at timestamptz,
  independent boolean not null default false,
  unique(source_id,kind,url)
);
create table public.source_translations (
  source_id uuid not null references public.sources on delete cascade,
  locale text not null,
  about text not null check(char_length(about)<=1200),
  origin text not null check(origin in ('source','human_translation','machine_draft')),
  reviewed_at timestamptz,
  primary key(source_id,locale)
);
create table public.saved_sources (
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid not null references public.sources on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,source_id)
);
create table private.recommendations (
  user_id uuid not null references auth.users on delete cascade,
  source_id uuid not null references public.sources on delete cascade,
  eligible boolean not null default false,
  created_at timestamptz not null default now(),
  primary key(user_id,source_id)
);
create table public.source_signals (
  source_id uuid primary key references public.sources on delete cascade,
  organisation_confirmed boolean not null default false,
  domain_confirmed boolean not null default false,
  confirmed_social integer not null default 0 check(confirmed_social>=0),
  independent_references integer not null default 0 check(independent_references>=0),
  eligible_recommendations integer not null default 0 check(eligible_recommendations>=0),
  calculated_at timestamptz not null default now()
);
create table private.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users on delete set null,
  action text not null,
  target_id uuid,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table private.communication_queue (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources on delete set null,
  channel text not null check(channel in ('linkedin','x','newsletter')),
  body text not null,
  state text not null default 'draft' check(state in ('draft','approved','scheduled','sent','failed','cancelled')),
  idempotency_key text not null unique,
  approved_by uuid references auth.users,
  approved_at timestamptz,
  scheduled_at timestamptz,
  provider_id text,
  created_at timestamptz not null default now()
);
create table private.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'en',
  state text not null default 'pending' check(state in ('pending','confirmed','unsubscribed')),
  consent_version text not null,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index newsletter_email_unique on private.newsletter_subscribers(lower(email));

alter table public.sources enable row level security;
alter table public.source_links enable row level security;
alter table public.source_translations enable row level security;
alter table public.saved_sources enable row level security;
alter table public.source_signals enable row level security;
alter table private.source_managers enable row level security;
alter table private.admin_roles enable row level security;
alter table private.source_verifications enable row level security;
alter table private.recommendations enable row level security;
alter table private.audit_events enable row level security;
alter table private.communication_queue enable row level security;
alter table private.newsletter_subscribers enable row level security;

revoke all on public.sources,public.source_links,public.source_translations,public.source_signals,public.saved_sources from anon,authenticated;
grant select on public.sources,public.source_links,public.source_translations,public.source_signals to anon,authenticated;
grant select,insert,delete on public.saved_sources to authenticated;
create policy public_sources_read on public.sources for select to anon,authenticated using(status='published');
create policy public_links_read on public.source_links for select to anon,authenticated using(exists(select 1 from public.sources s where s.id=source_id and s.status='published'));
create policy public_translations_read on public.source_translations for select to anon,authenticated using(reviewed_at is not null and exists(select 1 from public.sources s where s.id=source_id and s.status='published'));
create policy public_signals_read on public.source_signals for select to anon,authenticated using(exists(select 1 from public.sources s where s.id=source_id and s.status='published'));
create policy own_saves_read on public.saved_sources for select to authenticated using(user_id=(select auth.uid()));
create policy own_saves_insert on public.saved_sources for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.sources s where s.id=source_id and s.status='published'));
create policy own_saves_delete on public.saved_sources for delete to authenticated using(user_id=(select auth.uid()));

-- All source/profile/role/verification/recommendation writes go through an
-- authenticated Worker workflow, with explicit ownership/admin checks first.
-- No client policy permits self-promotion, changing ranking signals, or reading
-- private contacts. Do not put the private schema in the PostgREST exposed list.
revoke all on all tables in schema private from public,anon,authenticated;
revoke all on all sequences in schema private from public,anon,authenticated;
grant all on all tables in schema private to service_role;
grant usage,select on all sequences in schema private to service_role;
grant all on public.sources,public.source_links,public.source_translations,public.source_signals,public.saved_sources to service_role;
-- Audit records should be append-only for the application service.
revoke update,delete,truncate on private.audit_events from service_role;
commit;
