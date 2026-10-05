import * as v from "valibot";
import { idQuerySchema, stringSchema } from "../share/schema";
import { NamesLength, ValidationError } from "../share/constants";

const FieldColumnNames = ["name"] as const

const ProjectSchema = v.object({
  id: idQuerySchema,
  name: v.pipe(
    stringSchema,
    v.nonEmpty(),
    v.minLength(NamesLength.min),
  ),
  created_at: v.optional(v.pipe(v.string(), v.trim(), v.isoTimestamp())),
});

export const CreateProjectSchema = v.pick(ProjectSchema, FieldColumnNames);

export const UpdateProjectSchema = v.pipe(
  v.object({
    id: ProjectSchema.entries.id,
    ...v.partial(v.pick(ProjectSchema, FieldColumnNames)).entries,
  }),
  v.check(
    (i) => Object.keys(i).some((k) => k !== "id"),
    ValidationError.NothingToUpdate(FieldColumnNames),
  ),
);

export type Project = v.InferOutput<typeof ProjectSchema>;
export type UpdateProject = v.InferOutput<typeof UpdateProjectSchema>;
export type CreateProject = v.InferOutput<typeof CreateProjectSchema>;
