import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import GlossaryView from "@/components/sections/GlossaryView";
import { PageLabel } from "@/components/ui/PageLabel";
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
          <PageLabel label="glossary" description="セキュリティの主要用語を平易に解説" color={C.accent} />
        </Reveal>
        <Reveal>
          <GlossaryView />
        </Reveal>
      </section>
    </main>
  );
}
