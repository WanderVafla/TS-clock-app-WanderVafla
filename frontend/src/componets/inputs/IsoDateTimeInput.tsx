import { useState } from "react";
import { toDateTimeLocal } from "#/shared/dateFormat";

type IsoDateTimeInputProps = {
  name: string;
  // ISO string, e.g. entryItem.start_time
  defaultValue?: string | null;
  id?: string;
  className?: string;
  required?: boolean;
};

const localToIso = (local: string): string =>
  local ? new Date(local).toISOString() : "";

// datetime-local input whose submitted value is an ISO string instead of local time.
// The visible input has no name; a hidden input carries the ISO value into FormData.
// An empty field submits "". An untouched field submits the original ISO value,
// so precision the input cannot show (milliseconds) is not lost on save.
export function IsoDateTimeInput({
  name,
  defaultValue,
  ...rest
}: IsoDateTimeInputProps) {
  const initialLocal = defaultValue ? toDateTimeLocal(defaultValue) : "";
  const [local, setLocal] = useState(initialLocal);

  const iso =
    defaultValue && local === initialLocal ? defaultValue : localToIso(local);

  return (
    <>
      <input
        {...rest}
        type="datetime-local"
        step={1}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      <input type="hidden" name={name} value={iso} />
    </>
  );
}
