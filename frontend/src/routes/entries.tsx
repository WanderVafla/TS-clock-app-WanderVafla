import { createFileRoute, Link } from "@tanstack/react-router";
import { Pending } from "#/componets/Pending.tsx";
import { ErrorDisplay } from "#/componets/ErrorDisplay.tsx";
import { fetchEntries } from "#/api/api.entries.ts";
import {
  EntriesSearchSchema,
  type Entry,
  type EntryItem,
} from "#/api/api.types.ts";
import { fetchProjects } from "#/api/api.projects.ts";
import { fetchEntriesLabels } from "#/api/api.entries_labels.ts";
import { fetchLabels } from "#/api/api.labels.ts";
import type { Metadata } from "../../../backend/src/share/schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { PaginationConf, PendingConf } from "#/contants/config.ts";
import { Messages } from "#/contants/messages.ts";
import { range } from "#/action/range.ts";

type LoaderResponse = {
  data: (Entry & { project_name: string } & { labels: Label[] })[];
  metadata: Metadata;
};

const loadData = async (deps: {
  page: number;
  sizePage: number;
}): Promise<LoaderResponse> => {
  const [projects, entries, labels] = await Promise.all([
    fetchProjects(),
    fetchEntries(deps),
    fetchLabels(),
  ]);

  const entriesLabels = await fetchEntriesLabels(entries.data.map((e) => e.id));

  const data = entries.data.map((e) => {
    const mathedProject = projects.data.find((p) => p.id === e.project_id);

    const methedEntriesLabels = entriesLabels.filter(
      (el) => el.time_entry_id === e.id,
    );
    const methedLabels = labels.filter((l) =>
      methedEntriesLabels.some((el) => el.label_id === l.id),
    );
    return {
      ...e,
      project_name: mathedProject ? mathedProject.name : "Unknow",
      labels: [...methedLabels],
    };
  });
  return {
    ...entries,
    data: data,
  };
};

export const Route = createFileRoute("/entries")({
  component: RouteComponent,
  validateSearch: EntriesSearchSchema,
  loaderDeps: ({ search: { page, sizePage } }) => ({ page, sizePage }),
  loader: async ({ deps }): Promise<LoaderResponse> => loadData(deps),
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  pendingMinMs: PendingConf.pendingMinMs,
  pendingMs: PendingConf.pendingMs,
});

function RouteComponent() {
  const { page, sizePage } = Route.useSearch();
  const { data, metadata }: LoaderResponse = Route.useLoaderData();

  return (
    <main className="p-20 h-dvh flex flex-col gap-10 items-center justify-between">
      <table className="text-left w-full">
        <thead>
          <tr className="bg-gray-400">
            <th className="min-w-3/10">Description</th>
            <th className="min-w-1/10">Project</th>
            <th className="min-w-1/10">Label</th>
            <th className="min-w-2/10">Start Time</th>
            <th className="min-w-2/10">End time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e) => {
            const startDate = new Date(e.start_time);

            const DateFormated = new Intl.DateTimeFormat("fr-CH", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            const endDate = e.end_time
              ? DateFormated.format(new Date(e.end_time))
              : "Current";

            return (
              <EntryItemComp
                key={e.id}
                description={e.description ?? "none"}
                project_id={e.project_id}
                project_name={e.project_name}
                label={e.labels ?? "unknow"}
                end_time={endDate}
                start_time={DateFormated.format(startDate)}
              />
            );
          })}
        </tbody>
      </table>

      {/* placehoder if there is not entries */}
      {data.length <= 0 ? <div>{Messages.notFound}</div> : ""}

      {/* Pagination button */}
      {metadata ? (
        <div className="flex gap-3">
          <Link
            to="/entries"
            search={{ page: page - 1, sizePage }}
            disabled={page <= 1}
          >
            prev
          </Link>
          {range(
            Math.max(1, page - PaginationConf.delataRange),
            Math.min(metadata.totalPages, page + PaginationConf.delataRange),
          ).map((p) => {
            return (
              <Link key={p} to="/entries" search={{ page: p, sizePage }}>
                {p}
              </Link>
            );
          })}

          <Link
            to="/entries"
            search={{ page: page + 1, sizePage }}
            disabled={page >= metadata.totalPages}
          >
            next
          </Link>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

function EntryItemComp(entryProp: EntryItem) {
  const { description, project_id, project_name, label, start_time, end_time } =
    entryProp;
  return (
    <tr>
      <td>{description}</td>
      <td id={`${project_id}`}>{project_name}</td>

      <td>
        {label ? (
          <div className="flex gap-1.5">
            {label.map((l) => (
              <div
                className="p-1.5 flex bg-gray-300 rounded-2xl w-min overflow-hidden"
                key={l.id}
              >
                {l.name}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </td>

      <td>{start_time}</td>
      <td>{end_time}</td>
    </tr>
  );
}
