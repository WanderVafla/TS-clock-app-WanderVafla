export type TableColumn = { title: string; width?: number };
type TableProp = { columns: TableColumn[]; items: React.JSX.Element[] };

export function Table({ columns, items }: TableProp) {
  return (
    <div>
      <table className="data-table h-full w-full text-base md:text-xl">
        <thead>
          <tr className="bg-table-head">
            {columns.map((c) => (
              <th
                key={c.title}
                style={c.width ? { width: `${c.width}%` } : undefined}
              >
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
    </div>
  );
}
