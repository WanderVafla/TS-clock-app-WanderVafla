type LabelItemType = {
  id: number;
  name: string;
};

export function LabelItem({ name }: LabelItemType) {
  return (
    <span className="p-1.5 bg-label truncate text-center rounded-2xl" title={name}>
      {name}
    </span>
  );
}
