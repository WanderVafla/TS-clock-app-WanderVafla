import { fetchResponse } from "#/action/fetchData.ts";
import { ErrorMessage } from "#/contants/messages.ts";
import { API_URL } from "#/contants/url.ts";
import { EntriesSchema } from "../../../backend/src/entries/entries.schema";
import type { EntriesFetch, EntriesSearch } from "./api.types";
import * as v from "valibot"

export const fetchEntries = async (deps: EntriesSearch): Promise<EntriesFetch> => {
  const {data, metadata} = await fetchResponse(API_URL.entries(deps), v.array(EntriesSchema));
  if (!metadata) {
    // Metadata is required for entries and backend always return metadata for GET /entries
    throw new Error(ErrorMessage.NotFoundMetadata)
  }
  return {data, metadata};
}
