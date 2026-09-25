import * as v from "valibot";
import { idQuerySchema } from "../share/schema";

export const LabelSchema = v.object({
  id: idQuerySchema,
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.minLength(1),
    v.maxLength(255),
  ),
});

export const UpdateLabelSchema = v.pipe(
  v.object({
    id: LabelSchema.entries.id,
    ...v.partial(v.pick(LabelSchema, ["name"])).entries,
  }),
  v.check(
    (i) => Object.keys(i).some((k) => k !== "id"),
    "nothing to update: provide at least one field (name)",
  ),
);

export type Label = v.InferOutput<typeof LabelSchema>;
export type UpdateLabel = v.InferOutput<typeof UpdateLabelSchema>;
