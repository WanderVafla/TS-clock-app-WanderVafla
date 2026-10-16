import { ValidationError } from "../share/constants";
import { EntriesBase, labelIdSchema } from "../entries/entries.schema";
import * as v from "valibot";

const fieldColumn = ["description", "project_id"] as const;
const changeFields = ["project_id", "description", "label"] as const;
export const clockInSchema = v.object({
  ...v.pick(EntriesBase, fieldColumn).entries,
  label: v.optional(labelIdSchema),
});

export const clockChangeSchema = v.pipe(
  v.object({
    ...v.partial(v.pick(EntriesBase, fieldColumn)).entries,
    label: v.optional(labelIdSchema),
  }),
  v.check(
    (input) => Object.keys(input).length > 0,
    ValidationError.NothingToUpdate(changeFields),
  ),
);

export type ClockIn = v.InferOutput<typeof clockInSchema>;
export type ClockChange = v.InferOutput<typeof clockChangeSchema>;
