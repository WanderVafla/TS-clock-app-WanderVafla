import type { ErrorComponentProps } from "@tanstack/react-router";
import { getMessageError } from "#/shared/getMessageError";

export function ErrorDisplay({ error, reset }: ErrorComponentProps) {
  return (
    <section className=" flex justify-center">
      <div>
        <p>{getMessageError(error)}</p>
        <button type="button" onClick={reset}>
          reset
        </button>
      </div>
    </section>
  );
}
