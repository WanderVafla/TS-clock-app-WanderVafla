# Agent guide

- Backend: `backend/` (Bun + Elysia). Frontend: `frontend/` (React + Vite + Biome). DB: Postgres via `docker compose`.
- Quality checks: `scripts/quality-gate.sh` (tsc backend + frontend, dead-code grep; no tests exist yet).
- If you make commits, read `COMMIT_RULES.md` first and follow it.
