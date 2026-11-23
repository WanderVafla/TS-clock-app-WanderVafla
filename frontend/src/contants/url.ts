import type { QueryParamsGetEntries } from "../../../backend/src/entries/entries.schema.ts";
import type { QueryParamsStatistics } from "../../../backend/src/statistics/statistics.schema.ts";

// "?a=1&b=2" from an object, undefined values left out; "" when nothing is left
const toQuery = (params: Record<string, unknown> = {}) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return query ? `?${query}` : "";
};

export const API_URL = {
  entries_labels: (entries?: number | number[]) => `/api/entries/label${entries ? `?time_entry_id=${Array.isArray(entries) ? entries.join(",") : entries}` : ""}`,
  labels: "/api/labels",
  project: "/api/projects",
  entries: (deps?: QueryParamsGetEntries) => `/api/entries${deps ? `?${new URLSearchParams(Object.entries(deps).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))}` : ""}`,
  statistics: (range?: QueryParamsStatistics) => `/api/statistics${toQuery(range)}`,
  clock: {
    state: "/api/clock",
    in: "/api/clock/in",
    out: "/api/clock/out",
    change: "/api/clock/change",
  },
}
