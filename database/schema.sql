-- ============================================================================
-- INNOVARA — DATABASE SCHEMA
-- Hackathon & Project Management System
-- Target: PostgreSQL 15+ (Supabase)
-- ============================================================================
-- Design notes:
--  - `profiles` extends Supabase's built-in `auth.users` (1:1, id shared).
--  - Enum types are used instead of free-text status columns wherever the
--    set of values is fixed, to keep data clean and queries fast.
--  - Every table has `created_at` (and `updated_at` where it can change)
--    for auditing and for the "Project Evolution Timeline" feature.
--  - Row Level Security (RLS) is enabled on every table; policies are at
--    the bottom of the file, grouped by table.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "pg_trgm";        -- fuzzy / ILIKE search

-- ---------------------------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------------------------
create type user_role            as enum ('student', 'organizer', 'admin');
create type hackathon_mode       as enum ('online', 'offline', 'hybrid');
create type hackathon_status     as enum ('upcoming', 'ongoing', 'completed', 'cancelled');
create type project_status       as enum ('active', 'completed', 'abandoned', 'archived');
create type contributor_role     as enum ('owner', 'maintainer', 'contributor');
create type adoption_status      as enum ('pending', 'approved', 'rejected', 'withdrawn');
create type participation_result as enum ('winner', 'runner_up', 'finalist', 'participant', 'not_selected');

-- ---------------------------------------------------------------------------
-- PROFILES  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  email         text not null unique,
  avatar_url    text,
  bio           text,
  role          user_role not null default 'student',
  college       text,
  skills        text[] not null default '{}',      -- e.g. {'react','ml','iot'}
  domains       text[] not null default '{}',      -- interest domains for matching
  points        integer not null default 0,        -- drives the leaderboard
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);
create index idx_profiles_points on profiles(points desc);
create index idx_profiles_skills on profiles using gin(skills);

-- ---------------------------------------------------------------------------
-- HACKATHONS
-- ---------------------------------------------------------------------------
create table hackathons (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  description           text not null,
  organizer_id          uuid not null references profiles(id) on delete cascade,
  domain                text[] not null default '{}',  -- e.g. {'healthtech','climate'}
  eligibility           text,
  mode                  hackathon_mode not null default 'online',
  location              text,                           -- null when mode = online
  prize_pool            numeric(12,2),
  registration_deadline timestamptz not null,
  start_date            timestamptz not null,
  end_date              timestamptz not null,
  status                hackathon_status not null default 'upcoming',
  external_link         text,
  banner_url            text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint chk_hackathon_dates check (end_date >= start_date)
);
create index idx_hackathons_status on hackathons(status);
create index idx_hackathons_domain on hackathons using gin(domain);
create index idx_hackathons_start_date on hackathons(start_date);

-- ---------------------------------------------------------------------------
-- PROJECTS
-- ---------------------------------------------------------------------------
create table projects (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  tagline           text,
  description       text not null,
  domain            text[] not null default '{}',
  status            project_status not null default 'active',
  maturity_level    smallint not null default 1 check (maturity_level between 1 and 5),
  github_url        text,
  demo_video_url    text,
  presentation_url  text,
  report_url        text,
  cover_image_url   text,
  is_open_for_adoption boolean not null default false,
  created_by        uuid not null references profiles(id) on delete cascade,
  origin_hackathon_id uuid references hackathons(id) on delete set null, -- where it was first built
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index idx_projects_status on projects(status);
create index idx_projects_domain on projects using gin(domain);
create index idx_projects_adoption on projects(is_open_for_adoption) where is_open_for_adoption = true;
create index idx_projects_title_trgm on projects using gin (title gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- PROJECT CONTRIBUTORS  (who currently owns/maintains a project)
-- ---------------------------------------------------------------------------
create table project_contributors (
  project_id  uuid not null references projects(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  role        contributor_role not null default 'contributor',
  joined_at   timestamptz not null default now(),
  primary key (project_id, user_id)
);
create index idx_contributors_user on project_contributors(user_id);

-- ---------------------------------------------------------------------------
-- PROJECT <-> HACKATHON PARTICIPATION  (evolution across competitions)
-- A project can be submitted to multiple hackathons over its lifetime.
-- ---------------------------------------------------------------------------
create table project_hackathon_participation (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  hackathon_id  uuid not null references hackathons(id) on delete cascade,
  result        participation_result not null default 'participant',
  score         numeric(6,2),
  submitted_at  timestamptz not null default now(),
  unique (project_id, hackathon_id)
);
create index idx_participation_hackathon on project_hackathon_participation(hackathon_id);
create index idx_participation_project on project_hackathon_participation(project_id);

-- ---------------------------------------------------------------------------
-- PROJECT VERSIONS  (evolution timeline entries within a project's life)
-- ---------------------------------------------------------------------------
create table project_versions (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  version_label     text not null,             -- e.g. 'v1.0', 'Post-hackathon revamp'
  changes_summary   text not null,
  hackathon_id      uuid references hackathons(id) on delete set null,
  edited_by         uuid not null references profiles(id) on delete cascade,
  created_at        timestamptz not null default now()
);
create index idx_versions_project on project_versions(project_id, created_at);

-- ---------------------------------------------------------------------------
-- PROJECT ADOPTIONS  (reviving abandoned projects)
-- ---------------------------------------------------------------------------
create table project_adoptions (
  id                uuid primary key default gen_random_uuid(),
  project_id        uuid not null references projects(id) on delete cascade,
  requested_by      uuid not null references profiles(id) on delete cascade,
  previous_owner_id uuid references profiles(id) on delete set null,
  message           text,
  status            adoption_status not null default 'pending',
  requested_at      timestamptz not null default now(),
  resolved_at       timestamptz
);
create index idx_adoptions_project on project_adoptions(project_id);
create index idx_adoptions_status on project_adoptions(status);

-- ---------------------------------------------------------------------------
-- HACKATHON RECOMMENDATIONS  (opportunity matching cache)
-- Populated by a scheduled job / edge function that scores domain overlap
-- between a project and open hackathons; avoids recomputing on every read.
-- ---------------------------------------------------------------------------
create table hackathon_recommendations (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  hackathon_id  uuid not null references hackathons(id) on delete cascade,
  match_score   numeric(5,2) not null check (match_score between 0 and 100),
  generated_at  timestamptz not null default now(),
  unique (project_id, hackathon_id)
);
create index idx_recommendations_project on hackathon_recommendations(project_id, match_score desc);

-- ---------------------------------------------------------------------------
-- TRIGGERS — keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at   before update on profiles   for each row execute function set_updated_at();
create trigger trg_hackathons_updated_at before update on hackathons for each row execute function set_updated_at();
create trigger trg_projects_updated_at   before update on projects   for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- VIEW — Leaderboard
-- Points come from profiles.points, but this view also surfaces a live
-- count of wins/finals so the UI doesn't need a second round trip.
-- ---------------------------------------------------------------------------
create or replace view leaderboard as
select
  p.id,
  p.full_name,
  p.avatar_url,
  p.college,
  p.points,
  count(*) filter (where php.result = 'winner')    as wins,
  count(*) filter (where php.result = 'runner_up')  as runner_ups,
  count(distinct pc.project_id)                     as projects_count
from profiles p
left join project_contributors pc on pc.user_id = p.id
left join project_hackathon_participation php
  on php.project_id = pc.project_id
group by p.id
order by p.points desc, wins desc;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table profiles                       enable row level security;
alter table hackathons                     enable row level security;
alter table projects                       enable row level security;
alter table project_contributors           enable row level security;
alter table project_hackathon_participation enable row level security;
alter table project_versions               enable row level security;
alter table project_adoptions              enable row level security;
alter table hackathon_recommendations      enable row level security;

-- profiles: public read (needed for leaderboard/profiles pages), owner-only write
create policy "profiles_select_all" on profiles
  for select using (true);
create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- hackathons: public read; only the organizer (or admin) can write
create policy "hackathons_select_all" on hackathons
  for select using (true);
create policy "hackathons_insert_organizer" on hackathons
  for insert with check (
    auth.uid() = organizer_id
    and exists (select 1 from profiles where id = auth.uid() and role in ('organizer','admin'))
  );
create policy "hackathons_update_own" on hackathons
  for update using (auth.uid() = organizer_id);
create policy "hackathons_delete_own" on hackathons
  for delete using (auth.uid() = organizer_id);

-- projects: public read; only contributors can write
create policy "projects_select_all" on projects
  for select using (true);
create policy "projects_insert_creator" on projects
  for insert with check (auth.uid() = created_by);
create policy "projects_update_contributors" on projects
  for update using (
    exists (
      select 1 from project_contributors pc
      where pc.project_id = id and pc.user_id = auth.uid()
    )
  );

-- project_contributors: public read; owners/maintainers manage membership
create policy "contributors_select_all" on project_contributors
  for select using (true);
create policy "contributors_manage_owner" on project_contributors
  for all using (
    exists (
      select 1 from project_contributors pc
      where pc.project_id = project_contributors.project_id
        and pc.user_id = auth.uid()
        and pc.role in ('owner','maintainer')
    )
  );

-- participation, versions, recommendations: public read, contributor write
create policy "participation_select_all" on project_hackathon_participation
  for select using (true);
create policy "participation_insert_contributor" on project_hackathon_participation
  for insert with check (
    exists (select 1 from project_contributors pc
            where pc.project_id = project_id and pc.user_id = auth.uid())
  );

create policy "versions_select_all" on project_versions
  for select using (true);
create policy "versions_insert_contributor" on project_versions
  for insert with check (
    exists (select 1 from project_contributors pc
            where pc.project_id = project_id and pc.user_id = auth.uid())
  );

create policy "recommendations_select_all" on hackathon_recommendations
  for select using (true);

-- adoptions: requester and current contributors can see/manage a request
create policy "adoptions_select_involved" on project_adoptions
  for select using (
    auth.uid() = requested_by
    or exists (select 1 from project_contributors pc
               where pc.project_id = project_id and pc.user_id = auth.uid())
  );
create policy "adoptions_insert_any_authenticated" on project_adoptions
  for insert with check (auth.uid() = requested_by);
create policy "adoptions_update_owner" on project_adoptions
  for update using (
    exists (select 1 from project_contributors pc
            where pc.project_id = project_id and pc.user_id = auth.uid()
              and pc.role in ('owner','maintainer'))
  );
