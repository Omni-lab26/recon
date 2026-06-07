"use client";
import { useEffect, useState } from "react";
import { C } from "@/lib/tokens";

const DUMP = [
  "[  0.000000] RECON kernel v4.8.0 — booting",
  "[  1.337420] auth subsystem: initialized",
  "[  9.404040] supabase: connection established",
  "[ 12.500000] Oops: general protection fault",
  "[ 12.500001] RIP: 0x00000000deadbeef",
  "[ 12.500002] Call Trace:",
  "[ 12.500003]   ? next_server_action+0x2a0/0x4c0",
  "[ 12.500004]   ? __handle_exception+0x80/0x100",
  "[ 12.500005] Kernel panic — not syncing: Fatal exception",
];

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines(prev => [...prev, DUMP[i]]);
      i++;
      if (i >= DUMP.length) clearInterval(t);
    }, 90);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 640, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.pink}44`, boxShadow: `0 20px 60px ${C.pink}18` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#1a0d0d", borderBottom: `1px solid ${C.pink}33` }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8a8a98", marginLeft: 8 }}>kernel panic — recon core</span>
        </div>
        <div style={{ background: "#0c0005", padding: "16px 18px", minHeight: 180, fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.8, color: "#ff4d8d" }}>
          {lines.map((l, i) => (
            <div key={i} style={{ color: l.includes("Oops") || l.includes("panic") ? "#ff4d8d" : l.includes("RECON") || l.includes("auth") || l.includes("supa") ? "#00b87a" : "#9a9aa5" }}>
              {l}
            </div>
          ))}
          {lines.length < DUMP.length && (
            <span style={{ display: "inline-block", width: 7, height: 13, background: "#ff4d8d", animation: "blink 0.8s infinite", verticalAlign: "text-bottom" }} />
          )}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink, letterSpacing: 2, marginBottom: 8 }}>// SIGNAL 11 — SIGSEGV</div>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 38, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 10px" }}>サーバーがクラッシュした</h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: C.ink2, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 24px" }}>
          予期しないエラーが発生した。再試行するか、ホームに戻れ。
          {error.digest && <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginTop: 8 }}>digest: {error.digest}</span>}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "#fff", background: C.pink, border: "none", padding: "9px 18px", borderRadius: 9, cursor: "pointer" }}>
            ↺ 再試行
          </button>
          <a href="/" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink2, background: C.bg, border: `1px solid ${C.line2}`, padding: "9px 18px", borderRadius: 9, textDecoration: "none" }}>
            ← ホーム
          </a>
        </div>
      </div>
    </main>
  );
}
