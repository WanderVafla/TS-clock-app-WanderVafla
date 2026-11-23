// One key figure of the statistics page (total tracked, entries, top project)
export function StatCard({
	title,
	value,
	mono = true,
}: {
	title: string;
	value: string;
	// Durations and counts use the monospace font, names do not
	mono?: boolean;
}) {
	return (
		<div className="flex flex-col gap-1.5 rounded-[14px] border border-clock-border bg-popover p-4.5">
			<span className="text-[13px] text-clock-muted">{title}</span>
			<span
				className={`font-semibold ${mono ? "font-mono text-3xl" : "text-2xl leading-9"}`}
			>
				{value}
			</span>
		</div>
	);
}
