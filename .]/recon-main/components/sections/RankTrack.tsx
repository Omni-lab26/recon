"use client";

import { useState } from "react";
import { C, GRAD } from "@/lib/tokens";
import { Reveal } from "@/components/ui/motion";
import { Section, SectionHead } from "@/components/ui/Section";

const { purple: PURPLE, ink: INK, ink2: INK2, ink3: INK3, line: LINE, bg: BG } = C;

type Rank = { glyph: string; color: string; fill: string; label: string; lv: string; req: string };

const RANKS: Rank[] = [
  { glyph: "$_", color: "#1D9E75", fill: "#0c1612", label: "recruit", lv: "Lv.1", req: "登録して最初の記事を読む" },
  { glyph: ">_", color: "#4f9bf0", fill: "#0c1320", label: "operator", lv: "Lv.2", req: "CTFを5問クリア / 3日連続学習" },
  { glyph: "~/#", color: "#a78bfa", fill: "#15101f", label: "breaker", lv: "Lv.3", req: "CTF20問 / 演習10本 / 攻撃→防御を完走" },
  { glyph: "0x1F", color: "#f87171", fill: "#1f0d0d", label: "ghost", lv: "Lv.4", req: "全分野のCTF制覇 / CVE50件読破" },
  { glyph: "sudo", color: "#fbbf24", fill: "#1d1708", label: "legend", lv: "Lv.5", req: "ラボ全クリア / コミュニティ貢献" },
];
const CUR = 1; // 現在のランク（デモ: operator）

function Track() {
  const [hov, setHov] = useState<number | null>(null);
  const next = RANKS[CUR + 1];
  return (
    <div style={{ background: BG, border: `1px solid ${LINE}`, borderRadius: 20, padding: "40px 26px 30px", boxShadow: "0 2px 8px rgba(10,10,15,0.03)" }}>
      {/* summary header */}
      <div style={{ maxWidth: 520, margin: "0 auto 30px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: INK2 }}>
          あなたは今 <b style={{ color: RANKS[CUR].color }}>{RANKS[CUR].label}</b>{" "}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: INK3 }}>({RANKS[CUR].lv})</span>
        </div>
        <div style={{ position: "relative", height: 8, borderRadius: 100, background: "#f0f0f4", marginTop: 12, overflow: "hidden" }}>
          <div style={{ position: "absolute", insetBlock: 0, left: 0, width: "42%", background: GRAD, backgroundSize: "200% 100%", animation: "gradShift 4s linear infinite", borderRadius: 100 }} />
        </div>
        {next && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginTop: 8 }}>
            次は <span style={{ color: next.color }}>{next.label}</span> まで — {next.req}
          </div>
        )}
      </div>

      {/* vertical zigzag timeline */}
      <div className="vtrack">
        {RANKS.map((r, i) => {
          const reached = i <= CUR;
          const isCur = i === CUR;
          const side = i % 2 === 0 ? "L" : "R";
          return (
            <div key={r.label} className="vrow" data-side={side} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              {i < RANKS.length - 1 && (
                <div className="vconn" style={{ background: i < CUR ? GRAD : "#e6e6ec", animation: `growY 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.1}s both` }} />
              )}

              {/* node */}
              <div className="vnode-cell">
                <div style={{ position: "relative", animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both` }}>
                  {isCur && <div aria-hidden style={{ position: "absolute", inset: -7, borderRadius: 15, border: `2px solid ${r.color}`, animation: "ringPulse 2s ease-out infinite" }} />}
                  <div
                    style={{
                      position: "relative", width: 56, height: 56, borderRadius: 14,
                      background: reached ? r.fill : "#f4f4f7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 17,
                      color: reached ? r.color : INK3,
                      boxShadow: reached ? `0 6px 18px ${r.color}33, inset 0 0 0 1px ${r.color}66` : "inset 0 0 0 1px #dcdce4",
                      filter: reached ? "none" : "grayscale(0.5)",
                      transition: "transform 0.3s", transform: hov === i ? "scale(1.06)" : "scale(1)",
                    }}
                  >
                    {r.glyph}
                  </div>
                </div>
              </div>

              {/* side card */}
              <div className="vcard-cell">
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: side === "L" ? "flex-end" : "flex-start", gap: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexDirection: side === "L" ? "row-reverse" : "row" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: reached ? INK : INK3, letterSpacing: "-0.01em" }}>{r.label}</span>
                    {isCur && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "#fff", background: r.color, padding: "2px 7px", borderRadius: 5, boxShadow: `0 3px 8px ${r.color}55` }}>YOU</span>}
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3 }}>{r.lv}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: reached ? r.color : INK3, lineHeight: 1.5, maxWidth: 240 }}>
                    {reached ? "達成済み ✓" : `条件: ${r.req}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RankTrack() {
  return (
    <Section>
      <SectionHead tag="ranks" sub="学べば学ぶほど、下から上へ。権限を一段ずつ登っていく。" color={PURPLE}>
        あなたの<span className="grad-text"> ランク</span>
      </SectionHead>
      <Reveal>
        <Track />
      </Reveal>
    </Section>
  );
}
