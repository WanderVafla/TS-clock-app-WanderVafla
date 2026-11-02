import type { ErrorComponentProps } from "@tanstack/react-router";

export function ErrorDisplay({ error, reset }: ErrorComponentProps) {
  return (
    <section className=" flex justify-center">
      <div>
        <p>{error instanceof Error ? error.message : "Unknow Error"}</p>
        <button type="button" onClick={reset}>
          reset
        </button>
      </div>
    </section>
  );
}
