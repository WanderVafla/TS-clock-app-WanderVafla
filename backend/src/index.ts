import { Elysia } from "elysia";
import { InternalError, NotFoundError } from "./share/errors";
import { projectsRoute } from "./projects/projects.route";
import openapi from "@elysia/openapi";
import { labelsRoute } from "./labels/labels.route";
import { SQL } from "bun";

const app = new Elysia()
  .error({
    NotFoundError,
    InternalError,
  })
  .onError(({ code, error, status }) => {
    if (error instanceof SQL.PostgresError) {
      console.error({ code: error.code, detail: error.detail });
      return {
        success: false,
        name: "ServerError",
        status: 500,
        message: "Server Error",
      };
    }

    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        return { success: false, name: code, status: status, error };

      case "NotFoundError":
        return {
          success: false,
          name: code,
          status: error.status,
          message: error.message,
        };

      case "VALIDATION":
        return {
          success: false,
          name: code,
          status: 400,
          message: error.customError,
        };

      case "InternalError":
        return {
          success: false,
          name: code,
          status: error.status,
          message: error.message,
        };

      default:
        return { success: false, name: code, status: status, message: error };
    }
  })
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .use(projectsRoute)
  .use(labelsRoute)
  .listen({
    port: 8000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
