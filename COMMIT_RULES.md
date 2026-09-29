# Commit rules

1. Never run `git push` unless the user explicitly asked for it.
2. Before committing, inspect `git status`, `git diff`, and `git log --oneline -10`.
3. Summarize all changes as a task list. If a GitHub issue exists, base the list on it.
4. Run `scripts/quality-gate.sh` before splitting into commits. On any failure: stop, report the errors to the user, do nothing further.
5. Before committing, show the pre-commit plan and wait for user confirmation. The plan contains: task list, commit names with files and changed lines, and a one-line `Why:` rationale per commit (dependency, scope, or layer — why split this way and not otherwise).
6. Split into sequential commits: each commit's requirements must be in earlier commits.
7. All messages follow Conventional Commits: `feat|fix|refactor|chore(scope): subject`, imperative mood, lowercase scope.
8. Never commit secrets (`.env`); respect `.gitignore`.
