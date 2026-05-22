# Architecture Decision Records (ADR) Format

ADRs document significant architectural decisions, why they were made,
and what was considered. They live in `docs/adr/` and are numbered
sequentially.

## File naming

`NNNN-kebab-case-title.md` where NNNN is a 4-digit zero-padded number.

Examples:
- `0001-clean-archi-without-framework.md`
- `0002-nuxt-fullstack-instead-of-separate-backend.md`
- `0005-no-nuxt-content.md`

## Template

```markdown
# ADR NNNN — <Title>

- **Status**: Accepted | Superseded by ADR NNNN | Deprecated
- **Date**: YYYY-MM-DD
- **Author**: <name>

## Context

What is the situation that requires a decision? What forces are at
play? Keep this factual — no opinions yet.

## Decision

What did we decide? State it in 1-3 sentences, then explain.

## Consequences

### Positive
- ...
- ...

### Negative
- ...
- ...

### Neutral
- ...

## Alternatives considered

### Alternative 1: <name>
Brief description and why we rejected it.

### Alternative 2: <name>
Brief description and why we rejected it.

## References

- Link to related ADRs
- External docs or articles that informed the decision
```

## Writing guidelines

- **Keep it short.** 1 page maximum, ideally less. Long ADRs don't
  get read.
- **Factual context, opinionated decision.** The Context section
  describes reality, the Decision section is where you commit.
- **Be honest about negatives.** An ADR with only positive consequences
  is a marketing pitch, not a decision record. Every choice has
  trade-offs.
- **List 2-3 alternatives minimum.** "We chose X because of reasons"
  is worth less than "We considered X, Y, Z and chose X because of
  these specific trade-offs."
- **Date it.** A 2-year-old ADR may be stale.
- **Don't revise accepted ADRs.** If circumstances change, write a
  new ADR that supersedes the old one.

## When to write an ADR

Write an ADR when the decision:
- Affects the project's architecture or core conventions
- Is hard to reverse later (lock-in)
- Will surprise a future developer (or future you) who doesn't have
  the context
- Required serious thought to make

Don't write an ADR for:
- Tactical choices that can be reversed in an hour
- Default behavior that follows standard conventions
- Implementation details internal to a single file