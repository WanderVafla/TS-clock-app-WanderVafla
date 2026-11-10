import { Table, type TableColumn } from "#/componets/Table";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay";
import { Pending } from "#/componets/placeholders/Pending";
import { fetchLabels } from "#/api/api.labels";
import { LabelItemColumn } from "#/componets/columnItems/LabelItemColumn";
import { LabelForm } from "#/componets/dialogForms/LabelForm";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay";
import type { Label } from "../../../backend/src/labels/labels.schema";
import { NotFound } from "#/componets/placeholders/NotFound";

export const Route = createFileRoute("/labels")({
  loader: async () => {
    return await fetchLabels();
  },
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  component: RouteComponent,
});

function RouteComponent() {
  const projects = Route.useLoaderData();

  const [dialogLabel, setDialogLabel] = useState<Label | null | undefined>(
    undefined,
  );

  const [error, setError] = useState<string | null>(null);

  const handleError = (errorText: string | null) => {
    setError(errorText);
  };

  const columns: TableColumn[] = [
    {
      title: "id",
      width: 20,
    },
    {
      title: "Name",
      width: 55,
    },
    {
      title: "Actions",
      width: 25,
    },
  ];

  const items = projects.map((p) => (
    <LabelItemColumn
      key={p.id}
      id={p.id}
      name={p.name}
      onEdit={() => setDialogLabel(p)}
      onError={handleError}
    />
  ));

  return (
    <main className="p-3 sm:p-4 md:p-10 min-h-dvh w-full min-w-0 flex flex-col gap-4 md:gap-8">
      <ErrorMessageDisplay error={error} />
      <h1 className="font-medium text-5xl tracking-widest">Labels</h1>
      <button
        className="button-add"
        type="button"
        aria-label="Create project"
        onClick={() => setDialogLabel(null)}
      >
        Create Labels
      </button>
      {dialogLabel !== undefined && (
        <LabelForm
          labelItem={dialogLabel}
          onClose={() => setDialogLabel(undefined)}
        />
      )}
      <section className="flex flex-col w-full h-full overflow-x-auto overscroll-none rounded-2xl shadow-2xl">
        <Table columns={columns} items={items} minWidth="20rem" />
        {items.length <= 0 ? <NotFound /> : ""}
      </section>
    </main>
  );
}
