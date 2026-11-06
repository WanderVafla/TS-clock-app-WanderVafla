import { createFileRoute } from "@tanstack/react-router";
import { Pending } from "#/componets/Pending.tsx";
import { ErrorDisplay } from "#/componets/ErrorDisplay.tsx";
import { fetchEntries } from "#/api/api.entries.ts";
import { EntriesSearchSchema, type EntryItem } from "#/api/api.types.ts";
import type { Metadata } from "../../../backend/src/share/schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { PendingConf } from "#/contants/config.ts";
import { Pagination } from "#/componets/Pagination.tsx";
import { Table, type TableColumn } from "#/componets/Table.tsx";
import { Messages } from "#/contants/messages.ts";
import { EntryItemColumn } from "#/componets/columnItems/EntryItemColumn.tsx";
import { fetchProjects } from "#/api/api.projects.ts";
import { fetchLabels } from "#/api/api.labels.ts";
import type { Entries } from "../../../backend/src/entries/entries.schema.ts";
import { fetchEntriesLabels } from "#/api/api.entriesLabels.ts";
import type { Project } from "../../../backend/src/projects/projects.schema.ts";
import {
  CreateEditEntryForm,
  openModal,
} from "#/componets/columnItems/CreateEditEntryForm.tsx";
import { useRef, useState } from "react";

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

  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [editing, setEditing] = useState<EntryItem | null>(null)

  
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
        onEdit={() => openModal(modalRef, setEditing, e)}
      />
    );
  });

  return (
    <main className="p-4 md:p-10 h-dvh flex flex-col gap-10 items-center">
      <header className="self-start">
        <h1 className="font-medium text-5xl tracking-widest">Planing</h1>
      </header>

      <button
        className="p-3 bg-button rounded-2xl self-end cursor-pointer"
        onClick={() => openModal(modalRef, setEditing, null)}
        type="button"
      >
        Add Entry
      </button>

      <CreateEditEntryForm ref={modalRef} projects={projects} labels={labels} entryItem={editing} />

      <section className="flex flex-col w-full h-full overflow-x-auto overscroll-none rounded-2xl shadow-2xl">
        <Table columns={columns} items={items} />

        {/*placehoder if there is not entries */}
        {items.length <= 0 ? (
          <div className="flex h-full items-center justify-center">
            {Messages.notFound}
          </div>
        ) : (
          ""
        )}
      </section>

      {/* Pagination button */}
      <nav>{<Pagination metadata={metadata} search={search} />}</nav>
    </main>
  );
}
