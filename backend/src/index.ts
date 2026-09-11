import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen({
  port: 8000,
  hostname: "0.0.0.0"
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
