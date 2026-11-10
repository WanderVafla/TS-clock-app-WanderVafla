export const Messages = {
  notFound: "Not Found"
}

export const ErrorMessage = {
  NotFoundMetadata: "Not found metadata",
  NotFoundProject: "Not found project",
  UnknownError: "Unknown error",
} as const;

export const TitleMessage = {
  edit: (name: string): string => `Edit ${name}`,
  create: (name: string): string => `Create ${name}`
} as const;
