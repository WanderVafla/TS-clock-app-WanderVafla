import * as v from "valibot";
import { ValidationError } from "./constants";

const fieldColumn = "id" as const;

export const idQuerySchema = v.pipe(
  v.union([
    v.pipe(
      v.string(ValidationError.ValueMustBeStringToFirst(fieldColumn)),
      v.trim(),
      v.minLength(1),
    ),
    v.number(),
  ]),
  v.transform((val) => Number(val)),
  v.number(ValidationError.NumberMustBeNumber(fieldColumn)),
  v.integer(ValidationError.NumberMustBeInteger(fieldColumn)),
  v.minValue(1, ValidationError.NumberMustBePositive(fieldColumn)),
);
