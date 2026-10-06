import * as v from "valibot";
import { idQuerySchema, stringSchema } from "../share/schema";
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

const EntiersBase = v.object({
  id: idQuerySchema,
  start_time: v.pipe(v.string(), v.isoTimestamp(ValidationError.DateNotCorrect)),
  end_time: v.nullish(v.pipe(v.string(), v.isoTimestamp(ValidationError.DateNotCorrect))),
  description: v.nullish(v.pipe(stringSchema)),
  project_id: idQuerySchema,
});

export const EntiersSchema = v.pipe(
  EntiersBase,
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

export const CreateEntiersSchema = v.pipe(
  v.object({
    project_id: EntiersBase.entries.project_id,
    ...v.partial(v.pick(EntiersBase, FieldColumnNames)).entries,
  }),
);

export const UpdateEntiersSchema = v.pipe(
  v.object({
    id: EntiersBase.entries.id,
    ...v.partial(v.pick(EntiersBase, UpdateDataColumns)).entries,
  }),
  v.check(
    (i) => Object.keys(i).some((k) => k !== "id"),
    ValidationError.NothingToUpdate(FieldColumnNames),
  ),
  v.forward(
    v.partialCheck(
      [["start_time"], ["end_time"]],
      isEndNotBeforeStart,
      ValidationError.ValueIsLessThatValue("start_time", "end_time", "less"),
    ),
    ["end_time"],
  ),
);

export type Entiers = v.InferOutput<typeof EntiersSchema>;
export type UpdateEntier = v.InferOutput<typeof UpdateEntiersSchema>;
export type CreateEntiers = v.InferOutput<typeof CreateEntiersSchema>;

/* labels_time_entrie */

export const EntryLabelLinkSchema = v.object({
  time_entry_id: idQuerySchema,
  label_id: idQuerySchema,
});

export type EntryLabelLink = v.InferOutput<typeof EntryLabelLinkSchema>;
