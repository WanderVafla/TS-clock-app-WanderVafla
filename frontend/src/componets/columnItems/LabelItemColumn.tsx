import { useRouter } from "@tanstack/react-router";
import type { Label } from "../../../../backend/src/labels/labels.schema";
import { DeleteIcon, EditIcon } from "../icons/ActionIcons";
import { deleteLabel } from "#/api/api.labels";
import type { ItemActionRow } from "#/shared/types";
import { getMessageError } from "#/shared/getMessageError";

export type LabelItemType = Label & ItemActionRow;

export function LabelItemColumn({ id, name, onEdit, onError }: LabelItemType) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      onError(null);
      await deleteLabel(id);
      await router.invalidate();
    } catch (e) {
      onError(getMessageError(e));
    }
  };

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <div>
          <button className="cursor-pointer" type="button" aria-label="Edit label" onClick={onEdit}>
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
