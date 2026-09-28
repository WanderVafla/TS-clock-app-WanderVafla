#!/usr/bin/env bash
# Quality gate: run before splitting work into commits (see COMMIT_RULES.md).
# Fails fast on the first broken check. No Biome yet (backend has no config).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "## tsc (backend)"
"$ROOT/backend/node_modules/.bin/tsc" --noEmit -p "$ROOT/backend"
echo "backend tsc: OK"

echo "## tsc (frontend)"
"$ROOT/frontend/node_modules/.bin/tsc" --noEmit -p "$ROOT/frontend"
echo "frontend tsc: OK"

echo "## dead code in worktree diff"
if git -C "$ROOT" diff HEAD -- backend frontend | grep -nE 'console\.(log|warn|debug)|TODO|FIXME'; then
  echo "dead code check: FAILED (see matches above)"
  exit 1
fi
echo "dead code check: OK"

echo "## tests"
echo "no test scripts exist yet - skipping"

echo "QUALITY GATE PASSED"
