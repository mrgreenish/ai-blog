"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-32 text-center">
      <p className="font-mono text-sm text-fg-muted">error</p>
      <h1 className="mt-4 text-3xl font-bold text-fg-primary">Something went wrong</h1>
      <p className="mt-4 text-fg-secondary">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors text-fg-secondary bg-bg-surface border border-border-default"
        
      >
        Try again
      </button>
    </div>
  );
}
