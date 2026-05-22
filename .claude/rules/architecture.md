# Clean Architecture Conventions

This document defines the architectural conventions of the backend.
Even though you (Claude Code) cannot edit `server/`, you must
understand these conventions to:

- Correctly interpret backend code when reading it
- Match frontend types and patterns to backend contracts
- Avoid suggesting changes that violate the architecture

## Layer Structure

The backend follows 4 layers with strict dependency rules:
Presentation (server/api/)
↓ calls
Application (server/modules//application/)
↓ uses
Domain (server/modules//domain/)
↑ implemented by
Infrastructure (server/modules/*/infrastructure/)

**Dependency rule:** dependencies always point inward toward Domain.
Domain knows nothing about Prisma, HTTP, or any external concern.
Infrastructure implements Domain interfaces.

## Layer Responsibilities

### Domain (`server/modules/*/domain/`)
- **Entities**: classes with private props and business methods
  (e.g. `Article.publish()`)
- **Repository interfaces**: contracts the application layer depends on
- **Domain errors**: classes extending `DomainError` with `code` and
  `httpStatus`
- **Zero external dependencies** (no Prisma, no h3, no Zod)

### Application (`server/modules/*/application/`)
- **Use cases**: classes with a single `execute(input)` method
- Orchestrate domain entities and repositories
- One use case per business action (`ListArticlesUseCase`,
  `PublishArticleUseCase`, etc.)
- Depend only on Domain interfaces

### Infrastructure (`server/modules/*/infrastructure/`)
- **Repository implementations** (e.g. `PrismaArticleRepository`)
- **Mappers**: convert between Prisma rows and domain entities
- **External services**: JWT, bcrypt, Cloudinary signers, etc.

### Presentation (`server/api/`)
- **Thin HTTP handlers** using `defineEventHandler`
- Validate inputs with Zod
- Call a use case via `useContainer()`
- Format the response
- Translate domain errors to HTTP via `handleDomainError(error)`

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Entity | PascalCase singular | `Article`, `Project` |
| Use case | `verb-subject.use-case.ts` | `list-articles.use-case.ts` |
| Repository interface | `<subject>.repository.ts` | `article.repository.ts` |
| Repository impl | `prisma-<subject>.repository.ts` | `prisma-article.repository.ts` |
| Mapper | `<subject>.mapper.ts` | `article.mapper.ts` |
| Domain errors | `<subject>.errors.ts` | `article.errors.ts` |
| Route | `[param].verb.ts` | `articles/[slug].get.ts` |

## Module Structure (per feature)

Every business module under `server/modules/` follows this exact shape:

server/modules/<feature>/
├── domain/
│   ├── <feature>.entity.ts
│   ├── <feature>.repository.ts
│   └── <feature>.errors.ts
├── application/
│   └── <verb-feature>.use-case.ts (one per action)
└── infrastructure/
├── prisma-<feature>.repository.ts
└── <feature>.mapper.ts

## Shared Infrastructure

- `server/shared/prisma.ts` — singleton PrismaClient (HMR-safe)
- `server/shared/container.ts` — manual DI container (no awilix,
  no tsyringe)
- `server/shared/errors/domain.error.ts` — abstract `DomainError`
  base class
- `server/utils/use-container.ts` — `useContainer()` accessor
- `server/utils/handle-errors.ts` — `handleDomainError(error)` helper
- `server/utils/auth.ts` — `requireAdmin(event)` for protected routes

## What This Means For Frontend Work

When you read backend code to write frontend code:

1. **Domain entities are the source of truth for shapes.** If
   `Article` in `server/modules/articles/domain/article.entity.ts` has
   a `status` property, that's what the frontend type should reflect.
2. **Business rules in domain methods matter for UI.** If
   `Article.publish()` throws when already published, the admin UI
   should disable the "Publish" button for already-published articles.
3. **Route handlers tell you exact request/response shapes** via Zod
   schemas. Always check them rather than guessing.