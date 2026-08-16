# Innovation Hub Backend

Production-oriented REST API for hackathon discovery and project lifecycle management. It uses **PostgreSQL and parameterized SQL (`pg`)**, as requested; Prisma is intentionally not used.

## Setup

1. Create a PostgreSQL database named `innovation_hub`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
3. Install packages: `npm install`
4. Create tables: `npm run db:init`
5. Start development server: `npm run dev`

API health check: `GET /health`  
Interactive OpenAPI docs: `http://localhost:5000/api-docs`

## Authentication and roles

Register with `POST /api/auth/register`, then send `Authorization: Bearer <token>` for protected routes. New accounts are `student` users. To create or edit hackathons, promote a trusted account manually:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## API overview

- `/api/auth` — register, login, profile
- `/api/projects` — browse, search (`q`, `domain`, `technology`, `difficulty`), create, update, delete, adoption requests, recommendations
- `/api/hackathons` — browse, search/filter (`q`, `domain`, `organizer`, `location`, `mode`, `deadlineBefore`, `deadlineAfter`, `minPrize`), admin CRUD
- `/api/bookmarks` — authenticated bookmark management
- `/api/uploads` — authenticated multipart upload, field name `file`; accepts PDF, image, or video up to 10 MB

All input validation failures return `422`; authentication/authorization errors return `401`/`403`; missing resources return `404`.
