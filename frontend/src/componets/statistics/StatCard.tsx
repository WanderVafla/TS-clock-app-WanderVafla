// One key figure of the statistics page (total tracked, entries, top project)
export function StatCard({
	title,
	value,
	suffix,
	mono = true,
}: {
	title: string;
	value: string;
	// Shown after the value and never cut, e.g. the share of the top project
	suffix?: string;
	// Durations and counts use the monospace font, names do not
	mono?: boolean;
}) {
	return (
		<div className="flex min-w-0 flex-col gap-1.5 rounded-[14px] border border-clock-border bg-popover p-4.5">
			<span className="text-[13px] text-clock-muted">{title}</span>
			<div
				className={`flex min-w-0 font-semibold ${mono ? "font-mono text-3xl" : "text-2xl leading-9"}`}
			>
				{/* A long value is cut with "…"; the full value shows on hover */}
				<span className="min-w-0 truncate" title={value}>
					{value}
				</span>
				{suffix && (
					<span className="shrink-0 whitespace-pre">{suffix}</span>
				)}
			</div>
		</div>
	);
}
