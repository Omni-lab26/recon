import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TOOLS, TOOL_CATS } from "@/lib/tools-data";
import { CopyCommand } from "@/components/ui/CopyCommand";
import { TermChip } from "@/components/glossary/TermChip";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

export function generateStaticParams() {
  return TOOLS.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) return { title: "ツール" };
  return { title: `${tool.name} の使い方`, description: tool.long.slice(0, 120) };
}

function Heading({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5, marginBottom: 10, marginTop: 30 }}>{children}</div>;
}

export default function ToolDetailPage({ params }: { params: { id: string } }) {
  const tool = TOOLS.find((t) => t.id === params.id);
  if (!tool) notFound();
  const cat = TOOL_CATS[tool.cat];

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 100px" }}>
        <Reveal>
          <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, textDecoration: "none" }}>← ツール集</Link>

          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ width: 52, height: 52, borderRadius: 13, background: `${cat.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 22, color: cat.c, flexShrink: 0 }}>{cat.glyph}</span>
            <div>
              <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0 }}>{tool.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 5, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: cat.c }}>{cat.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#ff9f1c", letterSpacing: 1 }}>{"★".repeat(tool.star)}<span style={{ color: C.line2 }}>{"★".repeat(3 - tool.star)}</span></span>
                {tool.kali && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, color: cat.c, background: `${cat.c}12`, border: `1px solid ${cat.c}40`, padding: "2px 7px", borderRadius: 6 }}>Kali標準</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 22 }}>
            {tool.tags.map((x) => <span key={x} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink2, background: C.soft, border: `1px solid ${C.line}`, padding: "2px 7px", borderRadius: 6 }}>{x}</span>)}
          </div>

          {/* 概要 */}
          <Heading>// これは何か</Heading>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink, lineHeight: 1.85, margin: 0 }}>{tool.long}</p>

          {/* 仕組み */}
          <Heading>// どう動くか</Heading>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink, lineHeight: 1.85, margin: 0 }}>{tool.how}</p>

          {/* インストール */}
          <Heading>// インストール</Heading>
          <CopyCommand commands={[tool.install]} />

          {/* 基本 */}
          <Heading>// 基本コマンド</Heading>
          <CopyCommand commands={tool.basic} />

          {/* 応用 */}
          <Heading>// 応用コマンド</Heading>
          <CopyCommand commands={tool.advanced} />

          {/* ロードマップ */}
          <Heading>// 学習でどう使うか</Heading>
          <Link href={`/roadmap#${tool.roadmap.fieldKey}`} style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: C.soft, textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: cat.c }}>⛰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>ロードマップで使う</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: C.ink }}>{tool.roadmap.field} · {tool.roadmap.step}</div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: cat.c }}>→</span>
          </Link>

          {/* 関連用語 */}
          {tool.terms.length > 0 && (
            <>
              <Heading>// 関連用語</Heading>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {tool.terms.map((tid) => <TermChip key={tid} termId={tid} />)}
              </div>
            </>
          )}
        </Reveal>
      </article>
    </main>
  );
}
