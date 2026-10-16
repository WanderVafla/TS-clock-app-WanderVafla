import * as v from "valibot";
import { idQuerySchema } from "../share/schema";

export const EntryLabelLinkSchema = v.object({
  time_entry_id: idQuerySchema,
  label_id: idQuerySchema,
});

export type EntryLabelLink = v.InferOutput<typeof EntryLabelLinkSchema>;
