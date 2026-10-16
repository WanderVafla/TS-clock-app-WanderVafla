import Elysia from "elysia";
import * as v from "valibot";
import {
  createEntryLabel,
  deleteEntryLabel,
  getEntryLabels,
} from "./entries_labels.repository";
import { respondSuccess } from "../share/response";
import { idQuerySchema } from "../share/schema";
import { EntryLabelLinkSchema } from "./entries_labels.schema";
import { DescriptionDocs } from "../share/constants";

export const entriesLabelsRoute = new Elysia({ prefix: "/entries/label" })
  .get(
    "",
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
    "",
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
    "",
    async ({ query, set }) => {
      const data = await deleteEntryLabel(query);
      set.status = 200;
      return respondSuccess(data, set.status);
    },
    {
      query: EntryLabelLinkSchema,
      detail: DescriptionDocs.detailLabelDelete,
    },
  );
