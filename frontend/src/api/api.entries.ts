import { fetchData, fetchResponse } from "#/shared/fetchData.ts";
import { ErrorMessage } from "#/contants/messages.ts";
import { API_URL } from "#/contants/url.ts";
import { EntriesSchema, type CreateEntries, type Entries, type UpdateEntier } from "../../../backend/src/entries/entries.schema";
import type { EntriesFetch } from "./api.types";
import type { QueryParamsGetEntries } from "../../../backend/src/entries/entries.schema.ts";
import * as v from "valibot"

export const fetchEntries = async (deps: QueryParamsGetEntries): Promise<EntriesFetch> => {
  const {data, metadata} = await fetchResponse(API_URL.entries(deps), v.array(EntriesSchema));
  if (!metadata) {
    // Metadata is required for entries and backend always return metadata for GET /entries
    throw new Error(ErrorMessage.NotFoundMetadata)
  }
  return {data, metadata};
}

export const createEntry = async (entryData: CreateEntries): Promise<Entries> => {
  const resp = await fetchData(API_URL.entries(), EntriesSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entryData),
  })

  return resp
}


export const updateEntry = async (entryData: UpdateEntier): Promise<Entries> => {
  const resp = await fetchData(API_URL.entries(), EntriesSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entryData),
  })

  return resp
}
