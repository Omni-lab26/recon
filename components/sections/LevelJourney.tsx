"use client";

import { useState } from "react";
import { C } from "@/lib/tokens";
import { Reveal } from "@/components/ui/motion";
import { Section, SectionHead } from "@/components/ui/Section";

const { accent: GREEN, blue: BLUE, pink: PINK, ink: INK, ink2: INK2, ink3: INK3, line: LINE, line2: LINE2, bg: BG } = C;

const TAG_GLYPH: Record<string, string> = { "記事": "#", "ツール": "$", "演習": "▶", "CTF": "⚑", "CVE": "!", "Lab": "▶" };

type Step = { t: string; tag: string };
type Journey = { c: string; label: string; sub: string; steps: Step[] };

const JOURNEYS: Record<string, Journey> = {
  beginner: { c: GREEN, label: "BEGINNER", sub: "「セキュリティって何？」から、確かな土台を。", steps: [{ t: "Linux基礎", tag: "記事" }, { t: "ネットワーク入門", tag: "記事" }, { t: "Webの仕組み", tag: "記事" }, { t: "はじめてのCTF", tag: "CTF" }] },
  intermediate: { c: BLUE, label: "INTERMEDIATE", sub: "ツールを手に、実際に攻めて学ぶフェーズ。", steps: [{ t: "Burp Suite入門", tag: "ツール" }, { t: "Nmap完全ガイド", tag: "ツール" }, { t: "SQLインジェクション", tag: "演習" }, { t: "CTF Easy制覇", tag: "CTF" }] },
  advanced: { c: PINK, label: "ADVANCED / PRO", sub: "現役の最前線。攻撃を理解し、守りを設計する。", steps: [{ t: "最新CVE解説", tag: "CVE" }, { t: "エクスプロイト基礎", tag: "演習" }, { t: "権限昇格テクニック", tag: "演習" }, { t: "ハンズオンラボ", tag: "Lab" }] },
};
const LV_KEYS = ["beginner", "intermediate", "advanced"] as const;

function Journey() {
  const [lvl, setLvl] = useState<string>("beginner");
  const j = JOURNEYS[lvl];
  const idx = LV_KEYS.indexOf(lvl as (typeof LV_KEYS)[number]);
  return (
    <div>
      <div style={{ position: "relative", display: "flex", gap: 6, background: "#f4f4f7", border: `1px solid ${LINE}`, borderRadius: 14, padding: 6, maxWidth: 560, margin: "0 auto 14px" }}>
        <div aria-hidden style={{ position: "absolute", top: 6, bottom: 6, left: `calc(${idx * (100 / 3)}% + 6px)`, width: `calc(${100 / 3}% - 8px)`, borderRadius: 10, background: BG, boxShadow: `0 2px 10px ${j.c}33, inset 0 0 0 1px ${j.c}55`, transition: "left 0.45s cubic-bezier(0.16,1,0.3,1)" }} />
        {LV_KEYS.map((k) => (
          <button key={k} onClick={() => setLvl(k)} style={{ position: "relative", zIndex: 2, flex: 1, padding: "10px 6px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em", color: lvl === k ? JOURNEYS[k].c : INK3, transition: "color 0.3s" }}>{JOURNEYS[k].label}</button>
        ))}
      </div>
      <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 15, color: INK2, marginBottom: 40, minHeight: 22 }} key={"sub" + lvl}>
        <span style={{ animation: "fadeUp 0.5s ease both", display: "inline-block", opacity: 0 }}>{j.sub}</span>
      </div>

      <div key={lvl} className="journey">
        {j.steps.map((st, i) => (
          <div key={i} className="jstep">
            {i < j.steps.length - 1 && <div className="jconn" style={{ background: `linear-gradient(90deg, ${j.c}, ${j.c}66)`, animation: `growX 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.12 + 0.15}s both` }} />}
            <div className="jnodewrap">
              <div className="jnode" style={{ background: BG, border: `2px solid ${j.c}`, color: j.c, boxShadow: `0 6px 16px ${j.c}33`, animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s both` }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 15 }}>{TAG_GLYPH[st.tag]}</span>
              </div>
            </div>
            <div className="jlabel" style={{ animation: `fadeUp 0.5s ease ${i * 0.12 + 0.1}s both`, opacity: 0 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: j.c, marginBottom: 3 }}>STEP {i + 1} · {st.tag}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: INK, letterSpacing: "-0.01em" }}>{st.t}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 38 }} key={"cta" + lvl}>
        <span style={{ display: "inline-block", animation: "fadeUp 0.5s ease 0.5s both", opacity: 0 }}>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 11, border: "none", cursor: "pointer", color: "#fff", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, background: `linear-gradient(115deg, ${j.c}, ${j.c}bb)`, boxShadow: `0 6px 18px ${j.c}40` }}>このパスを始める →</button>
        </span>
      </div>
    </div>
  );
}

export default function LevelJourney() {
  return (
    <Section soft>
      <SectionHead tag="your_path" sub="レベルを選ぶと、あなただけの学習ルートが現れる。" color={BLUE}>
        今いる場所から、<span className="grad-text">始めよう</span>
      </SectionHead>
      <Reveal>
        <Journey />
      </Reveal>
      <Reveal>
        <div style={{ marginTop: 40, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: INK3, border: `1px dashed ${LINE2}`, borderRadius: 12, padding: "14px 20px", maxWidth: 560, margin: "40px auto 0", background: BG }}>
          <span style={{ color: GREEN }}>// </span>将来「完全初心者（Lv.0）」タブをここに追加できる構造です
        </div>
      </Reveal>
    </Section>
  );
}
