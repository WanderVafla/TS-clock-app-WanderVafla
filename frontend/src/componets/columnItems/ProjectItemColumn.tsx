import { dateFormat } from "#/shared/dateFormat";
import { deleteProject } from "#/api/api.projects";
import { useRouter } from "@tanstack/react-router";
import type { Project } from "../../../../backend/src/projects/projects.schema";
import { DeleteIcon, EditIcon } from "../icons/ActionIcons";
import type { ItemActionRow } from "#/shared/types";
import { getMessageError } from "#/shared/getMessageError";

export type ProjectItemType = Project & ItemActionRow;

export function ProjectItemColumn({
  id,
  name,
  created_at,
  onEdit,
  onError,
}: ProjectItemType) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      onError(null)
      await deleteProject(id);
      await router.invalidate();
    } catch (e) {
      onError(getMessageError(e));
    }
  };
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{dateFormat.format(new Date(created_at ?? ""))}</td>
      <td>
        <div>
          <button className="cursor-pointer" type="button" aria-label="Edit project" onClick={onEdit}>
            <EditIcon />
          </button>
          <button
            className="cursor-pointer"
            aria-label="Delete"
            type="button"
            onClick={async () => await handleDelete(id)}
          >
            <DeleteIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}
