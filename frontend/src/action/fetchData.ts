import type {
  ApiSuccessResponse,
  ApiSuccessError
} from "../../../backend/src/share/response.ts";
import { metadataSchema } from "../../../backend/src/share/schema.ts";
import * as v from "valibot"

const ApiSuccessResponseSchema = <S extends v.GenericSchema>(schema: S) => v.object({
  data: schema,
  status: v.pipe(v.number(), v.integer()),
  success: v.boolean(),
  metadata: v.optional(metadataSchema)
})
type ApiSuccessResponseOutput<S extends v.GenericSchema> =
  v.InferOutput<ReturnType<typeof ApiSuccessResponseSchema<S>>>;

export const fetchData = async <S extends v.GenericSchema>(URL: string, schema: S, init?: RequestInit): Promise<v.InferOutput<S>> => {
  const res = await fetch(URL, init);
  const json: ApiSuccessResponse<unknown> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  if (!res.ok) throw new Error("Connection Error");

  return v.parse(schema, json.data);
}

export const fetchResponse = async <S extends v.GenericSchema>(URL: string, itemSchema: S, init?: RequestInit): Promise<ApiSuccessResponseOutput<S>> => {
  const res = await fetch(URL, init);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<unknown> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);

  return v.parse(ApiSuccessResponseSchema(itemSchema), json)
}
