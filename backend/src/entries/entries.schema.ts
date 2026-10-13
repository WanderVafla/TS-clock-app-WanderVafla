import * as v from "valibot";
import {
  idQuerySchema,
  paginationParamsSchema,
  stringSchema,
} from "../share/schema";
import { ValidationError } from "../share/constants";

type TimeRange = {
  start_time?: string | null;
  end_time?: string | null;
};
const FieldColumnNames = ["description"] as const;
const UpdateDataColumns = [
  ...FieldColumnNames,
  "end_time",
  "start_time",
] as const;

const isEndNotBeforeStart = ({ start_time, end_time }: TimeRange) =>
  start_time == null ||
  end_time == null ||
  new Date(end_time) >= new Date(start_time);

const EntriesBase = v.object({
  id: idQuerySchema,
  start_time: v.pipe(
    v.string(),
    v.isoTimestamp(ValidationError.DateNotCorrect),
  ),
  end_time: v.nullish(
    v.pipe(v.string(), v.isoTimestamp(ValidationError.DateNotCorrect)),
  ),
  description: v.nullish(v.pipe(stringSchema)),
  project_id: idQuerySchema,
});

export const EntriesSchema = v.pipe(
  EntriesBase,
  v.forward(
    v.partialCheck(
      [["start_time"], ["end_time"]],
      ({ start_time, end_time }) =>
        start_time == null ||
        end_time == null ||
        new Date(end_time) >= new Date(start_time),
      ValidationError.ValueIsLessThatValue("end_time", "start_time", "less"),
    ),
    ["end_time"],
  ),
);

export const CreateEntriesSchema = v.pipe(
  v.object({
    project_id: EntriesBase.entries.project_id,
    ...v.partial(v.pick(EntriesBase, FieldColumnNames)).entries,
  }),
);

export const UpdateEntriesSchema = v.pipe(
  v.object({
    id: EntriesBase.entries.id,
    ...v.partial(v.pick(EntriesBase, UpdateDataColumns)).entries,
  }),
  v.check(
    (i) => Object.keys(i).some((k) => k !== "id"),
    ValidationError.NothingToUpdate(FieldColumnNames),
  ),
  v.forward(
    v.partialCheck(
      [["start_time"], ["end_time"]],
      isEndNotBeforeStart,
      ValidationError.ValueIsLessThatValue("end_time", "start_time", "less"),
    ),
    ["end_time"],
  ),
);

export const QueryParamsGetEntriesSchema = v.pipe(
  v.object({
    id: v.optional(idQuerySchema),
    project_id: v.optional(idQuerySchema),
    ...paginationParamsSchema.entries,
    order: v.optional(v.pipe(stringSchema, v.keyof(EntriesBase)))
    
  }),
  v.forward(
    v.partialCheck(
      [["page"], ["sizePage"]],
      (input) => input.page === undefined || input.sizePage !== undefined,
      ValidationError.HaveRequireFields(["sizePage"]),
    ),
    ["page"],
  ),
);

export type Entries = v.InferOutput<typeof EntriesSchema>;
export type UpdateEntier = v.InferOutput<typeof UpdateEntriesSchema>;
export type CreateEntries = v.InferOutput<typeof CreateEntriesSchema>;
export type QueryParamsGetEntries = v.InferOutput<
  typeof QueryParamsGetEntriesSchema
>;
/* labels_time_entrie */

export const EntryLabelLinkSchema = v.object({
  time_entry_id: idQuerySchema,
  label_id: idQuerySchema,
});

export type EntryLabelLink = v.InferOutput<typeof EntryLabelLinkSchema>;
