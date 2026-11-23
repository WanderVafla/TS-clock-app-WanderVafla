import * as v from "valibot";
import { isToAfterFrom, timeRangeEntries } from "../entries/entries.schema";
import { ValidationError } from "../share/constants";
import { idQuerySchema, stringSchema } from "../share/schema";

export const QueryParamsStatisticsSchema = v.pipe(
  v.object({ ...timeRangeEntries }),
  v.forward(
    v.partialCheck(
      [["from"], ["to"]],
      isToAfterFrom,
      ValidationError.ValueIsLessThatValue("to", "from", "less"),
    ),
    ["to"],
  ),
);

/* Tracked minutes of one project or label */
export const StatisticsRowSchema = v.object({
  id: idQuerySchema,
  name: stringSchema,
  minutes: v.number(),
});

export const StatisticsSchema = v.object({
  totalMinutes: v.number(),
  entriesCount: v.number(),
  projects: v.array(StatisticsRowSchema),
  labels: v.array(StatisticsRowSchema),
});

export type QueryParamsStatistics = v.InferOutput<
  typeof QueryParamsStatisticsSchema
>;
export type StatisticsRow = v.InferOutput<typeof StatisticsRowSchema>;
export type Statistics = v.InferOutput<typeof StatisticsSchema>;
