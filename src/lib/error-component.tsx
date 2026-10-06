import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="terminal-error">
      <p className="kicker">SR-LINK 3000</p>
      <h1 className="h-block">TERMINAL FAULT</h1>
      <p className="max-w-md break-words">{errorMessage(error)}</p>
    </main>
  );
}
