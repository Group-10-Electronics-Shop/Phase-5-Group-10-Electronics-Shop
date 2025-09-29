# Contributing

## Branching
- Use `feature/*` for features, `bugfix/*` for fixes, `chore/*` for housekeeping.
- Never push directly to `main`. Open a PR from your branch into `main`.

## Pull requests
- **At least 2 reviewers required** for every PR.
- CI must pass (`frontend-check`, `backend-check`) before merging.
- Use descriptive title and summary; link related issue if any.
- Assign reviewers from the team and/or rely on CODEOWNERS to auto-request reviewers.

## Commit messages
Use conventional commits style:
- `feat(scope): short description`
- `fix(scope): short description`
- `chore(scope): short description`

## Local checks
- Run backend `server/app.py` and verify `/health`.
- Run smoke tests: `export BACKEND_URL=...; export FRONTEND_URL=...; bash scripts/smoke_test.sh`