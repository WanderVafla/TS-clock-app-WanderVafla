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
import { PageHeader } from "#/componets/PageHeader";

export const Route = createFileRoute("/labels")({
  loader: async () => {
    return await fetchLabels();
  },
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  component: RouteComponent,
});

const columns: TableColumn[] = [
  {
    title: "Name",
    width: 80,
  },
  {
    title: "Actions",
    width: 20,
  },
] as const;

function RouteComponent() {
  const labels = Route.useLoaderData();

  const [dialogLabel, setDialogLabel] = useState<Label | null | undefined>(
    undefined,
  );

  const [error, setError] = useState<string | null>(null);

  const handleError = (errorText: string | null) => {
    setError(errorText);
  };

  const items = labels.map((l) => (
    <LabelItemColumn
      key={l.id}
      id={l.id}
      name={l.name}
      onEdit={() => setDialogLabel(l)}
      onError={handleError}
    />
  ));

  return (
    // Desktop: exactly one screen high, the card fills the free height. Phones: the page scrolls.
    <main className="p-3 sm:p-4 md:px-6 md:pt-7 md:pb-5 w-full min-w-0 flex flex-col gap-5 md:h-dvh">
      <ErrorMessageDisplay error={error} />
      <PageHeader
        title="Labels"
        subtitle="A time entry can have several labels."
        action={
          <button
            className="button-add"
            type="button"
            aria-label="Create label"
            onClick={() => setDialogLabel(null)}
          >
            + New label
          </button>
        }
      />
      {dialogLabel !== undefined && (
        <LabelForm
          labelItem={dialogLabel}
          onClose={() => setDialogLabel(undefined)}
        />
      )}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-side-navigation-border bg-popover">
        <Table columns={columns} items={items} minWidth="20rem" />
        {items.length <= 0 ? <NotFound /> : ""}
      </section>
      <p className="m-0 shrink-0 text-[13px] text-clock-muted">
        Deleting a label removes it from its entries; the entries stay.
      </p>
    </main>
  );
}
