import * as v from "valibot";

export const ProjectSchema = v.object({
  id: v.optional(v.number()),
  name: v.pipe(v.string()),
  created_at: v.optional(v.pipe(v.string(), v.isoTimestamp())),
});

export type Project = v.InferOutput<typeof ProjectSchema>;
