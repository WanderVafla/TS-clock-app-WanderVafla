import Elysia from "elysia";
import * as projects from "./project.repository";
import * as projectsSchema from "./projects.schema";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { DescriptionDocs } from "../share/constants";

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
      detail: DescriptionDocs.detailProjectDelete,
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
