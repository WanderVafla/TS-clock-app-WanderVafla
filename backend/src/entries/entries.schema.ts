import * as v from "valibot";
import {
  emptyToNull,
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
  "project_id",
] as const;

const isoTimestampSchema = v.pipe(
  v.string(),
  v.isoTimestamp(ValidationError.DateNotCorrect),
);

/* Optional [from, to) range, shared by the entries list and the statistics */
export const timeRangeEntries = {
  from: v.optional(isoTimestampSchema),
  to: v.optional(isoTimestampSchema),
};

export const isToAfterFrom = ({
  from,
  to,
}: {
  from?: string;
  to?: string;
}): boolean => from == null || to == null || new Date(to) > new Date(from);

const isEndNotBeforeStart =({ start_time, end_time }: TimeRange) =>
  start_time == null ||
  end_time == null ||
  new Date(end_time) > new Date(start_time);

export const EntriesBase = v.object({
  id: idQuerySchema,
  start_time: v.pipe(
    v.string(),
    v.isoTimestamp(ValidationError.DateNotCorrect),
  ),
  end_time: v.nullish(
    emptyToNull(
      v.pipe(v.string(), v.isoTimestamp(ValidationError.DateNotCorrect)),
    ),
  ),
  description: v.nullish(emptyToNull(stringSchema)),
  project_id: idQuerySchema,
});

export const labelIdSchema = v.array(idQuerySchema);

export const EntriesSchema = v.pipe(
  EntriesBase,
  v.forward(
    v.partialCheck(
      [["start_time"], ["end_time"]],
      ({ start_time, end_time }) =>
        start_time == null ||
        end_time == null ||
        new Date(end_time) > new Date(start_time),
      ValidationError.ValueIsLessThatValue("end_time", "start_time", "less"),
    ),
    ["end_time"],
  ),
);

export const CreateEntriesSchema = v.pipe(
  v.object({
    project_id: EntriesBase.entries.project_id,
    start_time: EntriesBase.entries.start_time,
    end_time: EntriesBase.entries.end_time,
    ...v.partial(v.pick(EntriesBase, FieldColumnNames)).entries,
    label: v.optional(labelIdSchema),
  }),
  v.check(
    (i) => i.end_time != null || new Date(i.start_time) <= new Date(),
    ValidationError.StartTimeInFuture,
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

export const UpdateEntriesSchema = v.pipe(
  v.object({
    id: EntriesBase.entries.id,
    ...v.partial(v.pick(EntriesBase, UpdateDataColumns)).entries,
    label: v.optional(labelIdSchema),
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
    // Time range: keeps the entries that overlap [from, to), running ones included
    ...timeRangeEntries,
    ...paginationParamsSchema.entries,
    order: v.optional(v.pipe(stringSchema, v.keyof(EntriesBase))),
  }),
  v.forward(
    v.partialCheck(
      [["page"], ["sizePage"]],
      (input) => input.page === undefined || input.sizePage !== undefined,
      ValidationError.HaveRequireFields(["sizePage"]),
    ),
    ["page"],
  ),
  v.forward(
    v.partialCheck(
      [["from"], ["to"]],
      isToAfterFrom,
      ValidationError.ValueIsLessThatValue("to", "from", "less"),
    ),
    ["to"],
  ),
);

export type Entries = v.InferOutput<typeof EntriesSchema>;
export type UpdateEntier = v.InferOutput<typeof UpdateEntriesSchema>;
export type CreateEntries = v.InferOutput<typeof CreateEntriesSchema>;
export type QueryParamsGetEntries = v.InferOutput<
  typeof QueryParamsGetEntriesSchema
>;
