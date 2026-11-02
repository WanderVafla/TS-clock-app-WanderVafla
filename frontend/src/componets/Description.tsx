import { type CSSProperties, useId } from "react";

// Shows at most two lines; a click opens the full text in a popover anchored to it
export function Description({ text }: { text: string }) {
  const id = useId();
  const popoverId = `description-${id}`;
  // useId() contains characters that are not allowed in a CSS anchor name
  const anchorName = `--description-${id.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      className="description"
      style={{ "--description-anchor": anchorName } as CSSProperties}
    >
      <button
        type="button"
        popoverTarget={popoverId}
        className="description-trigger"
        title="Show full description"
      >
        <span className="line-clamp-2 wrap-break-words">{text}</span>
      </button>

      <div id={popoverId} popover="auto" className="description-popover">
        {text}
      </div>
    </div>
  );
}
