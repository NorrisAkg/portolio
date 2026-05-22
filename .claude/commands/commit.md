# /commit — local thematic commits, no push, no signature

Group the working tree's uncommitted changes into one or more local
commits with clean conventional-commit messages. **Never push, never
sign, never bypass hooks.**

## Operating rules (non-negotiable)

- ❌ **Never push.** Local commits only. Do not run `git push`,
  `git push --force`, or any remote-mutating command.
- ❌ **Never sign.** Do **not** append `Co-Authored-By: Claude …`
  (or any other co-author trailer) to commit messages.
- ❌ **Never skip hooks.** Do not use `--no-verify`, `--no-gpg-sign`,
  or `-c commit.gpgsign=false`. If a hook fails, fix the underlying
  issue and re-commit (a NEW commit, not `--amend`).
- ❌ **Never `git add -A` / `git add .`** — stage explicit files only,
  per the grouping the user validated. Watch for accidental inclusion
  of secrets, large binaries, or files outside the agreed scope.
- ❌ **Never modify already-published commits.** Don't `git commit
  --amend`, `git rebase`, or `git reset --hard`.
- ✅ **Always create NEW commits** for every fix or follow-up.
- ✅ **Always validate the grouping with the user** before staging
  anything, using `AskUserQuestion`.

## Workflow

### Step 1 — Inspect

Run these in parallel (single message, multiple `Bash` tool calls):

- `git status` (no `-uall` flag)
- `git diff` (unstaged) and `git diff --staged`
- `git log --oneline -10` (so commit-message style matches history)
- If the repo has a `package.json`, also check whether `lint` and
  `typecheck` scripts exist (`grep -E "\"(lint|typecheck)\"" package.json`)

### Step 2 — Pre-commit checks

Run project-appropriate checks **before** staging or committing. If a
check fails, **stop and report** — do not work around it by skipping
hooks or by committing broken code.

For this project specifically:

- `pnpm lint` must pass clean.
- `pnpm typecheck` is expected to error on `server/shared/prisma.ts`
  (missing `@prisma/client` until the dev installs Prisma). That one
  error is acceptable; any other typecheck failure must be fixed
  before committing.

### Step 3 — Propose a thematic grouping

Read the diff carefully and identify cohesive themes. Examples of
good groupings: tooling/config changes; backend domain code; a
frontend feature touching components + styles + i18n; documentation;
test additions. Avoid mixing unrelated concerns in the same commit.

Then use `AskUserQuestion` to surface the proposed grouping. Each
option should show the commit titles you intend to create, e.g.:

> 1. `chore: bump pnpm-lock + Nuxt UI v4`
> 2. `feat(blog): add tag filter on /blog`
> 3. `fix(header): pin hdr-util to grid column 3`

Offer at least **two** options when there's a real choice
(e.g. one-bundled-commit vs split-thematic), and let the user pick or
write their own grouping.

### Step 4 — Draft commit messages

For each commit:

- **Subject** ≤ 72 chars, lower-case, conventional-commit prefix
  (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`,
  `build`, `ci`, `style`). Use a scope when it sharpens the intent
  (e.g. `feat(blog):`, `fix(header):`).
- **Body** wraps at ~72 chars and explains the **why**, not the
  what — the diff already shows the what. Mention any non-obvious
  constraints (e.g. "matches `.app.v2.mobile` mockup values") or
  intentional deviations.
- **No trailer** for co-authors, sign-offs, or AI attribution.

Compose the message via a HEREDOC to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
feat(blog): add tag filter on /blog

Add a filter row that toggles between "all" and any tag present
in the article list. Visual treatment matches the chip style
from template/portfolio-v2.css.
EOF
)"
```

### Step 5 — Stage and commit, file by file

For each commit in the agreed grouping:

1. Stage exactly the files for that commit by name (e.g.
   `git add app/pages/blog/index.vue app/assets/css/main.css`).
   Never use `git add .` or `git add -A`.
2. Verify the staged set with `git status --short`.
3. Run `git commit -m "$(cat <<'EOF' … EOF)"` with the drafted
   message. Hooks run normally.
4. If the hook fails, **do not amend** — fix the issue, re-stage,
   and create a NEW commit. The failed commit didn't happen, so
   `--amend` would touch the previous commit instead.
5. Move on to the next commit.

### Step 6 — Verify and report

After all commits are made:

- `git status` (should be clean or only have intentionally-untracked
  files left)
- `git log --oneline -<N>` showing the new commits

Report to the user:

- The list of commit SHAs + titles created
- Any files left untracked or unstaged on purpose, and why
- The reminder that nothing was pushed

## Things to never do during /commit

- Run `git push` (any variant)
- Append `Co-Authored-By: Claude …`
- Use `--no-verify`, `--amend`, `--force`, `-c commit.gpgsign=false`
- Commit `.env`, `*.key`, `*.pem`, credentials, secrets, or large
  binaries without explicit user confirmation
- Stage `.claude/settings.json` (it's local-permissions, gitignored)
- Stage `template/` (it's the design source, gitignored)
