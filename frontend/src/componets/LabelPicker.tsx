import { useState } from "react";
import type { Label } from "../../../backend/src/labels/labels.schema";

type LabelPickerProps = {
  // id of the popover element, used by the opening button's `popoverTarget`
  id: string;
  labels: Label[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
};

type PickerRow = { divider: string } | { label: Label };

// Without a search: selected labels first, then the others, each under a heading
const buildRows = (
  labels: Label[],
  selectedIds: number[],
  query: string,
): PickerRow[] => {
  const search = query.trim().toLowerCase();
  if (search) {
    return labels
      .filter((l) => l.name.toLowerCase().includes(search))
      .map((label) => ({ label }));
  }

  const selected = labels.filter((l) => selectedIds.includes(l.id));
  if (selected.length === 0) return labels.map((label) => ({ label }));

  const others = labels.filter((l) => !selectedIds.includes(l.id));
  return [
    { divider: "Selected" },
    ...selected.map((label) => ({ label })),
    { divider: "All labels" },
    ...others.map((label) => ({ label })),
  ];
};

// Popover with a searchable list of every label, opened next to the clock popover
export function LabelPicker({
  id,
  labels,
  selectedIds,
  onToggle,
  onClear,
}: LabelPickerProps) {
  const [query, setQuery] = useState("");
  const rows = buildRows(labels, selectedIds, query);

  return (
    <div
      id={id}
      popover="auto"
      role="dialog"
      aria-label="Choose labels"
      className="
        [position-anchor:--clock-popover]
        inset-auto m-0
        left-[calc(anchor(right)+8px)]
        top-[anchor(top)]
        [position-try-fallbacks:flip-inline]
        w-75 max-w-full p-4
        flex-col gap-3 [&:popover-open]:flex
        rounded-[14px] border border-[#e1e4ea] bg-white text-[#15171c]
        shadow-[0_12px_32px_rgba(21,23,28,0.16)]
        "
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-semibold">Choose labels</span>
        <span className="text-xs text-[#5b6270]">
          {selectedIds.length} selected
        </span>
      </div>

      <label htmlFor={`${id}-search`} className="sr-only">
        Search labels
      </label>
      <input
        id={`${id}-search`}
        type="search"
        placeholder="Search labels"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-11 rounded-[10px] border border-[#c9ced8] px-3 text-sm"
      />

      <fieldset
        aria-label="Labels"
        className="-mx-1 flex max-h-66 flex-col gap-0.5 overflow-y-auto px-1"
      >
        {rows.map((row) => {
          if ("divider" in row) {
            return (
              <span
                key={row.divider}
                className="px-2 pt-2 pb-1 text-[11px] font-semibold tracking-[0.04em] text-[#5b6270] uppercase"
              >
                {row.divider}
              </span>
            );
          }

          const { label } = row;
          const isOn = selectedIds.includes(label.id);
          return (
            <button
              key={label.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(label.id)}
              className="
                flex min-h-9 shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-2
                text-left text-sm hover:bg-[#f7f8fa]
                aria-pressed:bg-[#e8edfb] aria-pressed:font-semibold aria-pressed:text-[#1a3596]
                "
            >
              <span
                aria-hidden="true"
                className={`flex size-4.5 shrink-0 items-center justify-center rounded border ${
                  isOn
                    ? "border-[#2449c9] bg-[#2449c9]"
                    : "border-[#c9ced8] bg-white"
                }`}
              >
                {isOn && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5 9-10" />
                  </svg>
                )}
              </span>
              <span className="truncate">{label.name}</span>
            </button>
          );
        })}

        {rows.length === 0 && (
          <p className="m-0 p-2 text-[13px] text-[#5b6270]">
            No label matches “{query}”.
          </p>
        )}
      </fieldset>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="h-10 flex-1 cursor-pointer rounded-[10px] border border-[#c9ced8] bg-white text-sm font-medium"
        >
          Clear
        </button>
        <button
          type="button"
          popoverTarget={id}
          popoverTargetAction="hide"
          className="h-10 flex-1 cursor-pointer rounded-[10px] bg-[#15171c] text-sm font-semibold text-white"
        >
          Done
        </button>
      </div>
    </div>
  );
}
