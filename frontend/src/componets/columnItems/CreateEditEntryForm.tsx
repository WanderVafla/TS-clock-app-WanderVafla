import { useActionState } from "react";
import * as v from "valibot";
import { toDateTimeLocal } from "#/action/dateFormat.ts";
import { createEntry, updateEntry } from "#/api/api.entries.ts";
import type { Label } from "../../../../backend/src/labels/labels.schema.ts";
import type { Project } from "../../../../backend/src/projects/projects.schema.ts";
import {
  CreateEntriesSchema,
  UpdateEntriesSchema,
  type CreateEntries,
  type UpdateEntier,
} from "../../../../backend/src/entries/entries.schema.ts";
import type { EntryItem } from "#/api/api.types.ts";
import { useRouter } from "@tanstack/react-router";

export const openModal = (
  ref: React.RefObject<HTMLDialogElement | null>,
  editState: React.Dispatch<EntryItem | null>,
  item: EntryItem | null,
) => {
  if (ref.current !== null) {
    editState(item);
    ref.current.showModal();
  }
};

export const closeModal = (ref: React.RefObject<HTMLDialogElement | null>) => {
  if (ref.current !== null) {
    ref.current.close();
  }
};

type CreateEntryState = {
  error: string | null;
};

const changedTime = (
  input: string,
  original: string | undefined | null,
): string | null | undefined => {
  const originalInput = original ? toDateTimeLocal(original) : "";
  const unchanged =
    input && originalInput
      ? new Date(input).getTime() === new Date(originalInput).getTime()
      : input === originalInput;
  if (unchanged) return undefined;
  return input ? new Date(input).toISOString() : null;
};

async function saveEntryAction(
  onSuccess: () => Promise<void>,
  entryItem: EntryItem | null,
  _prev: CreateEntryState,
  formData: FormData,
) {
  try {
    const id: number | null = Number(String(formData.get("id")).trim());
    const start_time = String(formData.get("start_time"));
    const end_time = String(formData.get("end_time"));
    const description = String(formData.get("description"));
    const labels = formData.getAll("labels").map(Number);

    const isoDateStartTime = new Date(start_time).toISOString();
    const isoDateEndTime = end_time.trim()
      ? new Date(end_time).toISOString()
      : null;

    const project_id = Number(formData.get("project_id"));

    const item: CreateEntries | UpdateEntier = {
      id,
      project_id,
      start_time: isoDateStartTime,
      end_time: isoDateEndTime,
      description,
      label: labels,
    };

    if (id) {
      if (entryItem) {
        const Editeditem: CreateEntries | UpdateEntier = {
          id,
          project_id,
          start_time:
            changedTime(start_time, entryItem?.start_time) ??
            entryItem.start_time,
          end_time: changedTime(end_time, entryItem?.end_time),
          description: description.trim() === "" ? null : description,
          label: labels,
        };
        await updateEntry(v.parse(UpdateEntriesSchema, Editeditem));
        await onSuccess();
      }
    } else {
      await createEntry(v.parse(CreateEntriesSchema, item));
      await onSuccess();
    }

    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export function CreateEditEntryForm({
  projects,
  labels,
  ref,
  entryItem,
}: {
  projects: Project[];
  labels: Label[];
  ref: React.RefObject<HTMLDialogElement | null>;
  entryItem: EntryItem | null;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    (prev: CreateEntryState, formData: FormData) =>
      saveEntryAction(
        async () => {
          await router.invalidate();
          closeModal(ref);
        },
        entryItem,
        prev,
        formData,
      ),
    { error: null },
  );

  // Display errors to console
  if (state.error) {
    console.error(state.error);
  }

  return (
    <dialog
      className="md:w-1/3 p-5 gap-10 flex flex-col justify-self-center self-center rounded-2xl"
      ref={ref}
    >
      <div
        className="flex flex-wrap text-red-600 justify-center tracking-wide"
        style={!state.error ? { display: "none" } : undefined}
      >
        {state.error}
      </div>

      <h1 className="font-medium text-3xl tracking-widest">
        {entryItem?.id ? "Edit Entry" : "Create Entry"}
      </h1>

      <form
        key={entryItem?.id ?? "new"}
        action={formAction}
        className="flex flex-col gap-5"
      >
        <input name="id" type="hidden" value={entryItem?.id} />
        <textarea
          className="input-form h-30 resize-none"
          maxLength={255}
          name="description"
          placeholder="Description"
          defaultValue={entryItem?.description ?? ""}
        />

        <h2>Projects</h2>

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

        <h2>Time</h2>

        <div className="flex flex-wrap gap-5 [&_div]:items-center">
          <div className="flex gap-2">
            <label className="" htmlFor="start-time">
              Start
            </label>
            <input
              step={1}
              className="input-form"
              type="datetime-local"
              name="start_time"
              defaultValue={
                entryItem ? toDateTimeLocal(entryItem.start_time) : ""
              }
              required
            />
          </div>

          <div className="flex gap-2">
            <label htmlFor="start-time">End</label>
            <input
              step={1}
              className="input-form"
              type="datetime-local"
              defaultValue={
                entryItem?.end_time ? toDateTimeLocal(entryItem.end_time) : ""
              }
              name="end_time"
            />
          </div>
        </div>

        <h2 className="">labels</h2>

        <div className="flex flex-col overflow-y-scroll max-h-100 gap-2">
          {labels.map((l) => (
            <div key={l.id} className="choice-chip">
              <label htmlFor={`label-${l.id}`}>{l.name}</label>
              <input
                id={`label-${l.id}`}
                className="sr-only"
                name="labels"
                type="checkbox"
                value={l.id}
                defaultChecked={entryItem?.labels.some((el) => el.id === l.id)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-5 self-end [&_button:hover]:cursor-pointer">
          <button
            className="bg-primery p-2 rounded-3xl"
            type="button"
            onClick={() => closeModal(ref)}
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
