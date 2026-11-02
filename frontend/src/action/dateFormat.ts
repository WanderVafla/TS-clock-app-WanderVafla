export const dateFormat = new Intl.DateTimeFormat("fr-CH", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const formatDuration = (start: Date, end: Date): string => {
  const totalMinutes = Math.floor((end.getTime() - start.getTime()) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}`;
};