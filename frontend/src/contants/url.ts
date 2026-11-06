import type { QueryParamsGetEntries } from "../../../backend/src/entries/entries.schema.ts";

export const API_URL = {
  entries_labels: (entries?: number | number[]) => `/api/entries/label${entries ? `?time_entry_id=${Array.isArray(entries) ? entries.join(",") : entries}` : ""}`,
  labels: "/api/labels",
  project: "/api/projects",
  entries: (deps?: QueryParamsGetEntries) => `/api/entries${deps ? `?${new URLSearchParams(Object.entries(deps).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))}` : ""}`,
  clock: "/api/clock",
}
