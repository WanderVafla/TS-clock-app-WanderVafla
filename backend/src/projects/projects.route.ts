import Elysia from "elysia";
import * as projects from "./project.repository";
import * as projectsSchema from "./projects.schema";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { DescriptionDocs } from "../share/constants";
import { respondSuccess } from "../share/response";

export const projectsRoute = new Elysia({ prefix: "/projects" })
  .get("", async ({ set }) => {
    const data = await projects.getProjects();
    return respondSuccess(data, set.status);
  })
  .post(
    "",
    async ({ body, set }) => {
      const data = await projects.createProjects(body);
      set.status = 201;
      return respondSuccess(data, set.status);
    },
    {
      body: projectsSchema.CreateProjectSchema,
    },
  )
  .delete(
    "",
    async ({ query: { id }, set }) => {
      const data = await projects.deleteProject(id);
      set.status = 200;
      return respondSuccess(data, set.status);
    },
    {
      query: v.object({ id: idQuerySchema }),
      detail: DescriptionDocs.detailProjectDelete,
    },
  )
  .patch(
    "",
    async ({ body, set }) => {
      const data = await projects.updateProject(body);

      return respondSuccess(data, set.status);
    },
    {
      body: projectsSchema.UpdateProjectSchema,
    },
  );
