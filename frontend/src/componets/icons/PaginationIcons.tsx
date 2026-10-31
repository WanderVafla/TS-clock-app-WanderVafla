import type { ReactNode } from "react";

// Shared frame: 24×24 grid, stroke follows the text color, size follows the font size
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// |<  go to the first page
export function FirstPageIcon() {
  return (
    <Icon>
      <path d="M7 6v12" />
      <path d="M17 6l-6 6 6 6" />
    </Icon>
  );
}

// <  go to the previous page
export function PrevPageIcon() {
  return (
    <Icon>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

// >  go to the next page
export function NextPageIcon() {
  return (
    <Icon>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

// >|  go to the last page
export function LastPageIcon() {
  return (
    <Icon>
      <path d="M7 6l6 6-6 6" />
      <path d="M17 6v12" />
    </Icon>
  );
}
