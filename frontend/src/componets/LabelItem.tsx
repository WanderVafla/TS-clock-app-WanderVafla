type LabelItemType = {
  id: number;
  name: string;
};

export function LabelItem({ name }: LabelItemType) {
  return (
    <span className="truncate rounded-full border border-clock-border bg-label px-2.5 py-0.5 text-center text-xs text-clock-muted" title={name}>
      {name}
    </span>
  );
}
