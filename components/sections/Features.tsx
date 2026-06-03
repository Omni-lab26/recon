"use client";

import { useState } from "react";
import { C } from "@/lib/tokens";
import { Reveal } from "@/components/ui/motion";
import { Section, SectionHead } from "@/components/ui/Section";

const { accent: GREEN, blue: BLUE, purple: PURPLE, pink: PINK, amber: AMBER, cyan: CYAN, ink: INK, ink2: INK2, ink3: INK3, line: LINE, bg: BG } = C;

type Feature = {
  area: string; n: string; glyph: string; title: string; mono: string; desc: string; level: string; c: string; big?: boolean;
};

const FEATURES: Feature[] = [
  { area: "ra", n: "01", glyph: "</>", title: "ロードマップ", mono: "roadmap", desc: "初級から上級まで、迷わず進める体系的カリキュラム。今のあなたに必要な一歩が、いつでも明確。", level: "All Levels", c: GREEN, big: true },
  { area: "ar", n: "02", glyph: "#", title: "学習記事", mono: "articles", desc: "ネットワーク基礎からWeb攻撃まで。", level: "Beginner → Expert", c: BLUE },
  { area: "ct", n: "03", glyph: "⚑", title: "CTF問題集", mono: "ctf", desc: "Web・Crypto・Pwn 分野別に挑戦。", level: "Beginner → Pro", c: PURPLE },
  { area: "to", n: "04", glyph: "$", title: "ツール集", mono: "tools", desc: "nmap, Burp, Metasploit の実践。", level: "All Levels", c: CYAN },
  { area: "cv", n: "05", glyph: "!", title: "CVE DB", mono: "cve", desc: "最新の脆弱性をAIが日本語解説。", level: "Inter → Pro", c: PINK },
  { area: "la", n: "06", glyph: "▶", title: "ラボ", mono: "lab", desc: "隔離環境で攻撃→防御を体験。", level: "Hands-on", c: AMBER },
];

function BentoCard({ f }: { f: Feature }) {
  const [s, setS] = useState({ rx: 0, ry: 0, mx: 50, my: 50, h: false });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setS({ rx: (px - 0.5) * 8, ry: (0.5 - py) * 8, mx: px * 100, my: py * 100, h: true });
  };
  const onLeave = () => setS({ rx: 0, ry: 0, mx: 50, my: 50, h: false });
  return (
    <div
      className={`b-${f.area}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        position: "relative", borderRadius: 18, background: BG, border: `1px solid ${s.h ? f.c + "66" : LINE}`,
        padding: f.big ? "30px 30px" : "22px 22px", cursor: "pointer", overflow: "hidden", transformStyle: "preserve-3d",
        transform: `perspective(800px) rotateX(${s.ry}deg) rotateY(${s.rx}deg) translateY(${s.h ? -3 : 0}px)`,
        transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s",
        boxShadow: s.h ? `0 18px 44px ${f.c}24, 0 6px 16px rgba(10,10,15,0.05)` : "0 1px 2px rgba(10,10,15,0.03)",
      }}
    >
      <div aria-hidden style={{ position: "absolute", inset: 0, opacity: s.h ? 1 : 0, transition: "opacity 0.3s", background: `radial-gradient(360px circle at ${s.mx}% ${s.my}%, ${f.c}1f, transparent 45%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: f.big ? 20 : 14, right: f.big ? 26 : 18, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: f.big ? 70 : 44, color: s.h ? `${f.c}24` : "rgba(10,10,15,0.04)", lineHeight: 1, letterSpacing: "-0.02em", transition: "color 0.35s" }}>{f.n}</div>
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: f.big ? 54 : 42, height: f.big ? 54 : 42, borderRadius: 13, background: `${f.c}14`, fontFamily: "var(--font-mono)", fontSize: f.big ? 24 : 18, color: f.c, marginBottom: f.big ? 18 : 12, transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", transform: s.h ? "scale(1.1) rotate(-4deg)" : "scale(1)" }}>{f.glyph}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginBottom: 4 }}>~/{f.mono}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: f.big ? 26 : 18, color: INK, marginBottom: f.big ? 10 : 7, letterSpacing: "-0.01em" }}>{f.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: f.big ? 14.5 : 12.5, color: INK2, lineHeight: 1.6, marginBottom: 14, flex: f.big ? "0 0 auto" : 1 }}>{f.desc}</div>
        {f.big && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: INK2, background: "#0a0a0b", borderRadius: 10, padding: "12px 14px", marginTop: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: GREEN }}>$</span>
            <span style={{ color: "#d6d6e0" }}>recon --start</span>
            <span style={{ display: "inline-block", width: 7, height: 14, background: GREEN, animation: "blink 1s steps(2) infinite" }} />
          </div>
        )}
        <span style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: 11, color: f.c, border: `1px solid ${f.c}33`, background: `${f.c}0d`, padding: "3px 10px", borderRadius: 7, marginTop: f.big ? 14 : 0 }}>{f.level}</span>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <Section>
      <SectionHead tag="features" sub="ホワイトハッキングに必要なリソースを、ひとつに集約。" color={GREEN}>
        すべてが揃う<span className="grad-text"> 学習環境</span>
      </SectionHead>
      <Reveal>
        <div className="bento">
          {FEATURES.map((f) => (
            <BentoCard key={f.mono} f={f} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
