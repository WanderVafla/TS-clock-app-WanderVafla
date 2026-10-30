import { ErrorMessage } from "#/contants/messages.ts";
import type {
  ApiSuccessResponse,
  ApiSuccessError,
} from "../../../backend/src/share/response.ts";
import type { EntriesFetch, EntriesSearch, Entry } from "./api.types.ts"



export const fetchEntries = async ({ page, sizePage }: EntriesSearch): Promise<EntriesFetch> => {
  const res = await fetch(`/api/entries?page=${page}&sizePage=${sizePage}`);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<Entry[]> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  if (!json.metadata) {
    // Metadata is required for entries and backend always return metadata for GET /entries
    throw new Error(ErrorMessage.NotFoundMetadata)
  }
  return {data: json.data, metadata: json.metadata};
}
