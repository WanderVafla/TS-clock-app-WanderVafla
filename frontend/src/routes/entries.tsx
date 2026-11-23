import { createFileRoute } from "@tanstack/react-router";
import { Pending } from "#/componets/placeholders/Pending.tsx";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay.tsx";
import { fetchEntries } from "#/api/api.entries.ts";
import { EntriesSearchSchema, type EntryItem } from "#/api/api.types.ts";
import type { Metadata } from "../../../backend/src/share/schema.ts";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { PaginationConf, PendingConf } from "#/contants/config.ts";
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
import { PageHeader } from "#/componets/PageHeader.tsx";
import { type DayRange, toTimestampRange } from "#/shared/toTimestampRange.ts";

type LoaderResponse = {
  data: (Entries & { project_name: string } & { labels: Label[] })[];
  metadata: Metadata;
  projects: Project[];
  labels: Label[];
};

const loadData = async ({
  page,
  sizePage,
  ...days
}: {
  page: number;
  sizePage: number;
} & DayRange): Promise<LoaderResponse> => {
  const [projects, entries, labels] = await Promise.all([
    fetchProjects(),
    fetchEntries({ page, sizePage, ...toTimestampRange(days) }),
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
  loaderDeps: ({
    search: {
      page = PaginationConf.defalutPage,
      sizePage = PaginationConf.defaultSizePage,
      from,
      to,
    },
  }) => ({ page, sizePage, from, to }),
  loader: async ({ deps }): Promise<LoaderResponse> => loadData(deps),
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  pendingMinMs: PendingConf.pendingMinMs,
  pendingMs: PendingConf.pendingMs,
});

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
] as const;

function RouteComponent() {
  const search = Route.useSearch();
  const { data, metadata, projects, labels }: LoaderResponse =
    Route.useLoaderData();

  // undefined = dialog closed, null = creating a new entry, EntryItem = editing that entry
  const [dialogEntry, setDialogEntry] = useState<EntryItem | null | undefined>(
    undefined,
  );
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
    // Desktop: exactly one screen high, only the table scrolls. Phones: the page scrolls.
    <main className="p-3 sm:p-4 md:px-6 md:pt-7 md:pb-5 w-full min-w-0 flex flex-col gap-5 md:h-dvh">
      <PageHeader
        title="Planing"
        subtitle={`${metadata.total} entries`}
        action={
          <button
            className="button-add"
            onClick={() => setDialogEntry(null)}
            aria-label="Create entry"
            type="button"
          >
            + Add entry
          </button>
        }
      />

      {/* Rendered only while open, so every opening starts with a fresh form and no stale error */}
      {dialogEntry !== undefined && (
        <EntryForm
          projects={projects}
          labels={labels}
          entryItem={dialogEntry}
          onClose={() => setDialogEntry(undefined)}
        />
      )}

      {/* Takes all the free height between the header and the pagination */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-side-navigation-border bg-popover">
        <Table columns={columns} items={items} />

        {/*placehoder if there is not entries */}
        {items.length <= 0 ? <NotFound /> : ""}
      </section>

      {/* Never shrinks, so it always stays on screen */}
      <nav aria-label="Pagination" className="shrink-0">
        <Pagination metadata={metadata} search={search} />
      </nav>
    </main>
  );
}
