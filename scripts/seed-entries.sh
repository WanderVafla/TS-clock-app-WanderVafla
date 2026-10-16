#!/usr/bin/env bash
# Creates N finished time entries (default 100) through POST /entries.
# Entries start one hour apart and last 45 minutes, so they never overlap.
# Usage: scripts/seed-entries.sh [count] [project_id]
#   BASE_URL=http://localhost:8000 by default.
#   START=<ISO time> sets the start of the first entry. By default the new
#   entries end before the earliest existing entry, so repeated runs never
#   overlap; on an empty table they end before now.
# The project with project_id must already exist (FK on time_entries.project_id).
# Refuses to run while a timer is running, because the running entry would
# overlap the new ones. Requires GNU date.
set -euo pipefail

COUNT="${1:-100}"
PROJECT_ID="${2:-1}"
URL="${BASE_URL:-http://localhost:8000}/entries"

entries=$(curl -sf "$URL") || {
  echo "cannot read entries from $URL"
  exit 1
}
if [[ "$entries" == *'"end_time":null'* ]]; then
  echo "a timer is running; stop it with POST /clock/out first, nothing was changed"
  exit 1
fi

iso() {
  date -u -d "@$1" +%Y-%m-%dT%H:%M:%SZ
}

hour_floor() {
  echo $(($1 / 3600 * 3600))
}

if [[ -n "${START:-}" ]]; then
  first=$(date -u -d "$START" +%s)
else
  # GET /entries sorts by start_time ascending, so the first entry is the earliest.
  earliest=$(curl -sf "$URL?sizePage=1" | grep -o '"start_time":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [[ -n "$earliest" ]]; then
    anchor=$(hour_floor "$(date -u -d "$earliest" +%s)")
  else
    anchor=$(hour_floor "$(date -u +%s)")
  fi
  first=$((anchor - COUNT * 3600))
fi
ok=0
fail=0

for i in $(seq 1 "$COUNT"); do
  start=$((first + (i - 1) * 3600))
  end=$((start + 45 * 60))
  body=$(printf '{"project_id": %s, "start_time": "%s", "end_time": "%s", "description": "seed entry #%d"}' \
    "$PROJECT_ID" "$(iso "$start")" "$(iso "$end")" "$i")

  status=$(curl -s -o /dev/null -w '%{http_code}' \
    -X POST "$URL" \
    -H 'Content-Type: application/json' \
    -d "$body") || status="000"

  if [[ "$status" == "201" ]]; then
    ok=$((ok + 1))
  else
    fail=$((fail + 1))
    echo "entry #$i ($(iso "$start")): HTTP $status"
  fi
done

echo "done: $ok created, $fail failed (of $COUNT)"
[[ "$fail" -eq 0 ]]
