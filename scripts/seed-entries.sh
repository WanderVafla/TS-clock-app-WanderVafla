#!/usr/bin/env bash
# Creates N finished time entries (default 100) through POST /entries.
# POST /entries toggles the project's timer, so every entry takes two requests:
# start (expects 201) and stop (expects 200).
# Usage: scripts/seed-entries.sh [count] [project_id]
#   BASE_URL=http://localhost:8000 by default.
# The project with project_id must already exist (FK on time_entries.project_id).
# Refuses to run while the project has a running timer, so it never stops one.
set -euo pipefail

COUNT="${1:-100}"
PROJECT_ID="${2:-1}"
URL="${BASE_URL:-http://localhost:8000}/entries"

entries=$(curl -sf "$URL?project_id=$PROJECT_ID") || {
  echo "cannot read entries of project_id=$PROJECT_ID from $URL"
  exit 1
}
if [[ "$entries" == *'"end_time":null'* ]]; then
  echo "project_id=$PROJECT_ID has a running timer; stop it first, nothing was changed"
  exit 1
fi

post_entry() {
  curl -s -o /dev/null -w '%{http_code}' \
    -X POST "$URL" \
    -H 'Content-Type: application/json' \
    -d "$1" || echo "000"
}

ok=0
fail=0

for i in $(seq 1 "$COUNT"); do
  body=$(printf '{"project_id": %s, "description": "seed entry #%d"}' "$PROJECT_ID" "$i")

  start=$(post_entry "$body")
  if [[ "$start" != "201" ]]; then
    fail=$((fail + 1))
    echo "entry #$i: start failed: HTTP $start"
    continue
  fi

  stop=$(post_entry "$body")
  if [[ "$stop" != "200" ]]; then
    fail=$((fail + 1))
    echo "entry #$i: stop failed: HTTP $stop; the timer may still be running"
    break
  fi

  ok=$((ok + 1))
done

echo "done: $ok created, $fail failed (of $COUNT)"
[[ "$fail" -eq 0 ]]
