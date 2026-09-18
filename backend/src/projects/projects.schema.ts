import * as v from "valibot";

export const ProjectSchema = v.object({
  id: v.optional(v.number()),
  name: v.pipe(v.string()),
  created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
});

export const CreateProjectSchema = v.pick(ProjectSchema, ["name"]);

export const UpdateProjectSchema = v.object({
  id: ProjectSchema.entries.id,
  ...v.partial(v.pick(ProjectSchema, ["name"])).entries,
});

export type Project = v.InferOutput<typeof ProjectSchema>;
export type UpdateProject = v.InferOutput<typeof UpdateProjectSchema>;
export type CreateProject = v.InferOutput<typeof CreateProjectSchema>;
