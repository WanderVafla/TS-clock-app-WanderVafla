import { useRouter } from "@tanstack/react-router";
import type { Label } from "../../../../backend/src/labels/labels.schema";
import { DeleteIcon, EditIcon } from "../icons/ActionIcons";
import { LabelsIcon } from "../icons/NavIcons";
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
      <td>
        <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-clock-border px-3.5 py-1.5 text-sm text-clock-muted">
          <LabelsIcon />
          <span className="truncate">{name}</span>
        </span>
      </td>
      <td>
        <div className="flex justify-end gap-3 text-2xl [&>*:hover]:text-hover">
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
