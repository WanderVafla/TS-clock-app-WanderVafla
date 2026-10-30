import type {
  ApiSuccessResponse,
  ApiSuccessError,
} from "../../../backend/src/share/response.ts";

import type { EntryLabelLink } from "../../../backend/src/entries_labels/entries_labels.schema.ts"


export const fetchEntriesLabels = async (): Promise<EntryLabelLink[]> => {
  const res = await fetch(`/api/entries/label`);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<EntryLabelLink[]> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
