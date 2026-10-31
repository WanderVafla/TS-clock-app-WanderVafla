import * as v from "valibot";
import { NamesLength, ValidationError } from "./constants";

const fieldColumn = "id" as const;
const PG_INT4_MAX = 2147483647 as const; // Max postgres number
const MaxSizePage = 100 as const;
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

export const idListQuerySchema = v.pipe(
  v.union([v.string(), v.array(v.string())]),
  v.transform((val): (string | number)[] => (Array.isArray(val) ? val : [val])),
  v.array(idQuerySchema),
  v.minLength(1),
  v.maxLength(MaxSizePage),
);

export const stringSchema = v.pipe(
  v.string(),
  v.trim(),
  v.maxLength(NamesLength.max),
  v.check((s) => !s.includes("\0"), ValidationError.NulByteError),
);

export const paginationParamsSchema = v.object({
  page: v.optional(idQuerySchema),
  sizePage: v.optional(
    v.pipe(
      idQuerySchema,
      v.maxValue(
        MaxSizePage,
        ValidationError.OutSizeRange("sizePage", MaxSizePage),
      ),
    ),
  ),
});

const metadataSchema = v.object({
  page: idQuerySchema,
  sizePage: v.optional(idQuerySchema),
  total: v.number(),
  totalPages: v.number(),
  sorted: stringSchema,
});

export type Metadata = v.InferOutput<typeof metadataSchema>;
