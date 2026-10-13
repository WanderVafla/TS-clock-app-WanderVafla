#!/usr/bin/env bash
# Sends N POST requests to /entries (default 100) and reports status codes.
# Usage: scripts/seed-entries.sh [count] [project_id]
#   BASE_URL=http://localhost:8000 by default.
# The project with project_id must already exist (FK on time_entries.project_id).
set -euo pipefail

COUNT="${1:-100}"
PROJECT_ID="${2:-1}"
URL="${BASE_URL:-http://localhost:8000}/entries"

ok=0
fail=0

for i in $(seq 1 "$COUNT"); do
  body=$(printf '{"project_id": %s, "description": "seed entry #%d"}' "$PROJECT_ID" "$i")
  status=$(curl -s -o /dev/null -w '%{http_code}' \
    -X POST "$URL" \
    -H 'Content-Type: application/json' \
    -d "$body") || status="000"

  if [[ "$status" == "201" ]]; then
    ok=$((ok + 1))
  else
    fail=$((fail + 1))
    echo "request #$i failed: HTTP $status"
  fi
done

echo "done: $ok created, $fail failed (of $COUNT)"
[[ "$fail" -eq 0 ]]
