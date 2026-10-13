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
