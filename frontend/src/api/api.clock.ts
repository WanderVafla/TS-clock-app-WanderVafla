import { fetchData } from "#/shared/fetchData";
import { API_URL } from "#/contants/url";
import * as v from "valibot"
import { EntriesSchema, type Entries } from "../../../backend/src/entries/entries.schema";
import type { ClockChange, ClockIn } from "../../../backend/src/clock/clock.schema";

const booleanSchema = v.boolean();

export const fetchClockStatus = () => fetchData(API_URL.clock.state, booleanSchema);

export const clockIn = (clockIn: ClockIn) => fetchData(API_URL.clock.in, EntriesSchema, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(clockIn)
})

export const clockOut = () => fetchData(API_URL.clock.out, EntriesSchema, {
  method: "POST",
} )

// Closes the running entry and opens a new one with the changed fields
export const clockChange = (data: ClockChange): Promise<Entries> =>
  fetchData(API_URL.clock.change, EntriesSchema, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
