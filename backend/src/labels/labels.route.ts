import Elysia from "elysia";
import { idQuerySchema } from "../share/schema";
import * as v from "valibot";
import { LabelSchema, type UpdateLabel, UpdateLabelSchema } from "./labels.schema";
import { createLabel, deleteLabel, getLabels, updateLabel } from "./labels.repository";
import { DescriptionDocs } from "../share/constants";

export const labelsRoute = new Elysia({ prefix: "/labels" })
	.get("", async () => await getLabels())
	.post(
		"",
		async ({ body }) => {
			return await createLabel(body);
		},
		{
			body: v.omit(LabelSchema, ["id"]),
		},
	)
	.delete(
		"",
		async ({ query: { id } }) => {
			return await deleteLabel(id);
		},
		{
			query: v.object({ id: idQuerySchema }),
			detail: DescriptionDocs.detailLabelDelete
		},
	)
	.patch(
		"",
		async ({ body }) => {
			const updatedLabel: UpdateLabel = await updateLabel(body);
			return updatedLabel;
		},
		{
			body: UpdateLabelSchema,
		},
	);
