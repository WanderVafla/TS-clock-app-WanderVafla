import type { Label } from "../../../backend/src/labels/labels.schema.ts";
import { LabelConf } from "#/contants/config.ts";

// Few labels keep the table font size; the more labels, the smaller they get
const labelSize = (count: number) => {
  if (count >= LabelConf.smallFrom) return "px-1.5 py-0.5 text-xs";
  if (count >= LabelConf.mediumFrom) return "px-2 py-0.5 text-sm";
  return "px-2 py-0.5";
};

export function LabelList({ labels }: { labels: Label[] }) {
  if (labels.length === 0) return null;

  const size = labelSize(labels.length);

  return (
    <div className="flex flex-wrap gap-1">
      {labels.map((l) => (
        <span
          key={l.id}
          className={`bg-label whitespace-nowrap rounded-2xl ${size}`}
        >
          {l.name}
        </span>
      ))}
    </div>
  );
}
