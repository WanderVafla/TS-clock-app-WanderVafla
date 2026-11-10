import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import { LabelSchema } from "../../../backend/src/labels/labels.schema";
import * as v from "valibot"

export const fetchLabels = async () => await fetchData(API_URL.labels, v.array(LabelSchema));
