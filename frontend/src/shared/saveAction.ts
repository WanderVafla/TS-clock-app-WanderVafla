import { getMessageError } from "./getMessageError";
import * as v from "valibot";
import type { ActionState } from "./types";

type SaveActionOptions<I, C, U> = {
  createSchema: v.GenericSchema<unknown, C>;
  updateSchema: v.GenericSchema<unknown, U>;
  create: (data: C) => Promise<I>;
  update: (data: U) => Promise<I>;
  onSuccess: () => Promise<void> | void;
  formData: FormData;
};

export const formDataToObject = (formData: FormData): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    if (key.endsWith("[]")) {
      // Slice for remove `[]`
      result[key.slice(0, -2)] = formData.getAll(key).filter((value) => value !== "");
    } else {
      result[key] = formData.get(key);
    }
  }
  return result;
};

// I = Item; C = Create; U = Update;
// For feature: add checking if data is realy changed. (item === formData)
export const saveFormAction = async<I, C, U>(
  opts: SaveActionOptions<I, C, U>
): Promise<ActionState> => {
  const { onSuccess, create, update, updateSchema, createSchema, formData } = opts
  try {
    const raw = formDataToObject(formData);
    const id = Number(raw.id);

    if (id) {
      const data = v.parse(updateSchema, raw);
      await update(data);
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
