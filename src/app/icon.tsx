import { ImageResponse } from "next/og";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#244BFF",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          transform: "skewY(-20deg)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ width: 18, height: 4, background: "#F5F3EC" }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
