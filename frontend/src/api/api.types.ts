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
  page: v.optional(paginationParamsSchema.entries.page),
  sizePage: v.optional(paginationParamsSchema.entries.sizePage),
  // Days as YYYY-MM-DD, both included; turned into timestamps by toTimestampRange
  from: v.optional(v.pipe(v.string(), v.isoDate())),
  to: v.optional(v.pipe(v.string(), v.isoDate())),
});

export type EntriesSearch = v.InferOutput<typeof EntriesSearchSchema>;

// Statistics page: any string is kept, dayRangeError checks the dates and the page shows the error beside the filter
export const StatisticsSearchSchema = v.object({
  from: v.optional(v.string()),
  to: v.optional(v.string()),
});
