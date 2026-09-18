import { SQL } from "bun";

// TODO: create app_db_user for database. For not use alredy admin session
const pgUser = process.env.DB_USER;
const pgPass = process.env.DB_PASSWORD;
const pgName = process.env.DB_NAME;

const table_name = "projects";

const pg = new SQL(`postgres://${pgUser}:${pgPass}@localhost:5432/${pgName}`);

export const getProjects = async () => {
  const sql = await pg`select * from ${pg(table_name)};`.values();
  console.log(sql);
  return sql;
};
