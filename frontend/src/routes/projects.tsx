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
    title: "id",
    width: 20,
  },
  {
    title: "Name",
    width: 30,
  },
  {
    title: "Created",
    width: 25,
  },
  {
    title: "Actions",
    width: 25,
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
    <main className="p-3 sm:p-4 md:p-10 min-h-dvh w-full min-w-0 flex flex-col gap-4 md:gap-8">
      <ErrorMessageDisplay error={error} />
      <h1 className="font-medium text-5xl tracking-widest">Projects</h1>
      <button
        className="button-add"
        type="button"
        aria-label="Create project"
        onClick={() => setDialogProject(null)}
      >
        Create Project
      </button>
      {dialogProject !== undefined && (
        <ProjectForm
          projectItem={dialogProject}
          onClose={() => setDialogProject(undefined)}
        />
      )}
      <section className="flex flex-col w-full h-full overflow-x-auto overscroll-none rounded-2xl shadow-2xl">
        <Table columns={columns} items={items} minWidth="20rem" />
        {items.length <= 0 ? <NotFound /> : ""}
      </section>
    </main>
  );
}
