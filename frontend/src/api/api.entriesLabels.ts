import { fetchData } from "#/action/fetchData";
import { API_URL } from "#/contants/url";
import * as v from "valibot"
import { EntryLabelLinkSchema } from "../../../backend/src/entries_labels/entries_labels.schema";

export const fetchEntriesLabels = async (entries?: number[]) => await fetchData(API_URL.entries_labels(entries), v.array(EntryLabelLinkSchema));
