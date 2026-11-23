import type { ReactNode } from "react";

// Top of a page: title and short subtitle on the left, main action button on the right
export function PageHeader({
	title,
	subtitle,
	action,
}: {
	title: string;
	subtitle?: string;
	action?: ReactNode;
}) {
	return (
		<header className="flex flex-wrap items-end justify-between gap-3">
			<div className="flex flex-col gap-1">
				<h1 className="m-0 text-[28px] font-semibold tracking-normal">
					{title}
				</h1>
				{subtitle && (
					<span className="text-sm text-clock-muted">{subtitle}</span>
				)}
			</div>
			{action}
		</header>
	);
}
