import { ImageResponse } from "next/og";

export const alt = "AI Field Notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#60a5fa",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#71717a",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            developer field notes
          </span>
        </div>

        <h1
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#f4f4f5",
            lineHeight: 1.1,
            margin: 0,
            marginBottom: "20px",
          }}
        >
          AI Field Notes
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            margin: 0,
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          What actually worked, what broke, and what I&apos;d do differently.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "40px",
          }}
        >
          {["Models", "Workflows", "Tooling"].map((label) => (
            <div
              key={label}
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                border: "1px solid #3f3f46",
                background: "#27272a",
                color: "#a1a1aa",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
