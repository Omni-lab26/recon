import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import CVEList from "@/components/sections/CVEList";
import { PageLabel } from "@/components/ui/PageLabel";
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
          <PageLabel label="cve" description="最新の脆弱性情報を NVD / CISA KEV から取得" color={C.pink} />
        </Reveal>
        <Reveal>
          <CVEList />
        </Reveal>
      </section>
    </main>
  );
}
