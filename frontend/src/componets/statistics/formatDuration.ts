// 1930 -> "32h 10m"
export function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const rest = String(minutes % 60).padStart(2, "0");
	return `${hours}h ${rest}m`;
}

// Share of a part in a total, rounded to a whole percent
export function percentOf(part: number, total: number): number {
	return total > 0 ? Math.round((part / total) * 100) : 0;
}
