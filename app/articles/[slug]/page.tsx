import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles-data";
import { TermChip } from "@/components/glossary/TermChip";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = ARTICLES.find((x) => x.slug === params.slug);
  if (!a) return { title: "記事" };
  return { title: a.title, description: a.summary };
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const idx = ARTICLES.findIndex((x) => x.slug === params.slug);
  if (idx === -1) notFound();
  const a = ARTICLES[idx];
  const prev = idx > 0 ? ARTICLES[idx - 1] : null;
  const next = idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : null;

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 100px" }}>
        <Reveal>
          <Link href="/articles" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, textDecoration: "none" }}>← 学習記事</Link>

          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 22, marginBottom: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: 2, background: a.c }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: a.c }}>{a.fieldName}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>· {a.level} · {a.readMin}分で読める</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 32, color: C.ink, letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 14px" }}>{a.title}</h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15.5, color: C.ink2, lineHeight: 1.7, margin: "0 0 10px", paddingBottom: 22, borderBottom: `1px solid ${C.line}` }}>{a.summary}</p>

          {/* body */}
          <div style={{ marginTop: 8 }}>
            {a.body.map((b, i) => {
              if (b.t === "h") return <h2 key={i} style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 19, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.35, margin: "30px 0 12px" }}>{b.s}</h2>;
              if (b.t === "p") return <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink, lineHeight: 1.95, margin: "0 0 16px" }}>{b.s}</p>;
              if (b.t === "code") return (
                <div key={i} style={{ background: "#0c0c0e", borderRadius: 11, padding: "14px 16px", margin: "0 0 18px" }}>
                  {b.lines.map((ln, j) => (
                    <div key={j} style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#d6d6e0", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{ln}</div>
                  ))}
                </div>
              );
              if (b.t === "note") return (
                <div key={i} style={{ display: "flex", gap: 10, padding: "13px 15px", margin: "0 0 18px", borderRadius: 11, background: `${a.c}0a`, border: `1px solid ${a.c}33` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: a.c, flexShrink: 0 }}>!</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink, lineHeight: 1.7 }}>{b.s}</span>
                </div>
              );
              return null;
            })}
          </div>

          {/* related terms */}
          {a.terms.length > 0 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5, margin: "30px 0 10px" }}>// 関連用語</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {a.terms.map((tid) => <TermChip key={tid} termId={tid} />)}
              </div>
            </>
          )}

          {/* roadmap CTA */}
          <Link href={`/roadmap#${a.field}`} style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: C.soft, textDecoration: "none", marginTop: 28 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: a.c }}>⛰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>次のステップ</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 600, color: C.ink }}>ロードマップで {a.fieldName} を進める</div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: a.c }}>→</span>
          </Link>

          {/* prev / next */}
          <div style={{ display: "flex", gap: 12, marginTop: 28, paddingTop: 22, borderTop: `1px solid ${C.line}` }}>
            <div style={{ flex: 1 }}>
              {prev && (
                <Link href={`/articles/${prev.slug}`} style={{ display: "block", textDecoration: "none" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 3 }}>← 前の記事</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: C.ink }}>{prev.title}</div>
                </Link>
              )}
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {next && (
                <Link href={`/articles/${next.slug}`} style={{ display: "block", textDecoration: "none" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 3 }}>次の記事 →</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: C.ink }}>{next.title}</div>
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </article>
    </main>
  );
}
