import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RECON — Learn by breaking. Master by defending.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PILLS = [
  { g: "#", l: "articles" },
  { g: "*", l: "ctf" },
  { g: "$", l: "tools" },
  { g: "!", l: "cve" },
  { g: ">", l: "lab" },
];

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: "#0c0c0e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 600,
          borderRadius: 400,
          background: "radial-gradient(circle, rgba(0,184,122,0.1) 0%, transparent 65%)",
          display: "flex",
        }}
      />

      {/* cyan glow right */}
      <div
        style={{
          position: "absolute",
          right: -100,
          top: -50,
          width: 500,
          height: 400,
          borderRadius: 250,
          background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 65%)",
          display: "flex",
        }}
      />

      {/* macOS dots top-left */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 60,
          display: "flex",
        }}
      >
        <div style={{ width: 13, height: 13, borderRadius: 7, background: "#ff5f57", display: "flex", marginRight: 9 }} />
        <div style={{ width: 13, height: 13, borderRadius: 7, background: "#febc2e", display: "flex", marginRight: 9 }} />
        <div style={{ width: 13, height: 13, borderRadius: 7, background: "#28c840", display: "flex" }} />
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            color: "#2a2a32",
            marginLeft: 20,
            lineHeight: "13px",
          }}
        >
          recon@lab — zsh
        </span>
      </div>

      {/* main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* logo */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 104,
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#00b87a" }}>{">"}_</span>
          <span style={{ color: "#f0f0f4", marginLeft: 6 }}>recon</span>
        </div>

        {/* tagline */}
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: 28,
            color: "#6b7280",
            marginTop: 18,
            letterSpacing: "0.01em",
          }}
        >
          Learn by breaking. Master by defending.
        </div>

        {/* feature pills */}
        <div style={{ display: "flex", marginTop: 38 }}>
          {PILLS.map(({ g, l }, i) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                background: "rgba(0,184,122,0.08)",
                border: "1px solid rgba(0,184,122,0.25)",
                borderRadius: 9,
                padding: "9px 16px",
                marginLeft: i === 0 ? 0 : 10,
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 14, color: "#00b87a", marginRight: 6 }}>{g}</span>
              <span style={{ fontFamily: "monospace", fontSize: 14, color: "#9a9aa5" }}>{l}</span>
            </div>
          ))}
        </div>

        {/* domain */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 17,
            color: "#3a3a44",
            marginTop: 46,
            letterSpacing: "1px",
          }}
        >
          recon-brown.vercel.app
        </div>
      </div>

      {/* bottom accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            "linear-gradient(90deg, transparent 0%, #00b87a 30%, #06b6d4 70%, transparent 100%)",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
