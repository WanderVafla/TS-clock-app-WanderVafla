import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import { ProjectSchema, type CreateProject, type UpdateProject } from "../../../backend/src/projects/projects.schema";
import * as v from "valibot"

export const fetchProjects = async () => await fetchData(API_URL.project, v.array(ProjectSchema));

export const updateProject = async (data: UpdateProject) => await fetchData(API_URL.project, ProjectSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const createProject = async (data: CreateProject) => await fetchData(API_URL.project, ProjectSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const deleteProject = async (id: number) => await fetchData(`${API_URL.project}?id=${id}`, v.pick(ProjectSchema, ['id']), {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
})
