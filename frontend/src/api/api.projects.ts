import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import { ProjectSchema } from "../../../backend/src/projects/projects.schema";
import * as v from "valibot"

export const fetchProjects = async () => await fetchData(API_URL.project, v.array(ProjectSchema));
