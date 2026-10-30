import type {
  ApiSuccessResponse,
  ApiSuccessError,
} from "../../../backend/src/share/response.ts";

import type { Label } from "../../../backend/src/labels/labels.schema.ts"


export const fetchLabels = async (): Promise<Label[]> => {
  const res = await fetch(`/api/labels`);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<Label[]> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
