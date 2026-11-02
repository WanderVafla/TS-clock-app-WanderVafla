import * as v from "valibot";
import { idListQuerySchema, idQuerySchema } from "../share/schema";

export const EntryLabelLinkSchema = v.object({
  time_entry_id: idQuerySchema,
  label_id: idQuerySchema,
});

export const QueryEntryLabelLinkSchema = v.object({
  time_entry_id: v.optional(idListQuerySchema),
  label_id: v.optional(idListQuerySchema),
});

export type EntryLabelLink = v.InferOutput<typeof EntryLabelLinkSchema>;
