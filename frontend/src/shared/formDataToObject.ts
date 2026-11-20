// Converts FormData to a plain object; keys ending with `[]` become arrays
export const formDataToObject = (formData: FormData): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const key of new Set(formData.keys())) {
    if (key.endsWith("[]")) {
      // slice for remove `[]`
      result[key.slice(0, -2)] = formData.getAll(key).filter((value) => value !== "");
    } else {
      result[key] = formData.get(key);
    }
  }
  return result;
};
