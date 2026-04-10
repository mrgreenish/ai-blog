import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          borderRadius: "36px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#60a5fa",
            marginBottom: "12px",
          }}
        />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            color: "#a1a1aa",
            letterSpacing: "0.08em",
          }}
        >
          AFN
        </span>
      </div>
    ),
    { ...size }
  );
}
