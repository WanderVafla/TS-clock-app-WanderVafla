export type ActionState = {
  error: string | null;
};

export type ItemActionRow = {
  onEdit: () => void;
  onError: (errorText: string | null) => void;
};
