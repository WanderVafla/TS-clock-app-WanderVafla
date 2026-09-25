import * as v from "valibot";
import { idQuerySchema } from "../share/schema";

const ProjectSchema = v.object({
  id: idQuerySchema,
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.minLength(1),
    v.maxLength(255),
  ),
  created_at: v.optional(v.pipe(v.string(), v.trim(), v.isoTimestamp())),
});

export const CreateProjectSchema = v.pick(ProjectSchema, ["name"]);

export const UpdateProjectSchema = v.pipe(
  v.object({
    id: ProjectSchema.entries.id,
    ...v.partial(v.pick(ProjectSchema, ["name"])).entries,
  }),
  v.check((i) => Object.keys(i).some((k) => k !== "id"), "nothing to update: provide at least one field (name)"),
);

export type Project = v.InferOutput<typeof ProjectSchema>;
export type UpdateProject = v.InferOutput<typeof UpdateProjectSchema>;
export type CreateProject = v.InferOutput<typeof CreateProjectSchema>;
