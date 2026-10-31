import type {
  ApiSuccessResponse,
  ApiSuccessError,
} from "../../../backend/src/share/response.ts";


export const fetchData = async <T>(URL: string): Promise<T> => {
  const res = await fetch(URL);
  const json: ApiSuccessResponse<T> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  if (!res.ok) throw new Error("Connection Error");

  return json.data;
}

export const fetchResponse = async<T>(URL: string): Promise<ApiSuccessResponse<T>> => {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<T> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);

  return json;
}
