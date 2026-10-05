import { Elysia } from "elysia";
import { InternalError, NotFoundError } from "./share/errors";
import { projectsRoute } from "./projects/projects.route";
import openapi from "@elysia/openapi";
import { labelsRoute } from "./labels/labels.route";
import { SQL } from "bun";
import { respondError } from "./share/response";
import { entiersRoute } from "./entries/entries.route";

const app = new Elysia()
  .error({
    NotFoundError,
    InternalError,
  })
  .onError(({ code, error, set }) => {
    if (error instanceof SQL.PostgresError) {
      if (error.errno === "23503") {
        set.status = 404;
        return respondError("NotFoundError", set.status, "Not found item");
      }

      console.error({ code: error.code, detail: error.detail });
      return respondError("ServerError", 500, "Server Error");
    }

    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        return respondError(
          code,
          set.status,
          error instanceof Error ? error.message : String(error),
        );

      case "NotFoundError":
        return respondError(code, error.status, error.message);

      case "VALIDATION":
        return respondError(code, set.status, String(error.customError));

      case "InternalError":
        return respondError(code, error.status, error.message);

      default:
        return respondError(
          String(code),
          set.status,
          error instanceof Error ? error.message : String(error),
        );
    }
  })
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .use(projectsRoute)
  .use(labelsRoute)
  .use(entiersRoute)
  .listen({
    port: 8000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
