import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import GlossaryView from "@/components/sections/GlossaryView";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "用語集",
  description: "ハッカー関係の必須用語を、5カテゴリ・42語で整理。CVE・KEV・CVSS・0day・RCE・サプライチェーン攻撃など。各用語からロードマップ・ツール・CVEへの導線あり。",
};

export default function GlossaryPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />// glossary
          </span>
        </Reveal>
        <Reveal>
          <GlossaryView />
        </Reveal>
      </section>
    </main>
  );
}
