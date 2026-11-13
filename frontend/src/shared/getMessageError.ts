import * as v from 'valibot'
import { ErrorMessage } from "#/contants/messages";

export function getMessageError(e: unknown): string {
  if (e instanceof v.ValiError) {
    return e.issues[0]?.message ?? e.message;
  }

  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === "string") {
    return e;
  }

  return ErrorMessage.UnknownError;
}
