export const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);