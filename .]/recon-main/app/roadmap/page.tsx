import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import RoadmapFields from "@/components/sections/RoadmapFields";
import { LEVELS } from "@/lib/roadmap-data";
import { PageLabel } from "@/components/ui/PageLabel";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "ロードマップ",
  description: "分野別に、入門(L1)から到達点(L5)まで。どこから登っても頂はひとつ。RECONの学習ロードマップ。",
};

export default function RoadmapPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      {/* label */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 24px 0" }}>
        <Reveal>
          <PageLabel label="roadmap" description="初級から上級までの体系的な学習マップ" color={C.accent} />
        </Reveal>
      </section>

      {/* beginner START — pinned at top */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 24px 6px" }}>
        <Reveal>
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", padding: "24px 26px", background: `linear-gradient(120deg, ${C.accent}14, ${C.cyan}0c 60%, transparent)`, border: `1px solid ${C.accent}44`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 54, height: 54, borderRadius: 15, background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 24, color: "#fff", boxShadow: `0 8px 22px ${C.accent}44` }}>▶</div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.accent, marginBottom: 4 }}>// 何から始めればいい？</div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 19, color: C.ink, letterSpacing: "-0.01em" }}>完全初心者は、まずここから。</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, marginTop: 3 }}>登山口は「Linux 基礎」の L1「ターミナル入門」。10分で最初の一歩。</div>
              </div>
            </div>
            <a href="#linux" className="btn-primary" style={{ background: `linear-gradient(115deg, ${C.accent}, ${C.cyan})` }}>最初の一歩を踏み出す →</a>
          </div>
        </Reveal>
      </section>

      {/* level legend */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 24px 0" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3 }}>// 分野を選んで、L1 → L5 を登る</span>
            <div style={{ flex: 1, minWidth: 20, height: 1, background: C.line }} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {LEVELS.map((l) => (
                <span key={l.lv} style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink2, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: l.c }} />{l.lv} {l.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* fields */}
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 90px" }}>
        <RoadmapFields />
      </section>
    </main>
  );
}
