"use client";

import { useState } from "react";
import { C, GRAD } from "@/lib/tokens";
import { Reveal } from "@/components/ui/motion";
import { Section, SectionHead } from "@/components/ui/Section";

const { blue: BLUE, purple: PURPLE, pink: PINK, amber: AMBER, ink: INK, ink2: INK2, ink3: INK3, line: LINE, line2: LINE2, bg: BG } = C;

const RARITY: Record<string, { c: string; t: string }> = {
  common: { c: "#9a9aa5", t: "COMMON" },
  rare: { c: BLUE, t: "RARE" },
  epic: { c: PURPLE, t: "EPIC" },
  legendary: { c: AMBER, t: "LEGENDARY" },
};

type Badge = { glyph: string; color: string; fill: string; label: string; desc: string; req: string; rarity: keyof typeof RARITY; unlocked: boolean; date?: string; small?: boolean };

const BADGES: Badge[] = [
  { glyph: "flag{}", color: "#34d399", fill: "#0c1612", label: "first blood", desc: "初CTF制覇", req: "CTFを1問クリアする", rarity: "common", unlocked: true, date: "2026.05.20" },
  { glyph: "7d", color: "#60a5fa", fill: "#0c1320", label: "streak::7", desc: "7日連続学習", req: "7日続けてログイン", rarity: "common", unlocked: true, date: "2026.05.27" },
  { glyph: "--no-hint", color: "#c4b5fd", fill: "#15101f", label: "purist", desc: "ノーヒント制覇", req: "ヒントを使わずCTFクリア", rarity: "rare", unlocked: false, small: true },
  { glyph: "CVE", color: "#f87171", fill: "#1f0d0d", label: "cve hunter", desc: "CVE50件読破", req: "CVE解説を50件読む", rarity: "epic", unlocked: false },
  { glyph: "loop", color: "#34d399", fill: "#0c1612", label: "full loop", desc: "攻撃→防御完走", req: "理解→試す→守るを完走", rarity: "rare", unlocked: false },
  { glyph: "02:00", color: "#fcd34d", fill: "#1d1708", label: "night owl", desc: "深夜2時に稼働", req: "深夜2〜4時に学習する", rarity: "rare", unlocked: false, small: true },
];

function Chip({ b, size = 80, fs }: { b: Badge; size?: number; fs?: number }) {
  const R = RARITY[b.rarity];
  const u = b.unlocked;
  return (
    <div
      style={{
        position: "relative", width: size, height: size * 0.78, borderRadius: 12, overflow: "hidden",
        background: u ? b.fill : "#ececf1",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: fs ?? (b.small ? 13 : 16),
        color: u ? b.color : "#b4b4be",
        boxShadow: u ? `0 6px 18px ${b.color}2e, inset 0 0 0 1px ${b.color}55` : "inset 0 0 0 1px #dcdce4",
        filter: u ? "none" : "grayscale(1)",
      }}
    >
      {u && <span style={{ position: "absolute", top: 6, left: 8, width: 5, height: 5, borderRadius: "50%", background: b.color, opacity: 0.5 }} />}
      {b.glyph}
      {u && <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, width: "38%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", animation: "shine 4.5s ease-in-out infinite" }} />}
      {!u && (
        <span style={{ position: "absolute", bottom: 5, right: 6, opacity: 0.6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="#9a9aa5" strokeWidth="2.2" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" stroke="#9a9aa5" strokeWidth="2.2" />
          </svg>
        </span>
      )}
    </div>
  );
}

function Shelf() {
  const [hov, setHov] = useState<number | null>(null);
  const total = BADGES.length;
  const got = BADGES.filter((b) => b.unlocked).length;
  const latest = [...BADGES].filter((b) => b.unlocked).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))[0];
  const latestR = latest ? RARITY[latest.rarity] : null;

  return (
    <div className="ach-grid">
      {/* left: showcase of latest unlocked */}
      <Reveal>
        <div style={{ position: "relative", borderRadius: 18, border: `1px solid ${LINE}`, background: `linear-gradient(160deg, ${latest?.color ?? PINK}0c, transparent 60%)`, padding: "26px 24px", overflow: "hidden" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginBottom: 18 }}>// 最新の獲得</div>
          {latest && latestR && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                <Chip b={latest} size={108} fs={20} />
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: latestR.c }}>{latestR.t}</span>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 19, color: INK, marginTop: 4, letterSpacing: "-0.01em" }}>{latest.label}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: INK2, marginTop: 4 }}>{latest.desc}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginTop: 8 }}>獲得日 {latest.date}</div>
              </div>
            </>
          )}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${LINE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}>コレクション</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 14 }}>
                <b className="grad-text">{got}</b>
                <span style={{ color: INK3, fontFamily: "var(--font-mono)", fontSize: 12 }}> / {total}</span>
              </span>
            </div>
            <div style={{ position: "relative", height: 8, borderRadius: 100, background: "#f0f0f4", marginTop: 10, overflow: "hidden" }}>
              <div style={{ position: "absolute", insetBlock: 0, left: 0, width: `${(got / total) * 100}%`, background: GRAD, backgroundSize: "200% 100%", animation: "gradShift 4s linear infinite", borderRadius: 100, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginTop: 10 }}>あと {total - got} 個でコンプリート</div>
          </div>
        </div>
      </Reveal>

      {/* right: full grid (locked = grayed, not hidden) */}
      <div className="ach-badges">
        {BADGES.map((b, i) => {
          const R = RARITY[b.rarity];
          const u = b.unlocked;
          const edge = u ? b.color : R.c;
          return (
            <Reveal key={b.label} delay={(i % 3) * 0.05}>
              <div
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  position: "relative", textAlign: "center", padding: "18px 12px 16px", borderRadius: 14, background: BG,
                  border: `1px solid ${hov === i ? edge + "66" : LINE}`, cursor: "pointer",
                  transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", transform: hov === i ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hov === i ? `0 14px 34px ${edge}22` : "0 1px 2px rgba(10,10,15,0.03)",
                  opacity: u ? 1 : 0.92,
                }}
              >
                <div style={{ position: "absolute", top: 9, right: 11, fontFamily: "var(--font-mono)", fontSize: 8.5, fontWeight: 600, letterSpacing: "0.08em", color: R.c, opacity: u ? 1 : 0.6 }}>{R.t}</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Chip b={b} size={72} />
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: u ? INK : INK3, marginTop: 12, letterSpacing: "-0.01em" }}>{b.label}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: INK3, marginTop: 2, lineHeight: 1.5 }}>{u ? b.desc : "未獲得"}</div>
                {hov === i && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", width: 176, background: INK, color: "#fff", borderRadius: 11, padding: "10px 12px", zIndex: 12, boxShadow: "0 12px 32px rgba(10,10,15,0.28)" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12.5 }}>{b.label} <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: R.c }}>{R.t}</span></div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "#c9c9d4", marginTop: 4, lineHeight: 1.5 }}>{u ? `獲得日 ${b.date}` : `解除条件: ${b.req}`}</div>
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${INK}` }} />
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export default function Achievements() {
  return (
    <Section soft>
      <SectionHead tag="achievements" sub="獲得したものは輝き、まだのものは静かに次の目標として待つ。" color={PINK}>
        集めて、<span className="grad-text">極める</span>
      </SectionHead>
      <Shelf />
    </Section>
  );
}
