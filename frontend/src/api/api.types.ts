import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { paginationParamsSchema, type Metadata } from "../../../backend/src/share/schema.ts";
import * as v from "valibot";

export type Entry = {
  id: number;
  start_time: string;
  end_time: string | null;
  description: string | null;
  project_id: number;
};

export type EntryItem = {
  start_time: string;
  end_time: string;
  description: string;
  project_id: number;
  project_name: string;
  label?: Label[]
};

export type EntriesFetch = {
  data: Entry[],
  metadata: Metadata
}

export const EntriesSearchSchema = v.object({
  page: v.optional(v.unwrap(paginationParamsSchema.entries.page), 1),
  sizePage: v.optional(v.unwrap(paginationParamsSchema.entries.sizePage), 15),
});

export type EntriesSearch = v.InferOutput<typeof EntriesSearchSchema>;