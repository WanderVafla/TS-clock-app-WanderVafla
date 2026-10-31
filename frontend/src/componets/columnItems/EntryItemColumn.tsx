import type { EntryItem } from "#/api/api.types";
import { Description } from "../Description";
import { LabelList } from "../LabelList";

export function EntryItemColumn(entryProp: EntryItem) {
  const { description, project_id, project_name, label, start_time, end_time } =
    entryProp;
  return (
    <tr className="border-b border-b-table-border ">
      <td>
        <Description text={description} />
      </td>
      <td id={`${project_id}`}>{project_name}</td>

      <td>
        <LabelList labels={label ?? []} />
      </td>

      <td>{start_time}</td>
      <td>{end_time}</td>
      <td>
        {new Date(
          new Date(end_time).getTime() - new Date(start_time).getTime(),
        ).toLocaleTimeString()}
      </td>
    </tr>
  );
}
