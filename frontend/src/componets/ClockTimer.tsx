import { useNow } from "#/hook/useNow";

type ClockTimeType = {
  clockInAt: string;
};

function formatClockTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function ClockTimer({ clockInAt }: ClockTimeType) {
  const now = useNow().getTime();
  return (
    <time
      dateTime={clockInAt}
      className="flex justify-center text-5xl font-mono tabular-nums"
    >
      {formatClockTime(now - new Date(clockInAt).getTime())}
    </time>
  );
}
