# Innovara — Database Testing Plan

Covers constraint testing, RLS testing, and functional testing for
`schema.sql`. Run these against a scratch Supabase project or local
`supabase start` instance — never against production data.

## 1. Constraint & Integrity Tests

| # | Test | Expected Result |
|---|---|---|
| 1 | Insert a `hackathon` with `end_date < start_date` | Rejected (`chk_hackathon_dates`) |
| 2 | Insert a `project` with `maturity_level = 6` | Rejected (`check (maturity_level between 1 and 5)`) |
| 3 | Insert a `hackathon_recommendations` row with `match_score = 150` | Rejected (`check (match_score between 0 and 100)`) |
| 4 | Insert duplicate `(project_id, hackathon_id)` into `project_hackathon_participation` | Rejected (`unique` constraint) |
| 5 | Delete a `profiles` row that owns a project | Cascades: project's `created_by` FK cascades per schema (`on delete cascade`) — confirm this is the desired behavior before going live, since it also deletes the project |
| 6 | Delete a `hackathons` row referenced by `projects.origin_hackathon_id` | `origin_hackathon_id` set to `null` (`on delete set null`), project itself is preserved |
| 7 | Insert a `project_contributors` row with a duplicate `(project_id, user_id)` | Rejected (composite primary key) |

Sample:
```sql
-- Test 1
insert into hackathons (title, description, organizer_id, registration_deadline, start_date, end_date)
values ('Bad Dates', 'test', '<organizer-uuid>', now(), now(), now() - interval '1 day');
-- expect: violates check constraint "chk_hackathon_dates"
```

## 2. Row Level Security Tests

Use `supabase.auth.signInWithPassword` (or the SQL editor's "Run as user")
to switch roles between tests.

| # | Actor | Action | Expected |
|---|---|---|---|
| 1 | Anonymous | `select * from projects` | Allowed (public read) |
| 2 | Anonymous | `insert into projects (...)` | Denied |
| 3 | Student A | Update Student B's `profiles` row | Denied |
| 4 | Student A | Update own `profiles` row | Allowed |
| 5 | Organizer | Insert a `hackathons` row with `organizer_id = auth.uid()` | Allowed |
| 6 | Organizer | Insert a `hackathons` row with someone else's `organizer_id` | Denied |
| 7 | Non-contributor | Update a `project` they don't contribute to | Denied |
| 8 | Contributor (role=contributor) | Add another user to `project_contributors` | Denied (only `owner`/`maintainer` can) |
| 9 | Owner | Add a new contributor | Allowed |
| 10 | Any authenticated user | Insert a `project_adoptions` request | Allowed |
| 11 | Requester of an adoption | View their own request | Allowed |
| 12 | Unrelated user | View someone else's adoption request | Denied |

## 3. Functional / Feature Tests

- **Search & filter**: verify `ILIKE` / trigram search on `projects.title`
  returns partial matches (e.g. `'inno'` matches `'Innovara Tracker'`).
- **Opportunity matching**: seed a project with `domain = {'healthtech'}`
  and a hackathon with `domain = {'healthtech','fintech'}`; confirm the
  `&&` overlap query returns the hackathon.
- **Evolution timeline**: insert 3 `project_versions` rows across 2
  hackathons for one project; confirm the timeline query (Section 4 of
  `DATABASE.md`) returns them in chronological order with hackathon
  titles joined correctly.
- **Adoption flow**: create a project, mark `is_open_for_adoption = true`,
  submit an adoption request, approve it, then confirm the new owner
  appears in `project_contributors` and the original owner's role is
  updated (this transition should be handled by an application-level
  function/RPC — see Section 4 below).
- **Leaderboard view**: seed 2 profiles with different `points` and
  hackathon results; confirm `select * from leaderboard order by points desc`
  ranks correctly and `wins`/`runner_ups` counts match seeded results.

## 4. Suggested Follow-Up (Application Layer)

The schema intentionally does **not** auto-transfer contributor rows when
an adoption is approved — that's a multi-step operation (update
`project_adoptions.status`, insert into `project_contributors`, optionally
demote/remove the old owner) that should be a single Postgres function
(`security definer`) or Supabase Edge Function so it runs atomically:

```sql
create or replace function approve_adoption(adoption_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  a project_adoptions%rowtype;
begin
  select * into a from project_adoptions where id = adoption_id;

  update project_adoptions
    set status = 'approved', resolved_at = now()
    where id = adoption_id;

  insert into project_contributors (project_id, user_id, role)
    values (a.project_id, a.requested_by, 'owner')
    on conflict (project_id, user_id) do update set role = 'owner';

  update projects set is_open_for_adoption = false where id = a.project_id;
end;
$$;
```
Test this function directly once added, including the case where the
adoption is already resolved (should be idempotent or reject re-approval).
