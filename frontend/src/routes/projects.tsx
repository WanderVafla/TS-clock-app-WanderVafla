import { fetchProjects } from "#/api/api.projects";
import { ProjectItemColumn } from "#/componets/columnItems/ProjectItemColumn";
import { Table, type TableColumn } from "#/componets/Table";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Project } from "../../../backend/src/projects/projects.schema";
import { ProjectForm } from "#/componets/dialogForms/ProjectForm";
import { ErrorDisplay } from "#/componets/placeholders/ErrorDisplay";
import { Pending } from "#/componets/placeholders/Pending";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay";
import { NotFound } from "#/componets/placeholders/NotFound";
import { PageHeader } from "#/componets/PageHeader";

export const Route = createFileRoute("/projects")({
  loader: async () => {
    return await fetchProjects();
  },
  pendingComponent: Pending,
  errorComponent: ErrorDisplay,
  component: RouteComponent,
});

const columns: TableColumn[] = [
  {
    title: "Name",
    width: 50,
  },
  {
    title: "Created",
    width: 30,
  },
  {
    title: "Actions",
    width: 20,
  },
] as const;

function RouteComponent() {
  const projects = Route.useLoaderData();

  const [dialogProject, setDialogProject] = useState<
    Project | null | undefined
  >(undefined);

  const [error, setError] = useState<string | null>(null);

  const handleError = (errorText: string | null) => {
    setError(errorText);
  };

  const items = projects.map((p) => (
    <ProjectItemColumn
      key={p.id}
      id={p.id}
      name={p.name}
      created_at={p.created_at}
      onEdit={() => setDialogProject(p)}
      onError={handleError}
    />
  ));

  return (
    // Desktop: exactly one screen high, the card fills the free height. Phones: the page scrolls.
    <main className="p-3 sm:p-4 md:px-6 md:pt-7 md:pb-5 w-full min-w-0 flex flex-col gap-5 md:h-dvh">
      <ErrorMessageDisplay error={error} />
      <PageHeader
        title="Projects"
        subtitle="Every time entry belongs to one project."
        action={
          <button
            className="button-add"
            type="button"
            aria-label="Create project"
            onClick={() => setDialogProject(null)}
          >
            + New project
          </button>
        }
      />
      {dialogProject !== undefined && (
        <ProjectForm
          projectItem={dialogProject}
          onClose={() => setDialogProject(undefined)}
        />
      )}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-side-navigation-border bg-popover">
        <Table columns={columns} items={items} minWidth="20rem" />
        {items.length <= 0 ? <NotFound /> : ""}
      </section>
      <p className="m-0 shrink-0 text-[13px] text-clock-muted">
        Deleting a project also deletes its time entries.
      </p>
    </main>
  );
}
