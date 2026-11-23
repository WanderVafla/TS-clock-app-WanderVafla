import type { DayRange } from "#/shared/toTimestampRange";

type QuickRange = "today" | "week" | "month" | "last30";

const quickRanges: { id: QuickRange; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "last30", label: "Last 30 days" },
];

// Local date as YYYY-MM-DD, the value format of <input type="date">
const toInputDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function rangeDates(range: QuickRange, now = new Date()): DayRange {
  const from = new Date(now);
  if (range === "week") {
    // Weeks start on Monday
    from.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  } else if (range === "month") {
    from.setDate(1);
  } else if (range === "last30") {
    from.setDate(now.getDate() - 29);
  }
  return { from: toInputDate(from), to: toInputDate(now) };
}

/*
 * From / To days with quick ranges. Controlled: the range lives in the URL
 * search params, the parent passes it in and saves the new one on change.
 * A quick range is highlighted while the dates match it.
 */
export function TimeRangeFilter({
  value,
  onChange,
}: {
  value: DayRange;
  onChange: (range: DayRange) => void;
}) {
  const { from, to } = value;
  const isQuick = (id: QuickRange) => {
    const r = rangeDates(id);
    return r.from === from && r.to === to;
  };

  return (
    <form
      aria-label="Time range"
      className="flex flex-wrap items-end gap-4 rounded-[14px] border border-clock-border bg-popover p-4.5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-[0_1_190px] flex-col gap-1.5">
        <label
          htmlFor="range-from"
          className="text-[13px] font-medium text-clock-muted"
        >
          From
        </label>
        <input
          id="range-from"
          type="date"
          value={from ?? ""}
          max={to}
          onChange={(e) => onChange({ from: e.target.value || undefined, to })}
          className="h-11 rounded-[10px] border border-clock-border px-3"
        />
      </div>
      <div className="flex flex-[0_1_190px] flex-col gap-1.5">
        <label
          htmlFor="range-to"
          className="text-[13px] font-medium text-clock-muted"
        >
          To
        </label>
        <input
          id="range-to"
          type="date"
          value={to ?? ""}
          min={from}
          onChange={(e) => onChange({ from, to: e.target.value || undefined })}
          className="h-11 rounded-[10px] border border-clock-border px-3"
        />
      </div>
      <fieldset className="flex flex-wrap gap-1.5">
        <legend className="sr-only">Quick ranges</legend>
        {quickRanges.map((q) => (
          <button
            key={q.id}
            type="button"
            aria-pressed={isQuick(q.id)}
            onClick={() => onChange(rangeDates(q.id))}
            className="
              h-11 cursor-pointer rounded-full border border-clock-border bg-popover px-3.5 text-sm text-clock-muted
              aria-pressed:border-clock-accent aria-pressed:bg-clock-selected
              aria-pressed:font-semibold aria-pressed:text-clock-accent
              "
          >
            {q.label}
          </button>
        ))}
      </fieldset>
    </form>
  );
}
