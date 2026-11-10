export type TableColumn = { title: string; width?: number };
type TableProp = {
  columns: TableColumn[];
  items: React.JSX.Element[];
  // Below this width the table scrolls horizontally; defaults to --table-min-width in styles.css
  minWidth?: string;
};

export function Table({ columns, items, minWidth }: TableProp) {
  return (
    <div>
      <table
        className="data-table h-full w-full text-base md:text-xl **:overflow-hidden [&_th]:overflow-visible"
        style={
          minWidth
            ? ({ "--table-min-width": minWidth } as React.CSSProperties)
            : undefined
        }
      >
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
