import Elysia from "elysia";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { LabelSchema, type UpdateLabel, UpdateLabelSchema } from "./labels.schema";
import { createLabel, deleteLabel, getLabels, updateLabel } from "./labels.repository";
import { DescriptionDocs } from "../share/constants";
import { respondSuccess } from "../share/response";

export const labelsRoute = new Elysia({ prefix: "/labels" })
	.get("", async ({ set }) => {
		const data = await getLabels();
		return respondSuccess(data, set.status);
	})
	.post(
		"",
		async ({ body, set }) => {
			const data = await createLabel(body);
			set.status = 201;
			return respondSuccess(data, set.status);
		},
		{
			body: v.omit(LabelSchema, ["id"]),
		},
	)
	.delete(
		"",
		async ({ query: { id }, set }) => {
			const data = await deleteLabel(id);
			set.status = 200;
			return respondSuccess(data, set.status);
		},
		{
			query: v.object({ id: idQuerySchema }),
			detail: DescriptionDocs.detailLabelDelete
		},
	)
	.patch(
		"",
		async ({ body, set }) => {
			const updatedLabel: UpdateLabel = await updateLabel(body);
			return respondSuccess(updatedLabel, set.status);
		},
		{
			body: UpdateLabelSchema,
		},
	);
