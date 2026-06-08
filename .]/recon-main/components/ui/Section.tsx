"use client";

import { type ReactNode } from "react";
import { C } from "@/lib/tokens";
import { Reveal } from "./motion";

export function Section({ children, soft }: { children: ReactNode; soft?: boolean }) {
  return (
    <section style={{ position: "relative", zIndex: 2, background: soft ? "rgba(251,251,253,0.6)" : "transparent" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "104px 24px" }}>{children}</div>
    </section>
  );
}

export function SectionHead({
  tag,
  children,
  sub,
  color = C.accent,
}: {
  tag: string;
  children: ReactNode;
  sub?: string;
  color?: string;
}) {
  return (
    <Reveal>
      <div style={{ textAlign: "center", marginBottom: 54 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color,
            background: `${color}10`,
            border: `1px solid ${color}2e`,
            padding: "5px 12px",
            borderRadius: 100,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />// {tag}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "clamp(32px, 5vw, 50px)",
            color: C.ink,
            margin: "18px 0 0",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {children}
        </h2>
        {sub && (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: C.ink2, maxWidth: 520, margin: "16px auto 0", lineHeight: 1.6 }}>
            {sub}
          </p>
        )}
      </div>
    </Reveal>
  );
}
