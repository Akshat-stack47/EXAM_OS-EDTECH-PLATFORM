# Branch Strategy & Git Workflow

## Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production — deployable at all times | Protected, requires PR + CI pass + 1 approval |
| `develop` | Integration branch for feature work | Protected, requires PR + CI pass |
| `feat/*` | New features | Branch off `develop`, merge back to `develop` |
| `fix/*` | Bug fixes | Branch off `develop`, merge back to `develop` |
| `chore/*` | Tooling, CI, refactors | Branch off `develop`, merge back to `develop` |
| `hotfix/*` | Urgent production fixes | Branch off `main`, merge back to `main` + `develop` |

## Rules

1. **Never push directly to `main` or `develop`** — always use PRs.
2. **PRs to `main` require**:
   - CI pipeline green (all 7 jobs)
   - At least 1 reviewer approval
   - Linear history (rebase/squash merge only)
   - Conventional commit title format
3. **PRs to `develop` require**:
   - CI pipeline green (typecheck + lint + unit-tests)
   - Linear history
4. **Squash merge** into `develop`; **rebase merge** into `main`.
5. Delete branch after merge.

## Conventional Commits

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `style`.
Scopes: `api`, `ui`, `db`, `auth`, `payments`, `search`, `ai`, `infra`, `deps`.

## Slack Notifications

- Failed CI on `main` → #alerts
- Successful deploy to production → #deployments
- Sentry error spike → #alerts
