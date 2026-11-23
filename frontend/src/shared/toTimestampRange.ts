export type DayRange = { from?: string; to?: string };

// Midnight of a YYYY-MM-DD day in the user's time zone, `addDays` later
const localMidnight = (day: string, addDays = 0) => {
  const date = new Date(`${day}T00:00`);
  date.setDate(date.getDate() + addDays);
  return date.toISOString();
};

/*
 * Turns days picked in the UI into the API's [from, to) timestamps:
 * from = start of the first day, to = start of the day after the last one,
 * so the last day is included in full.
 */
export function toTimestampRange({ from, to }: DayRange): DayRange {
  return {
    from: from ? localMidnight(from) : undefined,
    to: to ? localMidnight(to, 1) : undefined,
  };
}
