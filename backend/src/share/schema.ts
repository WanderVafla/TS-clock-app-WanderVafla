import * as v from "valibot";
import { NamesLength, ValidationError } from "./constants";

const fieldColumn = "id" as const;
const PG_INT4_MAX = 2147483647; // Max postgres number 

/* Schema check all id from routing */

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
  v.maxValue(
    PG_INT4_MAX,
    ValidationError.NumberTooLarge(fieldColumn, PG_INT4_MAX),
  ),
);

export const stringSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(NamesLength.max),
  v.check((s) => !s.includes("\0"), ValidationError.NulByteError),
);
