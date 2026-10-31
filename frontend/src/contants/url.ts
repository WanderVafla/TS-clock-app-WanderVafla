import type { EntriesSearch } from "#/api/api.types";

export const API_URL = {
  entries_labels: (entries?: number | number[]) => `/api/entries/label${entries ? `?time_entry_id=${Array.isArray(entries) ? entries.join(",") : entries}` : ""}`,
  labels: "/api/labels",
  project: "/api/projects",
  entries: ({ page, sizePage }: EntriesSearch) => `/api/entries?page=${page}&sizePage=${sizePage}`
}
