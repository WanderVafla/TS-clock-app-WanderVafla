import * as v from "valibot";

export const idQuerySchema = v.pipe(
  v.string("id mush be string to first"),
  v.trim(),
  v.minLength(1),
  v.transform((val) => Number(val)),
  v.number("id not is number"),
  v.integer("id mush be intenger"),
  v.minValue(1, "id must be a positive integer (>= 1)"),
);
