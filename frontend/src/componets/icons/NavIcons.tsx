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
