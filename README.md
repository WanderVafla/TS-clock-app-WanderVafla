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