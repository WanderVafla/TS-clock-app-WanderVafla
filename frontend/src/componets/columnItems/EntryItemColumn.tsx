import { dateFormat, formatDuration } from "#/shared/dateFormat";
import type { EntryItem } from "#/api/api.types";
import { Description } from "../Description";
import { Link } from "@tanstack/react-router";
import { LabelList } from "../LabelList";
import { EditIcon, OpenIcon } from "../icons/ActionIcons";

type EntryItemColumnProps = EntryItem & {
  onEdit: () => void;
};

export function EntryItemColumn({
  onEdit,
  ...entryProp
}: EntryItemColumnProps) {
  const {
    id,
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
    <tr>
      <td>
        <Description text={description ?? ""} />
      </td>
      <td id={`${project_id}`}>{project_name}</td>

      <td>
        <LabelList labels={labels ?? []} />
      </td>
      <td>{startDate}</td>
      <td>{endDate}</td>
      <td>{duration}</td>
      <td>
        <div className="flex justify-end gap-3 text-2xl [&>*:hover]:text-hover">
          <Link
            to="/entry/$entryId"
            params={{ entryId: String(id) }}
            title="Open entry"
            aria-label="Open entry"
          >
            <OpenIcon />
          </Link>
          <button
            className="cursor-pointer"
            onClick={onEdit}
            type="button"
            title="Edit entry"
            aria-label="Edit entry"
          >
            <EditIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
