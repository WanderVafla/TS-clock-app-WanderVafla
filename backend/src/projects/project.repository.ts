import { SQL } from "bun";
import type * as projectsType from "./projects.schema";

// TODO: create app_db_user for database. For not use alredy admin session
const pgUser = process.env.DB_USER;
const pgPass = process.env.DB_PASSWORD;
const pgName = process.env.DB_NAME;

const table_name = "projects";

const pg = new SQL(`postgres://${pgUser}:${pgPass}@localhost:5432/${pgName}`);

export const getProjects = async (): Promise<projectsType.Project[]> => {
  const query: projectsType.Project[] =
    await pg`select * from ${pg(table_name)};`;
  return query;
};

export const createProjects = async (
  project: projectsType.CreateProject,
): Promise<projectsType.Project> => {
  const query: projectsType.Project[] =
    await pg`insert into ${pg(table_name)} ${pg(project)} RETURNING *;`;
  return query[0];
};
// TODO: in routing parse if null => error 404
export const deleteProject = async (
  id: number,
): Promise<projectsType.Project | null> => {
  const query: projectsType.Project[] = await pg`
    delete from ${pg(table_name)}
    where id = ${id}
    returning *;
  `;

  return query[0] ?? null;
};

export const updateProject = async (project: projectsType.UpdateProject) => {
  const { id, ...updateProject } = project;

  console.log(updateProject);
  const query: projectsType.Project[] = await pg`
    update ${pg(table_name)}
    set ${pg(updateProject)}
    where id = ${id}
    returning *;
  `;
  return query;
};
