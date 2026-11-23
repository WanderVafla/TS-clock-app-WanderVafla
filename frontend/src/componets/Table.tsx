export type TableColumn = { title: string; width?: number };
type TableProp = {
  columns: TableColumn[];
  items: React.JSX.Element[];
  // Below this width the table scrolls horizontally; defaults to --table-min-width in styles.css
  minWidth?: string;
};

export function Table({ columns, items, minWidth }: TableProp) {
  return (
    // Scroll area: the table scrolls inside its card, so the rest of the page stays in place
    <div className="min-h-0 flex-1 overflow-auto">
      <table
        className="data-table w-full text-sm md:text-[15px] **:overflow-hidden [&_th]:overflow-visible"
        style={
          minWidth
            ? ({ "--table-min-width": minWidth } as React.CSSProperties)
            : undefined
        }
      >
        {/* Stays visible while the rows scroll */}
        <thead className="sticky top-0 z-1">
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
