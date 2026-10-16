import Elysia from "elysia";
import { respondSuccess } from "../share/response";
import { clockChangeProject, clockIn, clockOut } from "./clock.repository";
import { clockChangeSchema, clockInSchema } from "./clock.schema";

export const clockRoute = new Elysia({ prefix: "/clock" })
  .post(
    "/in",
    async ({ body, set }) => {
      const data = await clockIn(body);
      set.status = 201;
      return respondSuccess(data, set.status);
    },
    {
      body: clockInSchema,
    },
  )
  .post("/out", async ({ set }) => {
    const data = await clockOut();
    set.status = 200;
    return respondSuccess(data, set.status);
  })
  .post(
    "/change",
    async ({ body, set }) => {
      const data = await clockChangeProject(body);
      set.status = 200;
      return respondSuccess(data, set.status);
    },
    {
      body: clockChangeSchema,
    },
  );
