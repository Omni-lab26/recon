"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { C } from "@/lib/tokens";

const COMMANDS = [
  { prompt: "recon@lab:~$", cmd: " cd /target/secret", delay: 0 },
  { prompt: "", cmd: "bash: cd: /target/secret: No such file or directory", isErr: true, delay: 700 },
  { prompt: "recon@lab:~$", cmd: " traceroute 404.recon.tech", delay: 1200 },
  { prompt: "", cmd: "traceroute: unknown host 404.recon.tech", isErr: true, delay: 2000 },
];

const LINKS = [
  { href: "/", label: "~", title: "ホーム" },
  { href: "/roadmap", label: "roadmap", title: "ロードマップ" },
  { href: "/tools", label: "tools", title: "ツール" },
  { href: "/lab", label: "lab", title: "ラボ" },
];

export default function NotFoundView() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "done">("typing");

  useEffect(() => {
    if (step >= COMMANDS.length) { setPhase("done"); return; }
    const c = COMMANDS[step];
    const t = setTimeout(() => {
      // タイプライター
      let i = 0;
      const tick = setInterval(() => {
        i++;
        setTyped(c.cmd.slice(0, i));
        if (i >= c.cmd.length) {
          clearInterval(tick);
          setTimeout(() => { setStep(s => s + 1); setTyped(""); }, 300);
        }
      }, c.isErr ? 8 : 40);
      return () => clearInterval(tick);
    }, c.delay);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <main style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      {/* terminal window */}
      <div style={{ width: "100%", maxWidth: 620, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line2}`, boxShadow: "0 20px 60px rgba(10,10,15,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#161619", borderBottom: "1px solid #26262c" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8a8a98", marginLeft: 8 }}>recon@lab — zsh</span>
        </div>
        <div style={{ background: "#0c0c0e", padding: "20px 20px", minHeight: 160, fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.7 }}>
          {COMMANDS.slice(0, step).map((c, i) => (
            <div key={i}>
              {c.prompt && <span style={{ color: "#00b87a" }}>{c.prompt}</span>}
              <span style={{ color: c.isErr ? "#ff4d8d" : "#d6d6e0" }}>{c.cmd}</span>
            </div>
          ))}
          {step < COMMANDS.length && (
            <div>
              {COMMANDS[step].prompt && <span style={{ color: "#00b87a" }}>{COMMANDS[step].prompt}</span>}
              <span style={{ color: COMMANDS[step].isErr ? "#ff4d8d" : "#d6d6e0" }}>{typed}</span>
              <span style={{ display: "inline-block", width: 8, height: 14, background: "#00b87a", marginLeft: 1, animation: "blink 1s infinite", verticalAlign: "text-bottom" }} />
            </div>
          )}
          {phase === "done" && (
            <div style={{ marginTop: 8, color: "#ff9f1c" }}>
              <span style={{ color: "#ff9f1c" }}>signal 4 received — SIGILL</span>
            </div>
          )}
        </div>
      </div>

      {/* 404 message */}
      <div style={{ textAlign: "center", marginTop: 36 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink, letterSpacing: 2, marginBottom: 8 }}>// ERROR 404</div>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 42, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1, margin: "0 0 10px" }}>ルートが存在しない</h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink2, lineHeight: 1.7, maxWidth: 380, margin: "0 auto 30px" }}>
          偵察に失敗した。そのパスは存在しないか、移動した可能性がある。
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}33`, padding: "8px 16px", borderRadius: 9, textDecoration: "none" }}>
              ~/{l.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
