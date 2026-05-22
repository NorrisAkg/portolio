You will perform two tasks in this session, in this order:

1. Scaffold the backend folder structure (empty files and skeletons
   only, no business logic)
2. Translate the design source in `template/` into Vue 3 components
   and Nuxt pages under `app/`

**Before doing anything else, read these files:**
- `CLAUDE.md` at the project root
- `.claude/rules/architecture.md`
- `.claude/rules/frontend-conventions.md`
- `.claude/rules/jsx-to-vue-translation.md`

These are the contract for this session. They are non-negotiable.

## Task 1 — Backend scaffolding (structure only)

### Create the following directory structure

server/
├── api/                          (empty directory)
├── modules/                      (empty directory)
├── shared/
│   ├── prisma.ts                 (write fully — see below)
│   ├── container.ts              (write skeleton — see below)
│   └── errors/
│       └── domain.error.ts       (write fully — see below)
├── middleware/                   (empty directory)
├── plugins/                      (empty directory)
└── utils/
├── use-container.ts          (write fully — see below)
├── handle-errors.ts          (write fully — see below)
└── auth.ts                   (empty file with TODO comment)
shared/
├── types/                        (empty directory)
└── utils/                        (empty directory)
prisma/
├── schema.prisma                 (the developer will provide separately)
└── seed.ts                       (empty file with TODO comment)
tests/
├── unit/                         (empty directory)
├── integration/                  (empty directory)
└── fixtures/                     (empty directory)
docs/
└── adr/
├── README.md                 (ADR index — see below)
└── template.md               (copy of the template from
.claude/rules/adr-format.md)

### Exact content for the 5 files to write fully

#### `server/shared/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
```

#### `server/shared/errors/domain.error.ts`

```typescript
export abstract class DomainError extends Error {
  abstract readonly code: string
  abstract readonly httpStatus: number

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}
```

#### `server/shared/container.ts`

```typescript
// Manual DI container — will be filled as modules are added
export const container = {} as const

export type Container = typeof container
```

#### `server/utils/use-container.ts`

```typescript
import { container } from '~~/server/shared/container'

export const useContainer = () => container
```

#### `server/utils/handle-errors.ts`

```typescript
import { DomainError } from '~~/server/shared/errors/domain.error'

export const handleDomainError = (error: unknown): never => {
  if (error instanceof DomainError) {
    throw createError({
      statusCode: error.httpStatus,
      statusMessage: error.code,
      message: error.message,
    })
  }
  throw error
}
```

#### `docs/adr/README.md`

```markdown
# Architecture Decision Records

This directory contains the ADRs documenting key architectural
decisions of this project. See `.claude/rules/adr-format.md` for the
format conventions.

## Index

- 0001 — _to be written_
- 0002 — _to be written_
- 0003 — _to be written_
- 0004 — _to be written_
- 0005 — _to be written_
```

### Files left empty with a TODO comment

- `server/utils/auth.ts`: `// TODO: implement requireAdmin(event) in Phase 4`
- `prisma/seed.ts`: `// TODO: implement seed in Phase 2`

### What you must NOT do in Task 1

- ❌ Do NOT create any entity, use case, or repository file
- ❌ Do NOT create any route in `server/api/`
- ❌ Do NOT touch `prisma/schema.prisma` (the developer provides it)
- ❌ Do NOT run any Prisma command
- ❌ Do NOT run `docker compose up` or any DB-altering command
- ❌ Do NOT install new dependencies for the backend

## Task 2 — Translate `template/` to Vue components

### Step 2.1 — Analyze before coding

1. List all files in `template/`
2. Identify each file's type (HTML or JSX)
3. Identify reusable UI blocks (header, footer, cards, etc.)
4. Identify pages vs. component fragments
5. Identify any unusual imports (React libs, etc.) that need a
   decision
6. **Present this analysis to the developer and wait for validation
   before any translation work**

### Step 2.2 — Translate (after validation)

Follow the rules in `.claude/rules/jsx-to-vue-translation.md` strictly.

Organize output in `app/`:

- Pages → `app/pages/` matching Nuxt routing conventions
- Layouts → `app/layouts/`
- Reusable components → `app/components/` organized by feature
- Composables → `app/composables/` (one per concern)

### Step 2.3 — For pages that will fetch data

Use hardcoded fake data with a `// TODO: replace with useFetch(...)`
comment. **Do NOT call any `/api/*` endpoint** — the backend isn't
implemented yet.

### Step 2.4 — Components priority

Use Nuxt UI v4 components first. Only build custom components when
Nuxt UI doesn't provide an equivalent. See
`.claude/rules/frontend-conventions.md` for the list.

## Working method

1. Lis CLAUDE.md et les 3 fichiers de rules listés en haut
2. Effectue la Task 1 (scaffolding backend) sans intervention
3. Démarre la Task 2 par l'analyse de `template/`
4. Présente ton analyse, attends ma validation
5. Procède à la traduction par paliers : layouts d'abord, puis pages
   publiques, puis pages admin
6. À chaque palier, fais un point et attends confirmation avant de
   continuer

## Validation criteria (per milestone)

- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm dev` starts without console errors
- Translated pages render and visually match the template
- Internal links navigate correctly

## Final summary expected

At the end of the session, provide:

1. List of all files created or modified
2. Commands I (the developer) need to run myself, with order and
   justification (Prisma, Docker, etc.)
3. Any deviations from the template source with reasons
4. TODO comments left in the code that I should know about

Start by reading the required files, then begin Task 1. Wait for my
validation before starting Task 2.