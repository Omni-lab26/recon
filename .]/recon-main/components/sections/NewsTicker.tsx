"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/tokens";
import type { TickerItem } from "@/app/api/feed/route";

const SEV: Record<TickerItem["severity"], { c: string; t: string }> = {
  critical: { c: C.pink, t: "CRITICAL" },
  high: { c: C.amber, t: "HIGH" },
  medium: { c: C.blue, t: "MEDIUM" },
  info: { c: C.ink3, t: "INFO" },
};

function Item({ it }: { it: TickerItem }) {
  const s = SEV[it.severity];
  return (
    <a
      href={it.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "0 28px",
        textDecoration: "none",
        whiteSpace: "nowrap",
        borderRight: `1px solid ${C.line}`,
      }}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.06em", color: s.c, border: `1px solid ${s.c}44`, background: `${s.c}10`, padding: "2px 7px", borderRadius: 5 }}>
        {s.t}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{it.source}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, maxWidth: 460, overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</span>
    </a>
  );
}

export default function NewsTicker() {
  const [items, setItems] = useState<TickerItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.ok && d.items?.length) setItems(d.items);
        else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(4px)",
        overflow: "hidden",
      }}
    >
      {/* label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 18px",
          background: C.bg,
          borderRight: `1px solid ${C.line}`,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: C.accent,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite" }} />
        // live threats
      </div>

      <div
        className="ticker-mask"
        style={{
          padding: "12px 0 12px 150px",
          maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 92%, transparent)",
        }}
      >
        {items ? (
          <div className="ticker-track" style={{ display: "flex", width: "max-content" }}>
            {[...items, ...items].map((it, i) => (
              <Item key={i} it={it} />
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, paddingLeft: 4 }}>
            {failed ? "// 最新情報を取得できませんでした（フィード元に接続できません）" : "// 最新の脅威情報を取得中…"}
          </div>
        )}
      </div>

      <style>{`
        .ticker-track { animation: tickerMove 150s linear infinite; }
        .ticker-mask:hover .ticker-track { animation-play-state: paused; }
        @keyframes tickerMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
