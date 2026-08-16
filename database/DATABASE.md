# Innovara — Database Documentation

Database for the **Innovara** platform (hackathon discovery + project lifecycle
management). Built for **PostgreSQL 15+ via Supabase**, using Supabase Auth
(`auth.users`) as the identity source and Row Level Security (RLS) for
authorization.

File: `schema.sql`

## 1. Entity Overview

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users` — name, role (student/organizer/admin), skills, domains, leaderboard points |
| `hackathons` | Hackathon/competition listings created by organizers |
| `projects` | Archived student projects (code, docs, demo, presentation) |
| `project_contributors` | Who owns/maintains/contributes to a project |
| `project_hackathon_participation` | Which hackathons a project was submitted to, and the result |
| `project_versions` | Timeline entries showing how a project changed over time |
| `project_adoptions` | Requests to "revive" an abandoned project |
| `hackathon_recommendations` | Cached opportunity-matching scores between projects and hackathons |
| `leaderboard` (view) | Computed ranking of students by points, wins, and project count |

## 2. Entity-Relationship Summary

```
auth.users (Supabase) ──1:1── profiles
profiles ──1:N── hackathons (organizer_id)
profiles ──1:N── projects (created_by)
profiles ──M:N── projects            via project_contributors
projects ──M:N── hackathons          via project_hackathon_participation
projects ──1:N── project_versions
projects ──1:N── project_adoptions
projects ──M:N── hackathons          via hackathon_recommendations (matching)
```

- A **project** can participate in *many* hackathons over its life
  (`project_hackathon_participation`) — this is what powers the
  "Project Evolution Timeline" feature.
- A **project** can be adopted by a new team when the original owner
  abandons it; `project_adoptions` tracks the request/approval flow, and
  `project_contributors` is updated once an adoption is approved.
- **Opportunity matching** is precomputed into `hackathon_recommendations`
  (e.g., by a Supabase Edge Function comparing `projects.domain` against
  `hackathons.domain`) rather than computed on every page load.

## 3. Key Design Decisions

- **Enums over free text** (`project_status`, `adoption_status`, etc.) keep
  filter/status values constrained and make querying/indexing cheap.
- **Arrays + GIN indexes** (`domain`, `skills`) let us do fast "match any tag"
  filtering (`WHERE domain && ARRAY['healthtech']`) without a separate
  many-to-many tags table, since domains/skills are a small, loosely
  structured set rather than a fixed taxonomy.
- **`pg_trgm`** index on `projects.title` supports fuzzy search-as-you-type
  for the search/filter feature.
- **RLS on every table**: public data (hackathons, projects, profiles,
  leaderboard) is world-readable; writes are restricted to the
  organizer/owner/contributor via `auth.uid()` checks — no separate backend
  auth layer is required.
- **`is_open_for_adoption` flag** on `projects` lets the "abandoned projects"
  browse view be a simple indexed filter instead of a derived/computed status.

## 4. Common Queries

**Browse hackathons closing soon, filtered by domain:**
```sql
select * from hackathons
where status = 'upcoming'
  and domain && array['climate-tech']
order by registration_deadline asc;
```

**Projects open for adoption in a domain:**
```sql
select * from projects
where is_open_for_adoption = true
  and domain && array['healthtech'];
```

**A project's full evolution timeline:**
```sql
select v.version_label, v.changes_summary, h.title as hackathon, v.created_at
from project_versions v
left join hackathons h on h.id = v.hackathon_id
where v.project_id = $1
order by v.created_at asc;
```

**Top recommended hackathons for a project:**
```sql
select h.title, r.match_score
from hackathon_recommendations r
join hackathons h on h.id = r.hackathon_id
where r.project_id = $1
order by r.match_score desc
limit 5;
```

## 5. Migrating with Supabase

```bash
supabase link --project-ref <project-ref>
supabase db push          # applies schema.sql via migrations folder
```
Place `schema.sql` under `supabase/migrations/0001_init.sql` for the CLI to
pick it up, or run it directly in the Supabase SQL Editor.
