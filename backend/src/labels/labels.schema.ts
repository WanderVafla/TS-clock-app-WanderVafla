import * as v from "valibot";
import { idQuerySchema } from "../share/schema";
import { NamesLength, ValidationError } from "../share/constants";

const FieldColumnNames = ["name"] as const

export const LabelSchema = v.object({
  id: idQuerySchema,
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(),
    v.minLength(NamesLength.min),
    v.maxLength(NamesLength.max),
  ),
});

export const UpdateLabelSchema = v.pipe(
  v.object({
    id: LabelSchema.entries.id,
    ...v.partial(v.pick(LabelSchema, FieldColumnNames)).entries,
  }),
  v.check(
    (i) => Object.keys(i).some((k) => k !== "id"),
    ValidationError.NothingToUpdate(FieldColumnNames),
  ),
);

export type Label = v.InferOutput<typeof LabelSchema>;
export type UpdateLabel = v.InferOutput<typeof UpdateLabelSchema>;
