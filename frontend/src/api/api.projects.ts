import type {
  ApiSuccessResponse,
  ApiSuccessError,
} from "../../../backend/src/share/response.ts";

import type { Project } from "../../../backend/src/projects/projects.schema.ts"

export const fetchProjects = async (): Promise<ApiSuccessResponse<Project[]>> => {
  const res = await fetch(`/api/projects`);
  if (!res.ok) throw new Error("Connection Error");
  const json: ApiSuccessResponse<Project[]> | ApiSuccessError =
    await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}
