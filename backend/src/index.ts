import { Elysia } from "elysia";
import { NotFoundError } from "./shere/errors";
import { projectsRoute } from "./projects/projects.route";
import { openapi } from "@elysia/openapi";

const app = new Elysia()
  .error({
    NotFoundError,
  })
  .onError(({ code, error }) => {
    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        return { success: true, name: code, error };

      case "NotFoundError":
        return { success: true, name: code, message: error.message };

      case "VALIDATION":
        return { success: true, name: code, message: error.message };
      default:
        return { success: true, name: code, message: error };
    }
  })
  .get("/", () => "Hello Elysia")
  .use(openapi())
  .use(projectsRoute)
  .listen({
    port: 8000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
