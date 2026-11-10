import { useActionState, useEffect, useRef } from "react";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  type CreateProject,
  type Project,
  type UpdateProject,
} from "../../../../backend/src/projects/projects.schema";
import { createProject, updateProject } from "#/api/api.projects";
import { useRouter } from "@tanstack/react-router";
import type { ActionState } from "#/shared/types";
import { TitleMessage } from "#/contants/messages";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay";
import { saveFormAction } from "#/shared/saveAction";

type CreateEditProjectFormProps = { projectItem: Project | null } & {
  onClose: () => void;
};

const nameData = "project" as const;

export function ProjectForm({
  projectItem,
  onClose,
}: CreateEditProjectFormProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Open as modal once the <dialog> is in the DOM; the guard avoids a second showModal() under StrictMode
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const [state, formAction, isPending] = useActionState(
    (_prev: ActionState, formData: FormData) =>
      saveFormAction<Project, CreateProject, UpdateProject>({
        createSchema: CreateProjectSchema,
        updateSchema: UpdateProjectSchema,
        create: createProject,
        update: updateProject,
        formData: formData,
        onSuccess: async () => {
          await router.invalidate();
          onClose();
        },
      }),
    {
      error: null,
    },
  );

  return (
    <dialog
      className="md:w-1/3 p-5 gap-10 flex flex-col justify-self-center self-center rounded-2xl"
      ref={dialogRef}
      onClose={onClose}
    >
      <ErrorMessageDisplay error={state.error} />

      <h1>
        {projectItem?.id
          ? TitleMessage.edit(nameData)
          : TitleMessage.create(nameData)}
      </h1>

      <form action={formAction} className="flex flex-col gap-5">
        <input name="id" type="hidden" value={projectItem?.id} />
        <label htmlFor="project-name-form">Name</label>
        <input
          id="project-name-form"
          className="input-form"
          name="name"
          type="text"
          defaultValue={projectItem?.name}
        />
        <div className="flex gap-5 self-end [&_button:hover]:cursor-pointer">
          <button
            className="bg-primery p-2 rounded-3xl"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primery p-2 font-semibold rounded-3xl"
            type="submit"
            disabled={isPending}
          >
            {projectItem?.id ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
