// Arrays hold unique ids, so compare them as sets
const isSameValue = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value) => b.includes(value));
  }
  return Object.is(a, b);
};

// Keeps only the keys of `next` whose value differs from `base`
export const shallowDiff = <T extends object>(base: Partial<T>, next: T): Partial<T> => {
  const result: Partial<T> = {};
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (!isSameValue(base[key], next[key])) result[key] = next[key];
  }
  return result;
};
