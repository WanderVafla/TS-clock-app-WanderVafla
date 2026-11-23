import { ErrorMessage } from "#/contants/messages";
import type { DayRange } from "./toTimestampRange";

// A YYYY-MM-DD string that is a real calendar day (2026-02-31 is not)
const isRealDay = (day: string) => {
  const date = new Date(`${day}T00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const back = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return back === day;
};

/*
 * Checks a range of days before it is sent to the API.
 * Returns the error message, or null when the range is valid.
 * The same day for from and to is valid: the whole day is included.
 */
export function dayRangeError({ from, to }: DayRange): string | null {
  if ((from && !isRealDay(from)) || (to && !isRealDay(to))) {
    return ErrorMessage.InvalidDate;
  }
  // YYYY-MM-DD strings sort like the dates they hold
  if (from && to && from > to) {
    return ErrorMessage.FromAfterTo;
  }
  return null;
}
