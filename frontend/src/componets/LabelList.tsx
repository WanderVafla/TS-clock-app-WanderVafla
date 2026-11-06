import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { LabelListConf } from "#/contants/config.ts";
import { LabelItem } from "./LabelItem.tsx";

export function LabelList({ labels }: { labels: Label[] }) {
  if (labels.length === 0) return null;

  const visible = labels.slice(0, LabelListConf.maxVisible);
  const hiddenCount = labels.length - visible.length;

  // One line: labels shrink and truncate, so the row height never grows
  return (
    <div className="flex gap-1">
      {visible.map((l) => (
        <LabelItem key={l.id} id={l.id} name={l.name} />
      ))}
      {hiddenCount > 0 && (
        <span
          className="shrink-0 p-1.5 border border-border whitespace-nowrap rounded-2xl"
          title={`${hiddenCount} more labels`}
        >
          {`+${hiddenCount}`}
        </span>
      )}
    </div>
  );
}
