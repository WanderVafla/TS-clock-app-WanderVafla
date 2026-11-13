import { fetchEntries } from "#/api/api.entries";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { fetchProjects } from "#/api/api.projects.ts";
import { fetchLabels } from "#/api/api.labels.ts";
import { fetchEntriesLabels } from "#/api/api.entriesLabels.ts";
import { ErrorMessage } from "#/contants/messages.ts";
import type { Entries } from "../../../backend/src/entries/entries.schema";
import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { LabelItem } from "#/componets/LabelItem.tsx";
import { dateFormat } from "#/shared/dateFormat.ts";
import { NotFound } from "#/componets/placeholders/NotFound.tsx";
import { Pending } from "#/componets/placeholders/Pending.tsx";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay.tsx";

export const Route = createFileRoute("/entry/$entryId")({
  component: RouteComponent,
  loader: async ({ params }): Promise<LoaderResponse> =>
    loadData(Number(params.entryId)),
  notFoundComponent: NotFound,
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
});

function RouteComponent() {
  const { id, description, end_time, start_time, project_name, labels } =
    Route.useLoaderData();
  return (
    <main className="p-3 sm:p-4 md:p-10 min-h-dvh w-full min-w-0 flex flex-col gap-4 md:gap-8">
      <h1 className="text-2xl md:text-4xl">{`Entry Detail`}</h1>
      <div className="flex-1 flex flex-col gap-4 p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl">
        <div className="text-sm text-gray-500">{`id : ${id}`}</div>

        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
          description
        </h2>

        <div className="p-3 md:p-4 min-h-30 text-base md:text-lg leading-relaxed whitespace-pre-wrap wrap-break-word border border-border rounded-2xl md:rounded-3xl">
          {description}
        </div>

        <h2 className="text-sm font-medium uppercase tracking-widest text-gray-500">
          Time
        </h2>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-10 gap-y-2 text-base md:text-lg">
          <p>{`Start : ${dateFormat.format(new Date(start_time))}`}</p>
          <p>{`End : ${end_time ? dateFormat.format(new Date(end_time)) : "Current"}`}</p>
        </div>

        <div className="text-base md:text-lg">{`Project : ${project_name}`}</div>

        <div className="flex flex-col overflow-scroll sm:flex-row sm:items-start gap-3 text-base md:text-lg">
          <p>Labels : </p>
          <div className="w-full sm:flex-1 grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] auto-rows-max gap-2 max-h-100 overflow-y-auto">
            {labels.map((l) => (
              <LabelItem key={l.id} id={l.id} name={l.name} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

type LoaderResponse = Entries & { project_name: string } & { labels: Label[] };

const loadData = async (id: number): Promise<LoaderResponse> => {
  if (!Number.isInteger(id) || id < 1) {
    throw notFound();
  }
  const [projects, entry, labels, entriesLabels] = await Promise.all([
    fetchProjects(),
    fetchEntries({ id }),
    fetchLabels(),
    fetchEntriesLabels([id]),
  ]);

  const entryData = entry.data[0];

  if (!entryData) {
    throw notFound();
  }

  const methedEntriesLabels = entriesLabels.filter(
    (el) => el.time_entry_id === entryData.id,
  );
  const mathedProject = projects.find((p) => p.id === entryData.project_id);

  if (!mathedProject) {
    throw new Error(ErrorMessage.NotFoundProject);
  }

  const methedLabels = labels.filter((l) =>
    methedEntriesLabels.some((el) => el.label_id === l.id),
  );

  return {
    ...entryData,
    project_name: mathedProject?.name,
    labels: methedLabels,
  };
};
