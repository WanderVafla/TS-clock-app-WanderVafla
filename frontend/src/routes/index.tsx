import { createFileRoute } from "@tanstack/react-router";
import {
  formatDuration,
  percentOf,
} from "#/componets/statistics/formatDuration";
import { HoursBreakdown } from "#/componets/statistics/HoursBreakdown";
import { StatCard } from "#/componets/statistics/StatCard";
import {
  rangeDates,
  TimeRangeFilter,
} from "#/componets/statistics/TimeRangeFilter";
import { fetchStatistics } from "#/api/api.statistics";
import { Pending } from "#/componets/placeholders/Pending";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay";
import { PendingConf } from "#/contants/config";
import { EntriesSearchSchema } from "#/api/api.types";
import { type DayRange, toTimestampRange } from "#/shared/toTimestampRange";

// Without from/to in the URL, the page shows the current month
const withDefaultRange = ({ from, to }: DayRange): DayRange =>
  from || to ? { from, to } : rangeDates("month");

export const Route = createFileRoute("/")({
  validateSearch: EntriesSearchSchema,
  loaderDeps: ({ search }) => withDefaultRange(search),
  // The backend sums the time in SQL; the page only displays the totals
  loader: ({ deps }) => fetchStatistics(toTimestampRange(deps)),
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  pendingMinMs: PendingConf.pendingMinMs,
  pendingMs: PendingConf.pendingMs,
  component: Home,
});

// Statistics page (issue #14)
function Home() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const stats = Route.useLoaderData();
  // undefined when the range has no finished entry
  const topProject = stats.projects[0];

  return (
    <main className="p-3 sm:p-4 md:p-10 min-h-dvh w-full min-w-0 flex flex-col gap-5">
      <h1 className="font-medium text-5xl tracking-widest">Statistics</h1>

      <TimeRangeFilter
        value={withDefaultRange(search)}
        onChange={(range) =>
          navigate({ search: (prev) => ({ ...prev, ...range }) })
        }
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard
          title="Total tracked"
          value={formatDuration(stats.totalMinutes)}
        />
        <StatCard title="Entries" value={String(stats.entriesCount)} />
        <StatCard
          title="Top project"
          value={
            topProject
              ? `${topProject.name} · ${percentOf(topProject.minutes, stats.totalMinutes)}%`
              : "—"
          }
          mono={false}
        />
      </div>

      <div className="flex flex-wrap gap-5">
        <HoursBreakdown
          title="Hours per project"
          rows={stats.projects}
          totalMinutes={stats.totalMinutes}
          showShare
          note={
            stats.projects.length === 0
              ? "No finished entries in this range."
              : undefined
          }
        />
        <HoursBreakdown
          title="Hours per label"
          rows={stats.labels}
          totalMinutes={stats.totalMinutes}
          note={
            stats.labels.length === 0
              ? "No labelled entries in this range."
              : "An entry with several labels counts toward each of them, so label totals can exceed the overall total."
          }
        />
      </div>
    </main>
  );
}
