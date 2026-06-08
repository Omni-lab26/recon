import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import ArticlesList from "@/components/sections/ArticlesList";
import { PageLabel } from "@/components/ui/PageLabel";
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
          <PageLabel label="articles" description="分野別の導入記事で土台を固める" color={C.blue} />
        </Reveal>
        <Reveal><ArticlesList /></Reveal>
      </section>
    </main>
  );
}
