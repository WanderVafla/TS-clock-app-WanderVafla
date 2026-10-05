import { SQL } from "bun";

const pgUser = process.env.APP_DB_USER;
const pgPass = process.env.APP_DB_PASSWORD;
const pgName = process.env.DB_NAME;
const pgPort = process.env.DB_PORT;

const pgUrl =
  `postgres://${pgUser}:${pgPass}@localhost:${pgPort}/${pgName}` as const;

export const pg = new SQL({
  url: pgUrl,
} as const);

export const DescriptionDocs = {
  detailProjectDelete: {
    delete: {
      summary: "Delete a project",
      description:
        "Deletes a project by id. CASCADE: all time entries linked via time_entries.project_id (ON DELETE CASCADE, see init.sql) are deleted together with the project.",
    },
  },
  detailLabelDelete: {
    detail: {
      summary: "Delete a label",
      description:
        "Deletes a label by id. Only its associations in labels_time_entrie are removed (ON DELETE CASCADE, see init.sql); linked time entries are preserved.",
    },
  },
} as const;

export const ValidationError = {
  NothingToUpdate: (fields: readonly string[]): string =>
    `Nothing to update. provide at least one field (${fields.join(", ")})`,
  NumberMustBePositive: (field: string) =>
    `${field} must be a positive integer (>= 1)`,
  NumberMustBeInteger: (field: string) => `${field} must be an integer`,
  NumberTooLarge: (field: string, max: number) =>
    `${field} must be at most ${max}`,
  // if number is like string
  NumberMustBeNumber: (field: string) => `${field} must be a number`,
  ValueMustBeStringToFirst: (field: string) =>
    `${field} must be a string at first`,
  ValueIsLessThatValue: (
    firstValue: string,
    secondValue: string,
    comparison: "less" | "more",
  ) => `${firstValue} is ${comparison} that ${secondValue}`,
  NulByteError: "Name must not contain NUL character",
} as const;

/*
 * Much be like into Databse(init.sql)
 * All names into database are min 1 - max 255
 */
export const NamesLength = {
  max: 255,
  min: 1,
} as const;

export const DatabaseTableNames = {
  labels: "labels",
  project: "projects",
} as const;

export const ErrorMessage = {
  NotFoundError: "Not found item",
} as const;
