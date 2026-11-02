import { SQL } from "bun";

const pgUser = process.env.APP_DB_USER;
const pgPass = process.env.APP_DB_PASSWORD;
const pgName = process.env.DB_NAME;
const pgPort = process.env.DB_PORT;

const pgUrl =
  `postgres://${pgUser}:${pgPass}@localhost:${pgPort}/${pgName}` as const;

export const Lock_Keys = {
  clock: 1,
};

export const pg = new SQL({
  url: pgUrl,
} as const);
