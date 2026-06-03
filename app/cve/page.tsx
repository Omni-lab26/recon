import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import CVEList from "@/components/sections/CVEList";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "CVE データベース",
  description: "最新の脆弱性情報（CVE）を1日3回更新。NVD公式 + CISA KEV連携。深刻度・ベンダー・KEVで絞り込み。",
};

export default function CVEPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.pink, background: `${C.pink}10`, border: `1px solid ${C.pink}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink }} />// cve
          </span>
        </Reveal>
        <Reveal>
          <CVEList />
        </Reveal>
      </section>
    </main>
  );
}
