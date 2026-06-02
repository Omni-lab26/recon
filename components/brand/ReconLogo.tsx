"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/tokens";

type Props = {
  /** font size in px for the wordmark */
  size?: number;
  /** if true, types "recon" on mount with a boot caret; if false, renders statically */
  animate?: boolean;
};

/**
 * RECON wordmark: >_recon
 * On mount, a prompt caret blinks, then "recon" types out — like a terminal booting.
 * Reused in the navbar (and anywhere the brand mark appears).
 */
export default function ReconLogo({ size = 18, animate = true }: Props) {
  const word = "recon";
  const [typed, setTyped] = useState(animate ? "" : word);
  const [booting, setBooting] = useState(animate);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i += 1;
        setTyped(word.slice(0, i));
        if (i >= word.length) {
          clearInterval(id);
          setTimeout(() => setBooting(false), 400);
        }
      }, 90);
    }, 420);
    return () => clearTimeout(start);
  }, [animate]);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "-0.01em",
        lineHeight: 1,
        userSelect: "none",
      }}
      aria-label="RECON"
    >
      <span style={{ color: C.accent, marginRight: 5 }}>&gt;_</span>
      <span style={{ color: C.ink }}>{typed}</span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: Math.round(size * 0.42),
          height: size * 0.82,
          background: C.accent,
          marginLeft: 2,
          transform: "translateY(1px)",
          opacity: booting ? 1 : 0,
          animation: "blink 0.7s steps(2) infinite",
        }}
      />
    </span>
  );
}
