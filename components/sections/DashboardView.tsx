"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

type FavTool = { id: string; name: string; cat: string; catName: string; c: string };

const QUICK = [
  { href: "/roadmap", label: "ロードマップ", mono: "roadmap", glyph: "</>", c: C.accent },
  { href: "/ctf", label: "CTF問題集", mono: "ctf", glyph: "⚑", c: C.purple },
  { href: "/tools", label: "ツール集", mono: "tools", glyph: "$", c: C.cyan },
  { href: "/cve", label: "CVE DB", mono: "cve", glyph: "!", c: C.pink },
  { href: "/news", label: "ニュース", mono: "news", glyph: "◎", c: C.amber },
  { href: "/glossary", label: "用語集", mono: "glossary", glyph: "?", c: C.blue },
];

function QuickCard({ q }: { q: (typeof QUICK)[number] }) {
  const [h, setH] = useState(false);
  return (
    <Link href={q.href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 13, border: `1px solid ${h ? q.c + "55" : C.line}`, background: C.bg, textDecoration: "none", transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? `0 10px 26px ${q.c}1c` : "0 1px 2px rgba(10,10,15,0.03)" }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: `${q.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 16, color: q.c }}>{q.glyph}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>~/{q.mono}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: C.ink }}>{q.label}</div>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: q.c, opacity: h ? 1 : 0.4, transition: "opacity 0.2s" }}>→</span>
    </Link>
  );
}

export default function DashboardView({ email, createdAt, favTools }: { email: string; createdAt: string; favTools: FavTool[] }) {
  const joined = createdAt ? new Date(createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) : "";
  const initial = email[0]?.toUpperCase() ?? "?";

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />// dashboard
          </span>
        </Reveal>

        {/* greeting */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
            <span style={{ width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600, flexShrink: 0 }}>{initial}</span>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 24, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2 }}>おかえりなさい</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: C.ink2, marginTop: 3 }}>{email}{joined && <span style={{ color: C.ink3 }}> · {joined} から</span>}</div>
            </div>
          </div>
        </Reveal>

        {/* quick access */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5 }}>// クイックアクセス</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 36 }}>
            {QUICK.map((q) => <QuickCard key={q.href} q={q} />)}
          </div>
        </Reveal>

        {/* favorites */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.amber, letterSpacing: 0.5 }}>★ お気に入りツール</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{favTools.length}</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
            <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.cyan, textDecoration: "none" }}>すべて見る →</Link>
          </div>
          {favTools.length > 0 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
              {favTools.map((t) => (
                <Link key={t.id} href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 13px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.bg, textDecoration: "none" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: t.c }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: C.ink }}>{t.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>{t.catName}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: "28px 20px", borderRadius: 14, border: `1px dashed ${C.line2}`, background: C.soft, textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, marginBottom: 10 }}>まだお気に入りがありません。</div>
              <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.cyan, textDecoration: "none" }}>ツール集で ★ を付ける →</Link>
            </div>
          )}
        </Reveal>

        {/* coming soon: honest placeholder, no fake data */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5 }}>// 学習の記録</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>
          <div style={{ padding: "24px 22px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.soft }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 6 }}>進捗・ストリークは近日対応</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>
              ロードマップの達成状況、連続学習日数(ストリーク)、解いたCTFの記録などをここに表示する予定です。まずはクイックアクセスから学習を進めましょう。
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
