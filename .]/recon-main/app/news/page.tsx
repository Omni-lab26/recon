import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import NewsBoard from "@/components/sections/NewsBoard";
import { PageLabel } from "@/components/ui/PageLabel";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "ニュース",
  description: "最新のセキュリティ情報を1日3回（朝・昼・夜）更新。CISA公式アドバイザリから、緊急度の高いものを優先表示。",
};

export default function NewsPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 980, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <PageLabel label="news" description="CISA の最新セキュリティ勧告" color={C.pink} pulse />
        </Reveal>
        <Reveal>
          <NewsBoard />
        </Reveal>
      </section>
    </main>
  );
}
