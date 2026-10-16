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

## API

### `GET /entries`

Returns time entries. Without pagination parameters it returns all matching
entries; with `sizePage` it returns a single page.

#### Query parameters

| Parameter    | Type    | Default      | Description                                                        |
| ------------ | ------- | ------------ | ------------------------------------------------------------------ |
| `id`         | integer | -            | Return only the entry with this id                                 |
| `project_id` | integer | -            | Return only entries of this project                                |
| `page`       | integer | `1`          | Page number, starts at 1. Requires `sizePage`                      |
| `sizePage`   | integer | -            | Entries per page, from 1 to 100. Enables pagination                |
| `order`      | string  | `start_time` | Sort column: `id`, `start_time`, `end_time`, `description`, `project_id` |

- Sorting is always ascending. Entries with the same value in the sort column
  are ordered by `id`, so pages stay stable between requests.
- `page` without `sizePage`, `sizePage` above 100, a value below 1 or an
  unknown `order` column returns `422`.
- A `page` after the last page returns an empty `data` array with `200`.

#### Response (example)

```bash
curl "http://localhost:8000/entries?page=2&sizePage=2"
```

```json
{
  "success": true,
  "status": 200,
  "data": [
    { "id": 97, "start_time": "2026-10-06T08:54:45.000Z", "end_time": "2026-10-09T09:16:26.335Z", "description": null, "project_id": 2 },
    { "id": 98, "start_time": "2026-10-09T09:16:26.350Z", "end_time": "2026-10-09T09:16:26.364Z", "description": "seed entry #2", "project_id": 2 }
  ],
  "metadata": { "page": 2, "sizePage": 2, "total": 53, "totalPages": 27, "sorted": "start_time" }
}
```

| `metadata` field | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `page`           | Current page. Absent without `sizePage`                                   |
| `sizePage`       | Entries per page. Absent without `sizePage`                               |
| `total`          | Number of entries that match the filters, across all pages               |
| `totalPages`     | `ceil(total / sizePage)`; without `sizePage`: `1`, or `0` if `total` is 0 |
| `sorted`         | Column used for sorting                                                   |

### Clock: `/clock`

The clock keeps one timeline: at most one timer runs at a time, and entries
never overlap. A running timer is an entry with `end_time: null`.

| Method | Path            | Body                                       | Success                    | Errors |
| ------ | --------------- | ------------------------------------------ | -------------------------- | ------ |
| `POST` | `/clock/in`     | `project_id`, `description?`, `label?`     | `201`, the running entry   | `409` a timer is already running, `404` unknown project or label, `422` |
| `POST` | `/clock/out`    | none                                       | `200`, the finished entry  | `404` no timer is running |
| `POST` | `/clock/change` | `project_id?`, `description?`, `label?`, at least one field | `200`, the new running entry | `404` no timer is running, `404` unknown project or label, `422` |

`/clock/change` never edits the running entry. It closes it and starts a new
one at the same moment, so time already tracked keeps its project and labels:

- a field that is not sent is copied from the closed entry;
- `label` replaces the labels; without `label` the labels of the closed entry
  are copied.

```bash
curl -X POST http://localhost:8000/clock/in -H 'Content-Type: application/json' \
  -d '{"project_id": 2, "label": 2}'
curl -X POST http://localhost:8000/clock/change -H 'Content-Type: application/json' \
  -d '{"label": 3}'
curl -X POST http://localhost:8000/clock/out
```

The database enforces both rules even if a request skips the API checks
(`init.sql`):

- `one_active_entry`: a unique index allows only one row with `end_time is null`;
  a violation returns `409`.
- `no_overlapping_entries`: an exclusion constraint rejects entries whose
  `[start_time, end_time)` ranges overlap; a running entry lasts until
  `infinity`. A violation returns `409`.

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

Fills the database with finished test time entries through `POST /entries`.
Entries start one hour apart and last 45 minutes, so they never overlap. By
default they are placed right before the earliest existing entry (on an empty
table, right before the current time), so repeated runs never overlap either.
The script prints every failed entry with its HTTP code and a summary at the
end, and exits non-zero if any entry failed.

```bash
scripts/seed-entries.sh                                   # 100 entries, project_id=1
scripts/seed-entries.sh 50 2                              # 50 entries, project_id=2
START=2026-01-05T08:00:00Z scripts/seed-entries.sh 20     # first entry at START
BASE_URL=http://localhost:3000 scripts/seed-entries.sh
```

| Argument / env | Default                  | Meaning                                |
| -------------- | ------------------------ | -------------------------------------- |
| `$1`           | `100`                    | number of entries                      |
| `$2`           | `1`                      | `project_id` for every entry           |
| `START`        | before earliest entry    | start of the first entry (ISO time)    |
| `BASE_URL`     | `http://localhost:8000`  | backend address                        |

The backend must be running, and a project with the given `project_id` must
already exist. Otherwise every request fails because of the foreign key.
If a timer is running, the script stops before sending anything: the running
entry would overlap the new ones. With an explicit `START`, entries that
overlap existing ones fail with `409`. Requires GNU `date`.
