import * as v from "valibot";

const ProjectSchema = v.object({
  id: v.number(),
  name: v.pipe(v.string()),
  created_at: v.pipe(v.string(), v.isoTimestamp()),
});

export type Project = v.InferOutput<typeof ProjectSchema>;
