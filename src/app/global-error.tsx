"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          backgroundColor: "#F5F3EC",
          color: "#20231F",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            padding: "8rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "#656B60",
            }}
          >
            error
          </p>
          <h1
            style={{ marginTop: "1rem", fontSize: "1.875rem", fontWeight: 700 }}
          >
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem", color: "#484D44" }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #244BFF",
              backgroundColor: "#244BFF",
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
