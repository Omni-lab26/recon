import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import NewsBoard from "@/components/sections/NewsBoard";
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
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.pink, background: `${C.pink}10`, border: `1px solid ${C.pink}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.pink, animation: "pulse 2s infinite" }} />// news
          </span>
        </Reveal>
        <Reveal>
          <NewsBoard />
        </Reveal>
      </section>
    </main>
  );
}
