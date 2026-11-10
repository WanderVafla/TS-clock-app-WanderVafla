import { useActionState, useEffect, useRef } from "react";
import { createEntry, updateEntry } from "#/api/api.entries.ts";
import type { Label } from "../../../../backend/src/labels/labels.schema.ts";
import type { Project } from "../../../../backend/src/projects/projects.schema.ts";
import {
  CreateEntriesSchema,
  UpdateEntriesSchema,
} from "../../../../backend/src/entries/entries.schema.ts";
import type { EntryItem } from "#/api/api.types.ts";
import { useRouter } from "@tanstack/react-router";
import type { ActionState } from "#/shared/types.ts";
import { TitleMessage } from "#/contants/messages.ts";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay.tsx";
import { NotFound } from "../placeholders/NotFound.tsx";
import { IsoDateTimeInput } from "#/componets/inputs/IsoDateTimeInput.tsx";
import { saveFormAction } from "#/shared/saveAction.ts";

const nameData = "entry" as const;

export function EntryForm({
  projects,
  labels,
  entryItem,
  onClose,
}: {
  projects: Project[];
  labels: Label[];
  entryItem: EntryItem | null;
  onClose: () => void;
}) {
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
      saveFormAction({
        onSuccess: async () => {
          await router.invalidate();
          onClose();
        },
        create: createEntry,
        update: updateEntry,
        createSchema: CreateEntriesSchema,
        updateSchema: UpdateEntriesSchema,
        formData: formData,
      }),
    { error: null },
  );

  return (
    <dialog
      className="md:w-1/3 p-5 gap-10 flex flex-col justify-self-center self-center rounded-2xl"
      ref={dialogRef}
      // Fires for Esc too, so the parent unmounts the dialog however it was closed
      onClose={onClose}
    >
      <ErrorMessageDisplay error={state.error} />

      <h1>
        {entryItem?.id
          ? TitleMessage.edit(nameData)
          : TitleMessage.create(nameData)}
      </h1>

      <form action={formAction} className="flex flex-col gap-5">
        <input name="id" type="hidden" value={entryItem?.id} />
        <textarea
          className="input-form h-30 resize-none"
          maxLength={255}
          name="description"
          placeholder="Description"
          defaultValue={entryItem?.description ?? ""}
        />

        <h2>Projects</h2>

        {projects.length <= 0 ? (
          <NotFound />
        ) : (
          <div className="choice-list max-h-50 overflow-y-scroll">
            {projects.map((p) => (
              <div key={p.id} className="choice-chip text-center">
                <label htmlFor={`project-${p.id}`}>{p.name}</label>
                <input
                  id={`project-${p.id}`}
                  className="sr-only"
                  type="radio"
                  name="project_id"
                  value={p.id}
                  defaultChecked={entryItem?.project_id === p.id}
                  required
                />
              </div>
            ))}
          </div>
        )}
        <h2>Time</h2>

        <div className="flex flex-wrap gap-5 [&_div]:items-center">
          <div className="flex gap-2">
            <label htmlFor="start-time">Start</label>
            <IsoDateTimeInput
              id="start-time"
              className="input-form"
              name="start_time"
              defaultValue={entryItem?.start_time}
              required
            />
          </div>

          <div className="flex gap-2">
            <label htmlFor="end-time">End</label>
            <IsoDateTimeInput
              id="end-time"
              className="input-form"
              name="end_time"
              defaultValue={entryItem?.end_time}
            />
          </div>
        </div>

        <h2 className="">labels</h2>
        {labels.length <= 0 ? (
          <NotFound />
        ) : (
          <div className="flex flex-col overflow-y-scroll max-h-100 gap-2">
            <input name="label[]" type="hidden" value={""} />
            {labels.map((l) => (
              <div key={l.id} className="choice-chip">
                <label htmlFor={`label-${l.id}`}>{l.name}</label>
                <input
                  id={`label-${l.id}`}
                  className="sr-only"
                  // WARNING: name must be like into schema. `[]` meat array, we need it for parsing when submit.
                  name="label[]"
                  type="checkbox"
                  value={l.id}
                  defaultChecked={entryItem?.labels.some(
                    (el) => el.id === l.id,
                  )}
                />
              </div>
            ))}
          </div>
        )}
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
            {entryItem?.id ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
