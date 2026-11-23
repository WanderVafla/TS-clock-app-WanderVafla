import type { ReactNode } from "react";
import { formatDuration, percentOf } from "./formatDuration";
import type { StatisticsRow } from "../../../../backend/src/statistics/statistics.schema";

// Card with one bar per row: hours of each project or label, scaled on the total
export function HoursBreakdown({
	title,
	rows,
	totalMinutes,
	showShare = false,
	note,
}: {
	title: string;
	rows: StatisticsRow[];
	totalMinutes: number;
	showShare?: boolean;
	note?: ReactNode;
}) {
	return (
		<section className="flex min-w-0 flex-[1_1_380px] flex-col gap-4.5 rounded-[14px] border border-clock-border bg-popover p-6">
			<h2 className="text-base font-semibold tracking-normal">{title}</h2>
			{rows.map((row) => {
				const share = percentOf(row.minutes, totalMinutes);
				return (
					<div key={row.id} className="flex flex-col gap-2">
						<div className="flex justify-between gap-3 text-[15px]">
							{/* Long names are cut with "…"; the full name shows on hover */}
							<span className="min-w-0 truncate font-medium" title={row.name}>
								{row.name}
							</span>
							{/* Never shrinks, so the duration always stays inside the card */}
							<span className="shrink-0 whitespace-nowrap">
								<span className="font-mono">{formatDuration(row.minutes)}</span>
								{showShare && (
									<span className="text-clock-muted"> · {share}%</span>
								)}
							</span>
						</div>
						<div className="h-2.5 overflow-hidden rounded-full bg-clock-selected">
							<div
								className="h-full rounded-full bg-clock-accent"
								style={{ width: `${share}%` }}
							/>
						</div>
					</div>
				);
			})}
			{note && <p className="text-[13px] text-clock-muted">{note}</p>}
		</section>
	);
}
