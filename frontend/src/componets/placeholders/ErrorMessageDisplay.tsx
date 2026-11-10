type ErrorMessageType = {
  error: string | null;
};

export function ErrorMessageDisplay({ error }: ErrorMessageType) {
  if (!error) return null;
  return (
    <div role="alert" className="text-red-600 text-center justify-self-center">
      {error}
    </div>
  );
}
