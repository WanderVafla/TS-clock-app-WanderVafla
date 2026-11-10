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
import * as v from "valibot";
import type { ActionState } from "#/shared/types";
import { TitleMessage } from "#/contants/messages";
import { getMessageError } from "#/shared/getMessageError";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay";

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
    (prev: ActionState, formData: FormData) =>
      saveProjectAction(
        async () => {
          await router.invalidate();
          onClose();
        },
        projectItem,
        prev,
        formData,
      ),
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

const saveProjectAction = async (
  onSuccess: () => Promise<void>,
  projectItem: Project | null,
  _prev: ActionState,
  formData: FormData,
) => {
  try {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));

    const item: CreateProject | UpdateProject = { name, id };

    if (id) {
      if (projectItem) {
        const data = v.parse(UpdateProjectSchema, item);
        await updateProject(data);
        await onSuccess();
      }
    } else {
      const data = v.parse(CreateProjectSchema, item);
      await createProject(data);
      await onSuccess();
    }

    return { error: null };
  } catch (e) {
    return { error: getMessageError(e) };
  }
};
