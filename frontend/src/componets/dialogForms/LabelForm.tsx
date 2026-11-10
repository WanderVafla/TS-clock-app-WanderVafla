import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import * as v from "valibot";
import {
  CreateLabelSchema,
  UpdateLabelSchema,
  type CreateLabel,
  type Label,
  type UpdateLabel,
} from "../../../../backend/src/labels/labels.schema";
import { createLabel, updateLabel } from "#/api/api.labels";
import type { ActionState } from "#/shared/types";
import { TitleMessage } from "#/contants/messages";
import { getMessageError } from "#/shared/getMessageError";
import { ErrorMessageDisplay } from "#/componets/placeholders/ErrorMessageDisplay";

type CreateEditProjectFormProps = { labelItem: Label | null } & {
  onClose: () => void;
};

const nameData = "label" as const;

export function LabelForm({ labelItem, onClose }: CreateEditProjectFormProps) {
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
      saveLabelAction(
        async () => {
          await router.invalidate();
          onClose();
        },
        labelItem,
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
        {labelItem?.id
          ? TitleMessage.edit(nameData)
          : TitleMessage.create(nameData)}
      </h1>

      <form action={formAction} className="flex flex-col gap-5">
        <input name="id" type="hidden" value={labelItem?.id} />
        <label htmlFor="label-name-form">Name</label>
        <input
          id="label-name-form"
          className="input-form"
          name="name"
          type="text"
          defaultValue={labelItem?.name}
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
            {labelItem?.id ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

const saveLabelAction = async (
  onSuccess: () => Promise<void>,
  labelItem: Label | null,
  _prev: ActionState,
  formData: FormData,
) => {
  try {
    const id = Number(formData.get("id"));
    const name = String(formData.get("name"));

    const item: CreateLabel | UpdateLabel = { name, id };

    if (id) {
      if (labelItem) {
        const data = v.parse(UpdateLabelSchema, item);
        await updateLabel(data);
        await onSuccess();
      }
    } else {
      const data = v.parse(CreateLabelSchema, item);
      await createLabel(data);
      await onSuccess();
    }

    return { error: null };
  } catch (e) {
    return { error: getMessageError(e) };
  }
};
