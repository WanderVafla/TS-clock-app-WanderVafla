import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import { LabelSchema, type CreateLabel, type UpdateLabel } from "../../../backend/src/labels/labels.schema";
import * as v from "valibot"

export const fetchLabels = async () => await fetchData(API_URL.labels, v.array(LabelSchema));

export const updateLabel = async (data: UpdateLabel) => await fetchData(API_URL.labels, LabelSchema, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const createLabel = async (data: CreateLabel) => await fetchData(API_URL.labels, LabelSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

export const deleteLabel = async (id: number) => await fetchData(`${API_URL.labels}?id=${id}`, v.pick(LabelSchema, ['id']), {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
})
