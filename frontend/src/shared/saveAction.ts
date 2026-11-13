import { getMessageError } from "./getMessageError";
import * as v from "valibot";
import type { ActionState } from "./types";

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

const formDataToObject = (formData: FormData): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    if (key.endsWith("[]")) {
      // slice for remove `[]`
      result[key.slice(0, -2)] = formData.getAll(key).filter((value) => value !== "");
    } else {
      result[key] = formData.get(key);
    }
  }
  return result;
};

// Arrays hold unique ids, so compare them as sets
const isSameValue = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value) => b.includes(value));
  }
  return Object.is(a, b);
};

// Keeps only the keys of `next` whose value differs from `base`
const shallowDiff = <T extends object>(base: Partial<T>, next: T): Partial<T> => {
  const result: Partial<T> = {};
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (!isSameValue(base[key], next[key])) result[key] = next[key];
  }
  return result;
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
