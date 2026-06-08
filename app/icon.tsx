import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: "#0c0c0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 16,
          color: "#00b87a",
          letterSpacing: "-0.5px",
          lineHeight: 1,
        }}
      >
        {">"}_
      </span>
    </div>,
    { ...size }
  );
}
