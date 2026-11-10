import { Icon } from "./Icon.tsx";

// Arrow leaving a box: open the item on its own page
export function OpenIcon() {
  return (
    <Icon>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </Icon>
  );
}

// Pencil: edit the item
export function EditIcon() {
  return (
    <Icon>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </Icon>
  );
}

// Trash can: delete the item
export function DeleteIcon() {
  return (
    <Icon>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </Icon>
  );
}
