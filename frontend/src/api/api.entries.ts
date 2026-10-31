import { fetchResponse } from "#/action/fetchData.ts";
import { ErrorMessage } from "#/contants/messages.ts";
import { API_URL } from "#/contants/url.ts";
import type { EntriesFetch, EntriesSearch, Entry } from "./api.types.ts"


export const fetchEntries = async (deps: EntriesSearch): Promise<EntriesFetch> => {
  const {data, metadata} = await fetchResponse<Entry[]>(API_URL.entries(deps));
  if (!metadata) {
    // Metadata is required for entries and backend always return metadata for GET /entries
    throw new Error(ErrorMessage.NotFoundMetadata)
  }
  return {data, metadata};
}
