import { Elysia } from "elysia";
import { getProjects } from "./projects/project.repository"

const app = new Elysia().get("/", () => "Hello Elysia")
  .get('/projects', getProjects())
  .listen({
    port: 8000,
    hostname: "0.0.0.0"
});

console.log(getProjects())
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
