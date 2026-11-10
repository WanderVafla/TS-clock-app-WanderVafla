import { createFileRoute } from "@tanstack/react-router";
import { Pending } from "#/componets/placeholders/Pending.tsx";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay.tsx";
import { fetchEntries } from "#/api/api.entries.ts";
import { EntriesSearchSchema, type EntryItem } from "#/api/api.types.ts";
import type { Metadata } from "../../../backend/src/share/schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { PendingConf } from "#/contants/config.ts";
import { Pagination } from "#/componets/Pagination.tsx";
import { Table, type TableColumn } from "#/componets/Table.tsx";
import { EntryItemColumn } from "#/componets/columnItems/EntryItemColumn.tsx";
import { fetchProjects } from "#/api/api.projects.ts";
import { fetchLabels } from "#/api/api.labels.ts";
import type { Entries } from "../../../backend/src/entries/entries.schema.ts";
import { fetchEntriesLabels } from "#/api/api.entriesLabels.ts";
import type { Project } from "../../../backend/src/projects/projects.schema.ts";
import { EntryForm } from "#/componets/dialogForms/EntryForm.tsx";
import { useState } from "react";
import { NotFound } from "#/componets/placeholders/NotFound.tsx";

type LoaderResponse = {
  data: (Entries & { project_name: string } & { labels: Label[] })[];
  metadata: Metadata;
  projects: Project[];
  labels: Label[];
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

  const entriesLabels =
    entries.data.length > 0
      ? await fetchEntriesLabels(entries.data.map((e) => e.id))
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
    projects,
    labels,
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
  const search = Route.useSearch();
  const { data, metadata, projects, labels }: LoaderResponse =
    Route.useLoaderData();

  // undefined = dialog closed, null = creating a new entry, EntryItem = editing that entry
  const [dialogEntry, setDialogEntry] = useState<EntryItem | null | undefined>(
    undefined,
  );

  const columns: TableColumn[] = [
    {
      title: "Description",
      width: 21,
    },
    {
      title: "Project",
      width: 9,
    },
    {
      title: "Label",
      width: 26,
    },
    {
      title: "Start",
      width: 13,
    },
    {
      title: "End",
      width: 13,
    },
    {
      title: "Duration",
      width: 9,
    },
    {
      title: "Actions",
      width: 9,
    },
  ];

  const items = data.map((e) => {
    return (
      <EntryItemColumn
        key={e.id}
        id={e.id}
        description={e.description}
        project_id={e.project_id}
        project_name={e.project_name}
        labels={e.labels}
        end_time={e.end_time}
        start_time={e.start_time}
        onEdit={() => setDialogEntry(e)}
      />
    );
  });

  return (
    <main className="p-4 md:p-10 h-dvh flex flex-col gap-10 items-center">
      <header className="self-start">
        <h1 className="font-medium text-5xl tracking-widest">Planing</h1>
      </header>

      <button
        className="button-add"
        onClick={() => setDialogEntry(null)}
        type="button"
      >
        Add Entry
      </button>

      {/* Rendered only while open, so every opening starts with a fresh form and no stale error */}
      {dialogEntry !== undefined && (
        <EntryForm
          projects={projects}
          labels={labels}
          entryItem={dialogEntry}
          onClose={() => setDialogEntry(undefined)}
        />
      )}

      <section className="flex flex-col w-full h-full overflow-x-auto overscroll-none rounded-2xl shadow-2xl">
        <Table columns={columns} items={items} />

        {/*placehoder if there is not entries */}
        {items.length <= 0 ? <NotFound /> : ""}
      </section>

      {/* Pagination button */}
      <nav>{<Pagination metadata={metadata} search={search} />}</nav>
    </main>
  );
}
