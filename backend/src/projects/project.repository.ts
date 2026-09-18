import { SQL } from "bun";
import type { Project } from "./projects.schema";

// TODO: create app_db_user for database. For not use alredy admin session
const pgUser = process.env.DB_USER;
const pgPass = process.env.DB_PASSWORD;
const pgName = process.env.DB_NAME;

const table_name = "projects";

const pg = new SQL(`postgres://${pgUser}:${pgPass}@localhost:5432/${pgName}`);

export const getProjects = async (): Promise<Project[]> => {
  const query: Project[] = await pg`select * from ${pg(table_name)};`.values();
  return query;
};

export const createProjects = async (name: string): Promise<Project> => {
  const values = { name: name };
  const query: Project[] =
    await pg`insert into ${pg(table_name)} ${pg(values)} RETURNING *;`;
  return query[0];
};
