import { Icon } from "./Icon.tsx";

// Clock next to a list: the list of time entries (/entries)
export function EntriesIcon() {
  return (
    <Icon>
      <circle cx="7.5" cy="12" r="5.5" />
      <path d="M7.5 9v3l2 1.5" />
      <path d="M16 7h6" />
      <path d="M16 12h6" />
      <path d="M16 17h6" />
    </Icon>
  );
}

// Stopwatch: the status of the running timer
export function TimerStatusIcon() {
  return (
    <Icon>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M10 2.5h4" />
      <path d="M12 2.5V6" />
      <path d="M18 7.5l1.5-1.5" />
      <path d="M12 13.5V10" />
    </Icon>
  );
}

// Folder with a tag: projects and their labels (/projects)
export function ProjectsIcon() {
  return (
    <Icon>
      <path d="M3 18V6a1.5 1.5 0 0 1 1.5-1.5h4l2 2.5h9A1.5 1.5 0 0 1 21 8.5v3" />
      <path d="M3 18a1.5 1.5 0 0 0 1.5 1.5H11" />
      <path d="M14 14v4l4 4 4-4-4-4z" />
      <circle cx="16.25" cy="16.25" r="0.75" />
    </Icon>
  );
}

// Tag: the list of labels (/labels)
export function LabelsIcon() {
  return (
    <Icon>
      <path d="M3 4.5v6.4a1.5 1.5 0 0 0 .44 1.06l8.6 8.6a1.5 1.5 0 0 0 2.12 0l6.4-6.4a1.5 1.5 0 0 0 0-2.12l-8.6-8.6A1.5 1.5 0 0 0 10.9 3H4.5A1.5 1.5 0 0 0 3 4.5z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </Icon>
  );
}
