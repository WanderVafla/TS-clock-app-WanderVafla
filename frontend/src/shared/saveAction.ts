import { getMessageError } from "./getMessageError";
import * as v from "valibot";
import type { ActionState } from "./types";
import { shallowDiff } from "./shallowDiff";
import { formDataToObject } from "./formDataToObject";

type SaveActionOptions<I, C, U> = {
  createSchema: v.GenericSchema<unknown, C>;
  updateSchema: v.GenericSchema<unknown, U>;
  create: (data: C) => Promise<I>;
  update: (data: Partial<U> & { id: number }) => Promise<I>;
  onSuccess: () => Promise<void> | void;
  formData: FormData;
  // Initial values in the update payload shape, used to send only changed fields
  initial?: Partial<U> | null;
};

// I = Item; C = Create; U = Update;
export const saveFormAction = async<I, C, U extends object>(
  opts: SaveActionOptions<I, C, U>
): Promise<ActionState> => {
  const { onSuccess, create, update, updateSchema, createSchema, formData, initial } = opts
  try {
    const raw = formDataToObject(formData);
    const id = Number(raw.id);

    if (id) {
      // Validate the full form first: cross-field checks (end_time > start_time) need both values
      const data = v.parse(updateSchema, raw);
      const changes = initial ? shallowDiff(initial, data) : data;

      // Nothing changed: skip the request and just close
      if (Object.keys(changes).length === 0) {
        await onSuccess();
        return { error: null };
      }

      // `id` is equal on both sides, so the diff drops it; PATCH needs it
      await update({ ...changes, id });
      await onSuccess();
    } else {
      const data = v.parse(createSchema, raw);
      await create(data);
      await onSuccess();
    }
    return { error: null };
  } catch (e) {
    return { error: getMessageError(e) };
  }
};
