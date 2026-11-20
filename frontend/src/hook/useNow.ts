import { useSyncExternalStore } from "react";

let now = new Date();
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!intervalId) {
    intervalId = setInterval(() => {
      now = new Date();
      listeners.forEach((l) => {l()});
    }, 1000);
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size <= 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

}

function getSnapshot() {
  return now;
}

export const useNow = (): Date => {
  return useSyncExternalStore(subscribe, getSnapshot)
}
