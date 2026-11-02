import { dateFormat, formatDuration } from "#/action/dateFormat";
import type { EntryItem } from "#/api/api.types";
import { Description } from "../Description";
import { LabelList } from "../LabelList";

export function EntryItemColumn(entryProp: EntryItem) {
  const {
    description,
    project_id,
    project_name,
    labels,
    start_time,
    end_time,
  } = entryProp;

  const startDate = dateFormat.format(new Date(start_time));
  const endDate = end_time ? dateFormat.format(new Date(end_time)) : "Current";
  const duration = end_time
    ? formatDuration(new Date(start_time), new Date(end_time))
    : "Now";

  return (
    <tr className="border-b border-b-table-border ">
      <td>
        <Description text={description ?? "Not description"} />
      </td>
      <td id={`${project_id}`}>{project_name}</td>

      <td>
        <LabelList labels={labels ?? []} />
      </td>

      <td>{startDate}</td>
      <td>{endDate}</td>
      <td>{duration}</td>
    </tr>
  );
}
