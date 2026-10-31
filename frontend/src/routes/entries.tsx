import { createFileRoute } from "@tanstack/react-router";
import { Pending } from "#/componets/Pending.tsx";
import { ErrorDisplay } from "#/componets/ErrorDisplay.tsx";
import { fetchEntries } from "#/api/api.entries.ts";
import {
  EntriesSearchSchema,
  type Entry,
} from "#/api/api.types.ts";
import type { Metadata } from "../../../backend/src/share/schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { PendingConf } from "#/contants/config.ts";
import { fetchData } from "#/action/fetchData.ts";
import { API_URL } from "#/contants/url.ts";
import type { EntryLabelLink } from "../../../backend/src/entries_labels/entries_labels.schema.ts";
import type { Project } from "../../../backend/src/projects/projects.schema.ts";
import { Pagination } from "#/componets/Pagination.tsx";
import { Table, type TableColumn } from "#/componets/Table.tsx";
import { Messages } from "#/contants/messages.ts";
import { EntryItemColumn } from "#/componets/columnItems/EntryItemColumn.tsx";

type LoaderResponse = {
  data: (Entry & { project_name: string } & { labels: Label[] })[];
  metadata: Metadata;
};

const loadData = async (deps: {
  page: number;
  sizePage: number;
}): Promise<LoaderResponse> => {
  const [projects, entries, labels] = await Promise.all([
    fetchData<Project[]>(API_URL.project),
    fetchEntries(deps),
    fetchData<Label[]>(API_URL.labels),
  ]);

  const entriesLabels =
    entries.data.length > 0
      ? await fetchData<EntryLabelLink[]>(
          API_URL.entries_labels(entries.data.map((e) => e.id)),
        )
      : [];

  const data = entries.data.map((e) => {
    const mathedProject = projects.find((p) => p.id === e.project_id);
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

const DateFormated = new Intl.DateTimeFormat("fr-CH", {
  dateStyle: "medium",
  timeStyle: "short",
});

function RouteComponent() {
  const search = Route.useSearch();
  const { data, metadata }: LoaderResponse = Route.useLoaderData();

  const columns: TableColumn[] = [
    {
      title: "Description",
      width: 25,
    },
    {
      title: "Project",
      width: 10,
    },
    {
      title: "Label",
      width: 25,
    },
    {
      title: "Start",
      width: 15,
    },
    {
      title: "End",
      width: 15,
    },
    {
      title: "Duration",
      width: 10,
    },
  ];

  const items = data.map((e) => {
    const startDate = new Date(e.start_time);

    const endDate = e.end_time
      ? DateFormated.format(new Date(e.end_time))
      : "Current";

    return (
      <EntryItemColumn
        key={e.id}
        description={e.description ?? "none"}
        project_id={e.project_id}
        project_name={e.project_name}
        label={e.labels ?? "unknow"}
        end_time={endDate}
        start_time={DateFormated.format(startDate)}
      />
    );
  });

  return (
    <main className="p-4 md:p-10 h-dvh flex flex-col gap-10 items-center justify-between">
      <div className="w-full h-full overflow-x-auto overscroll-none rounded-2xl shadow-2xl shadow-table-shadow">
        <Table columns={columns} items={items} />

        {/*placehoder if there is not entries */}
        {items.length <= 0 ? (
          <div className="flex h-full items-center justify-center">
            {Messages.notFound}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Pagination button */}
      {<Pagination metadata={metadata} search={search} />}
    </main>
  );
}
