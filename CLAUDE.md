# Portfolio Personnel — Nuxt 4 full-stack

## Project Overview

Personal portfolio with public blog and admin back-office. The codebase
is intentionally split in two zones with different ownership:

- **Frontend (`app/`)**: built with Claude Code assistance
- **Backend (`server/`)**: hand-written by the developer to practice
  Clean Architecture without a framework

## ⚠️ Critical Boundary — Read This First

There are two zones with different rules:

### 🟢 You can READ and EDIT
- `app/` (all subfolders)
- `shared/types/`, `shared/utils/`
- `tests/` (frontend tests only)
- `docs/` (except ADRs already written, those belong to the developer)
- Root config files: `nuxt.config.ts`, `tsconfig.json`, `package.json`,
  `eslint.config.mjs`, `.env.example`

### 🟡 You can READ but NOT EDIT
- `server/` (entire backend)
- `prisma/` (schema, migrations, seed)

**Use this read access wisely:** when generating frontend code,
inspect `server/api/*` to find the exact Zod schemas and response
shapes. Inspect `prisma/schema.prisma` to align frontend types with
the actual data model. Inspect `server/modules/*/domain/` to
understand business rules that may affect UI states (e.g. an article
in DRAFT cannot be displayed publicly).

**Do not edit, refactor, or "improve" anything in `server/` or
`prisma/`** — even if you spot bugs or inefficiencies. The developer
is hand-writing this code as a learning exercise.

### 🔴 Forbidden behaviors
- Suggesting backend code changes unprompted
- Running `prisma migrate`, `prisma db push`, or any DB-altering
  command
- Adding/removing dependencies that affect the backend (e.g.
  installing a new ORM, auth library, validation lib)
- Creating new files inside `server/` or `prisma/`
- Generating tests that hit the live backend or modify the DB

If you spot a backend issue while working: write it down in
`docs/api-feedback.md` (create if missing), then continue your
frontend task with what the API provides today.

## Tech Stack

- Nuxt 4 (>= 4.3) with `app/` directory structure
- Nuxt UI v4 (free, open-source)
- TypeScript strict (Nuxt 4 multi-project setup: `app/`, `server/`,
  `shared/`, builder are 4 separate TS contexts)
- Tailwind CSS v4 (bundled with Nuxt UI v4)
- `@nuxtjs/mdc` for markdown rendering
- `@nuxt/image` + Cloudinary provider for images
- Pinia only if `useState` becomes insufficient
- Vitest for tests
- pnpm as package manager

The design source is in `template/` at the project root — a mix of
HTML and JSX files that you translate into Vue 3 components.

## Detailed Rules (consult on demand)

For specific guidance, read these files when relevant:

- `.claude/rules/architecture.md` — Clean Architecture conventions
  and module structure
- `.claude/rules/frontend-conventions.md` — Vue 3, Nuxt 4, Nuxt UI v4
  patterns for this project
- `.claude/rules/jsx-to-vue-translation.md` — Rules for translating
  the `template/` JSX files into Vue components
- `.claude/rules/adr-format.md` — Format and conventions for
  Architecture Decision Records

## Directory Map

app/                  ← FRONTEND (read + edit)
components/         Reusable UI components
composables/        useArticles(), useProjects(), useAuth(), etc.
layouts/            default, admin
pages/              Public + /admin/* protected pages
middleware/         auth.ts (client-side route guard)
plugins/
utils/
assets/css/         main.css with Tailwind + Nuxt UI imports
app.vue, app.config.ts, error.vue
shared/               ← SHARED (read + edit types/ and utils/)
types/              Article, Project, PaginatedResult, etc.
utils/              slugify, etc.
server/               ← BACKEND (read only — see Critical Boundary)
api/                Routes — read to discover endpoints + Zod schemas
modules/            Domain logic — read to understand business rules
shared/, utils/     Backend infrastructure
prisma/               ← DB SCHEMA (read only)
schema.prisma       Read to align frontend types with DB model
template/             ← DESIGN SOURCE (read only)
Mix of HTML and JSX files — to be translated into Vue components
docs/adr/             Architecture Decision Records (don't edit existing)
tests/                Frontend integration tests (Vitest)
nuxt.config.ts        Root config (you can edit)

## API Contract

The authoritative source for endpoint shapes is the actual code in
`server/api/`. Always inspect the Zod schemas in route files before
generating fetch logic. Summary for quick reference:

Public (no auth)
GET    /api/articles?page=1&limit=10
→ { data: Article[], meta: { total, page, limit, totalPages } }
GET    /api/articles/:slug              → Article (404 if not published)
GET    /api/projects?featured=true      → Project[]
GET    /api/projects/:slug              → Project
GET    /api/tags                        → Tag[]
GET    /api/technologies                → Technology[]
Admin (JWT cookie required)
POST   /api/articles                    Body: CreateArticleDto
PATCH  /api/articles/:id                Body: UpdateArticleDto
POST   /api/articles/:id/publish        → Article
DELETE /api/articles/:id                → 204
POST   /api/projects                    Body: CreateProjectDto
PATCH  /api/projects/:id
DELETE /api/projects/:id
POST   /api/upload/signature            → Cloudinary signed payload
Auth
POST   /api/auth/login                  Body: { email, password }
POST   /api/auth/logout
GET    /api/auth/me                     → AdminUser | null

Type definitions for `Article`, `Project`, `Tag`, `Technology`, etc.
live in `shared/types/`. Always import from there. If the type is
missing, add it to `shared/types/` (this is shared territory you can
edit) — but make sure the shape matches the Prisma model in
`prisma/schema.prisma`.

## How To Work In This Repo

1. **Before writing frontend code that calls the API**: read the
   matching route file in `server/api/` to confirm the Zod input
   schema and response shape. Don't guess. If the route doesn't exist
   yet (backend is incomplete), use hardcoded fake data with a
   `// TODO: replace with useFetch('/api/...')` comment.
2. **Use `useFetch` / `$fetch`** to call the API. Base path is
   relative (`/api/...`).
3. **Auth state** via `useAuth()` composable. Never call
   `/api/auth/me` directly from a component.
4. **Markdown rendering** uses `<MDC :value="content" />` — no
   `<ContentRenderer>`, no `queryCollection()`.
5. **Image uploads** in admin: get a signed payload from
   `POST /api/upload/signature`, then upload directly to Cloudinary
   from the client.
6. **Don't run** `prisma`, `pnpm migrate`, or any DB command. The
   developer handles those.
7. **Don't add** dependencies that overlap with Nuxt UI v4 (no
   shadcn-vue, no headlessui, no Naive UI). Use Nuxt UI primitives
   first.

## Verification Before Declaring A Task Done

- `pnpm lint` passes
- `pnpm typecheck` passes (Nuxt 4 has 4 TS contexts — read errors
  carefully, especially when they involve `server/` types you cannot
  fix; in that case, flag the issue and stop)
- The page renders in `pnpm dev` without console errors
- For pages that fetch data: graceful empty state and error state

## When You're Stuck

If a task is ambiguous, **ask the developer rather than assume**. The
backend boundary makes guessing especially costly here.

If you discover the API doesn't expose what you need: don't try to
add it. Document the gap in `docs/api-feedback.md` and tell the
developer.