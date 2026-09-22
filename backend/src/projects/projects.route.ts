import Elysia from "elysia";
import * as projects from "./project.repository";
import * as projectsSchema from "./projects.schema";
import { idQuerySchema } from "../shere/shema";
import * as v from "valibot";

export const projectsRoute = new Elysia({ prefix: "/projects" })
  .get("", async () => await projects.getProjects())
  .post(
    "",
    async ({ body }) => {
      return await projects.createProjects(body);
    },
    {
      body: projectsSchema.CreateProjectSchema,
    },
  )
  .delete(
    "",
    async ({ query: { id } }) => {
      return await projects.deleteProject(id);
    },
    {
      query: v.object({ id: idQuerySchema }),
      detail: {
        summary: "Delete a project",
        description:
          "Deletes a project by id. CASCADE: all time entries linked via time_entries.project_id (ON DELETE CASCADE, see init.sql) are deleted together with the project.",
      },
    },
  )
  .patch(
    "",
    async ({ body }) => {
      const updateProject: projectsSchema.UpdateProject =
        await projects.updateProject(body);

      return updateProject;
    },
    {
      body: projectsSchema.UpdateProjectSchema,
    },
  );
