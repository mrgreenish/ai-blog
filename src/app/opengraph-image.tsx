import { ImageResponse } from "next/og";

export const alt = "AI Field Notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: "#F5F3EC",
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
            background: "#244BFF",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "16px",
            color: "#656B60",
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
          color: "#20231F",
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
          color: "#484D44",
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
              border: "1px solid #BFC3B7",
              background: "#DCDDD3",
              color: "#484D44",
              fontSize: "14px",
              fontFamily: "monospace",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
