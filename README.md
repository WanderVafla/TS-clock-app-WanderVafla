# Typescript Clock App

for run database you need to write in terminal
```bash
docker compose up -d
```

## Contract tests

The black-box API suite lives in a separate repo and is ignored by the parent
`.gitignore` (`backend/tests/contract`), so clone it explicitly:

```bash
git clone git@github.com:WanderVafla/TS-clock-app-WanderVafla.git
cd TS-clock-app-WanderVafla
git clone git@github.com:WanderVafla/TS-clock-backend-tests-endpoints.git backend/tests/contract
```

## Scripts

Helper scripts live in `scripts/`. Run them from the repo root.

### `scripts/quality-gate.sh`

Runs `tsc --noEmit` for backend and frontend, then checks lines added in the
worktree diff for `console.log`/`console.warn`/`console.debug`, `TODO` and
`FIXME`. Stops at the first failed check. Run it before committing (see
`COMMIT_RULES.md`).

```bash
scripts/quality-gate.sh
```

Requires installed dependencies (`node_modules`) in both `backend/` and `frontend/`.

### `scripts/seed-entries.sh`

Sends POST requests to `/entries` to fill the database with test time entries.
It prints every failed request with its HTTP code and a summary at the end,
and exits non-zero if any request failed.

```bash
scripts/seed-entries.sh                              # 100 entries, project_id=1
scripts/seed-entries.sh 50 3                         # 50 entries, project_id=3
BASE_URL=http://localhost:3000 scripts/seed-entries.sh
```

| Argument / env | Default                 | Meaning                         |
| -------------- | ----------------------- | ------------------------------- |
| `$1`           | `100`                   | number of requests              |
| `$2`           | `1`                     | `project_id` for every entry    |
| `BASE_URL`     | `http://localhost:8000` | backend address                 |

The backend must be running, and a project with the given `project_id` must
already exist. Otherwise every request fails because of the foreign key.
