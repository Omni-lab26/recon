import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import ArticlesList from "@/components/sections/ArticlesList";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "学習記事",
  description: "Linux・ネットワーク・Web・暗号・Pwn・フォレンジック・OSINT。各分野の導入記事で、攻撃と防御の土台を固める。",
};

export default function ArticlesPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.blue, background: `${C.blue}10`, border: `1px solid ${C.blue}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.blue }} />// articles
          </span>
        </Reveal>
        <Reveal><ArticlesList /></Reveal>
      </section>
    </main>
  );
}
