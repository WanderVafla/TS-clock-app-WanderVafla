import type { Entries } from "../../../backend/src/entries/entries.schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { paginationParamsSchema, type Metadata } from "../../../backend/src/share/schema.ts";
import * as v from "valibot";

export type EntryItem = (Entries & { project_name: string } & { labels: Label[] });

export type EntriesFetch = {
  data: Entries[],
  metadata: Metadata
}

export const EntriesSearchSchema = v.object({
  page: v.optional(v.unwrap(paginationParamsSchema.entries.page), 1),
  sizePage: v.optional(v.unwrap(paginationParamsSchema.entries.sizePage), 15),
});

export type EntriesSearch = v.InferOutput<typeof EntriesSearchSchema>;
