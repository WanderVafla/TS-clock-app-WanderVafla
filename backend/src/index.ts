import { Elysia } from "elysia";
import {
  AlreadyExistsError,
  InternalError,
  NotFoundError,
} from "./share/errors";
import { projectsRoute } from "./projects/projects.route";
import { labelsRoute } from "./labels/labels.route";
import { SQL } from "bun";
import { respondError } from "./share/response";
import { entriesRoute } from "./entries/entries.route";
import { ErrorMessage, ErrorName, ValidationError } from "./share/constants";
import { entriesLabelsRoute } from "./entries_labels/entries_labels.route";

const app = new Elysia()
  .error({
    NotFoundError,
    InternalError,
    AlreadyExistsError,
  })
  .onError(({ code, error, set }) => {
    if (error instanceof SQL.PostgresError) {
      if (error.errno === "23503") {
        set.status = 404;
        return respondError(
          ErrorName.notFound,
          set.status,
          ErrorMessage.NotFoundError,
        );
      }

      if (error.errno === "23505") {
        set.status = 409;
        return respondError(
          ErrorName.conflict,
          set.status,
          ErrorMessage.TimerAlreadyRunned,
        );
      }

      if (error.errno === "23P01") {
        set.status = 409;
        return respondError(
          ErrorName.conflict,
          set.status,
          ErrorMessage.ConflictTime,
        );
      }

      if (error.errno === "23514") {
        set.status = 422;
        return respondError(
          ErrorName.validation,
          set.status,
          ValidationError.ValidationError,
        );
      }

      if (error.errno === "22008") {
        set.status = 422;
        return respondError(
          ErrorName.validation,
          set.status,
          ValidationError.OutRangeDate,
        );
      }

      if (error.errno === "23502") {
        set.status = 422;
        return respondError(
          ErrorName.validation,
          set.status,
          ValidationError.ValidationError,
        );
      }

      console.error(error);
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

      case "NOT_FOUND":
        set.status = 404;
        return respondError(code, set.status, error.message);

      case "AlreadyExistsError":
        set.status = 409;
        return respondError(code, set.status, error.message);

      default:
        return respondError(
          String(code),
          set.status,
          error instanceof Error ? error.message : String(error),
        );
    }
  })
  .get("/", () => "Hello Elysia")
  .use(projectsRoute)
  .use(labelsRoute)
  .use(entriesRoute)
  .use(entriesLabelsRoute)
  .listen({
    port: 8000,
    hostname: "0.0.0.0",
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
