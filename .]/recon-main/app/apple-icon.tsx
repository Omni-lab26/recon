import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#0c0c0e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle glow */}
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 120,
          borderRadius: 80,
          background: "rgba(0,184,122,0.15)",
          display: "flex",
        }}
      />
      {/* >_ symbol */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 64,
            color: "#00b87a",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          {">"}_
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontWeight: 600,
            fontSize: 22,
            color: "#52525b",
            letterSpacing: "0.5px",
            marginTop: 8,
          }}
        >
          recon
        </span>
      </div>
      {/* bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #00b87a, transparent)",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
