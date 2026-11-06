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
// Convert an ISO string to the local "YYYY-MM-DDTHH:mm" format required by datetime-local inputs
export const toDateTimeLocal = (iso: string): string => {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
