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
    <div className="site-shell utility-page">
      <p className="eyebrow">error</p>
      <h1 className="mt-4 text-3xl font-bold text-fg-primary">
        Something went wrong
      </h1>
      <p className="mt-4 text-fg-secondary">
        An unexpected error occurred while loading this page.
      </p>
      <button onClick={reset} className="action-link action-primary mt-8">
        Try again
      </button>
    </div>
  );
}
