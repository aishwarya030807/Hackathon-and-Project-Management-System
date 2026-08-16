CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','mentor')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY, title VARCHAR(160) NOT NULL, description TEXT NOT NULL, domain VARCHAR(100) NOT NULL,
  tech_stack TEXT[] NOT NULL, github_link TEXT, documentation_link TEXT, status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active','abandoned','completed','archived')),
  difficulty VARCHAR(20) NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner','intermediate','advanced')), created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS hackathons (
  id BIGSERIAL PRIMARY KEY, title VARCHAR(160) NOT NULL, organizer VARCHAR(160) NOT NULL, description TEXT NOT NULL, domain VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('online','offline','hybrid')), location VARCHAR(200), eligibility TEXT, registration_link TEXT NOT NULL,
  deadline TIMESTAMPTZ NOT NULL, prize_pool NUMERIC(14,2), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS project_adoptions (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id,project_id)
);
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE, hackathon_id BIGINT NOT NULL REFERENCES hackathons(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(user_id,hackathon_id)
);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain); CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN(tech_stack); CREATE INDEX IF NOT EXISTS idx_hackathons_deadline ON hackathons(deadline); CREATE INDEX IF NOT EXISTS idx_hackathons_domain ON hackathons(domain);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS current_maintainer_id BIGINT REFERENCES users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS maturity VARCHAR(20) NOT NULL DEFAULT 'prototype' CHECK (maturity IN ('concept','prototype','mvp','beta','production'));
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (status IN ('active','abandoned','completed','archived','revived'));
