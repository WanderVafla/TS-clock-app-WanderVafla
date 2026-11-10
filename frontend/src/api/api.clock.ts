import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import * as v from "valibot"

const booleanSchema = v.boolean();

export const fetchClockStatus = () => fetchData(API_URL.clock, booleanSchema);
