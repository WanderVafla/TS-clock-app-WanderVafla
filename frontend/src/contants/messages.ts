export const ErrorMessage = {
  NotFoundMetadata: "Not found metadata",
  NotFoundProject: "Not found project",
  UnknownError: "Unknown error",
  InvalidDate: "Date is not valid",
  FromAfterTo: "From must be before or equal to To",
} as const;

export const TitleMessage = {
  edit: (name: string): string => `Edit ${name}`,
  create: (name: string): string => `Create ${name}`
} as const;
