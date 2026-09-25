import { Elysia } from "elysia";
import { NotFoundError } from "./share/errors";
import { projectsRoute } from "./projects/projects.route";
import openapi from "@elysia/openapi";

const app = new Elysia()
  .error({
    NotFoundError,
  })
  .onError(({ code, error, status }) => {
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

      default:
        return { success: false, name: code, status: status, message: error };
    }
  })
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .use(projectsRoute)
  .listen({
    port: 8000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
