import Elysia from "elysia";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { DescriptionDocs } from "../share/constants";
import { respondSuccess } from "../share/response";
import {
  createEntier,
  createEntryLabel,
  deleteEntier,
  deleteEntryLabel,
  getEntries,
  getEntryLabels,
  updateEntier,
} from "./entries.repository";
import {
  type UpdateEntier,
  UpdateEntriesSchema,
  CreateEntriesSchema,
  EntryLabelLinkSchema,
} from "./entries.schema";

export const entriesRoute = new Elysia({ prefix: "/entries" })
  .get(
    "",
    async ({ query, set }) => {
      const data = await getEntries(query);
      return respondSuccess(data, set.status);
    },
    {
      query: v.object({
        id: v.optional(idQuerySchema),
        project_id: v.optional(idQuerySchema),
      }),
    },
  )
  .post(
    "",
    async ({ body, set }) => {
      const data = await createEntier(body);
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
  /* CRUD labels_time_entrie */

  .get(
    "/labels",
    async ({ query, set }) => {
      const data = await getEntryLabels(query);
      return respondSuccess(data, set.status);
    },
    {
      query: v.object({
        label_id: v.optional(idQuerySchema),
        time_entry_id: v.optional(idQuerySchema),
      }),
    },
  )
  .post(
    "/labels",
    async ({ body, set }) => {
      const data = await createEntryLabel(body);
      set.status = 201;
      return respondSuccess(data, set.status);
    },
    {
      body: EntryLabelLinkSchema,
    },
  )
  .delete(
    "/labels",
    async ({ query, set }) => {
      const data = await deleteEntryLabel(query);
      set.status = 200;
      return respondSuccess(data, set.status);
    },
    {
      query: EntryLabelLinkSchema,
      detail: DescriptionDocs.detailLabelDelete,
    },
  )
