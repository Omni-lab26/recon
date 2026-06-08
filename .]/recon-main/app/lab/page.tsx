import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import LabTerminal from "@/components/lab/LabTerminal";
import { PageLabel } from "@/components/ui/PageLabel";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "ラボ",
  description: "ブラウザ内の隔離されたターミナルで、攻撃と防御をハンズオンで体験。Recon・フォレンジック・暗号・Web の実践ミッション。",
};

export default function LabPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <PageLabel label="lab" description="ブラウザ内ターミナルで攻撃と防御を体験" color={C.amber} />
        </Reveal>
        <Reveal>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 28, color: C.ink, letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 8px" }}>ハンズオン・ラボ</h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: C.ink2, lineHeight: 1.7, margin: "0 0 26px", maxWidth: 620 }}>
            ブラウザ内で完結する隔離ターミナル。実際にコマンドを打ちながら、攻撃の手口とその防ぎ方を学ぶ。すべてシミュレーションなので、安全に何度でも試せる。
          </p>
        </Reveal>
        <Reveal><LabTerminal /></Reveal>
      </section>
    </main>
  );
}
