import { SQL } from "bun";
import type * as projectsType from "./projects.schema";
import * as shereErrors from "../shere/errors";

const pgUser = process.env.APP_DB_USER;
const pgPass = process.env.APP_DB_PASSWORD;
const pgName = process.env.DB_NAME;
const pgPort = process.env.DB_PORT;

const table_name = "projects";

const pg = new SQL(
  `postgres://${pgUser}:${pgPass}@localhost:${pgPort}/${pgName}`,
);

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

  if ((Array.isArray(query) && query.length === 0) || !query) {
    throw new shereErrors.NotFoundError();
  }

  return query[0];
};

/**
 * Deletes a project by id.
 *
 * Delete behavior (CASCADE): `time_entries.project_id` references
 * `projects(id) ON DELETE CASCADE` (see `init.sql`), so all time entries
 * belonging to the project are deleted together with it (including their
 * rows in `labels_time_entrie`). This is intentional to avoid orphaned
 * entries with a non-nullable `project_id`.
 *
 * @throws NotFoundError (404) when no project with the given id exists.
 */
export const deleteProject = async (
  id: number,
): Promise<projectsType.Project> => {
  const query: projectsType.Project[] = await pg`
    delete from ${pg(table_name)}
    where id = ${id}
    returning *;
  `;

  if ((Array.isArray(query) && query.length === 0) || !query) {
    throw new shereErrors.NotFoundError();
  }

  return query[0];
};

export const updateProject = async (
  project: projectsType.UpdateProject,
): Promise<projectsType.UpdateProject> => {
  const { id, ...updateProject } = project;

  const query: projectsType.UpdateProject[] = await pg`
      update ${pg(table_name)}
      set ${pg(updateProject)}
      where id = ${id}
      returning *;
    `;

  if ((Array.isArray(query) && query.length === 0) || !query) {
    throw new shereErrors.NotFoundError();
  }

  return query[0];
};
