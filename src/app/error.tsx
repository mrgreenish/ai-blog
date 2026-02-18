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
      <p className="font-mono text-sm text-zinc-500">error</p>
      <h1 className="mt-4 text-3xl font-bold text-zinc-50">Something went wrong</h1>
      <p className="mt-4 text-zinc-400">
        An unexpected error occurred while loading this page.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
      >
        Try again
      </button>
    </div>
  );
}
