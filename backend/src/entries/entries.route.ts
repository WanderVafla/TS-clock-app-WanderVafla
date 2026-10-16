import Elysia from "elysia";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { DescriptionDocs } from "../share/constants";
import { respondSuccess } from "../share/response";
import {
  createEntry,
  deleteEntier,
  getEntries,
  updateEntier,
} from "./entries.repository";
import {
  type UpdateEntier,
  UpdateEntriesSchema,
  CreateEntriesSchema,
  QueryParamsGetEntriesSchema,
} from "./entries.schema";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .get(
    "",
    async ({ query, set }) => {
      const [data, metadata] = await getEntries(query);
      return respondSuccess(data, set.status, metadata);
    },
    {
      query: QueryParamsGetEntriesSchema,
    },
  )
  .post(
    "",
    async ({ body, set }) => {
      const data = await createEntry(body);
      set.status = 201;
      return respondSuccess(data, set.status);
    },
    {
      body: CreateEntriesSchema,
    },
  )

  .delete(
    "",
    async ({ query: { id }, set }) => {
      const data = await deleteEntier(id);
      set.status = 200;
      return respondSuccess(data, set.status);
    },
    {
      query: v.object({
        id: idQuerySchema,
      }),
      detail: DescriptionDocs.detailLabelDelete,
    },
  )
  .patch(
    "",
    async ({ body, set }) => {
      const updatedLabel: UpdateEntier = await updateEntier(body);
      return respondSuccess(updatedLabel, set.status);
    },
    {
      body: UpdateEntriesSchema,
    },
  )
