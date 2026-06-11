"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles-data";
import { useProgress } from "@/lib/use-progress";
import { useBookmarks } from "@/lib/use-bookmarks";
import { useTilt } from "@/lib/use-tilt";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { C } from "@/lib/tokens";

// 分野フィルタの一覧をデータから動的に生成
const FIELDS = Array.from(new Map(ARTICLES.map((a) => [a.field, { key: a.field, name: a.fieldName, c: a.c }])).values());

function Card({ a, done, bookmarked }: { a: (typeof ARTICLES)[number]; done: boolean; bookmarked: boolean }) {
  const tilt = useTilt(a.c);
  const h = tilt.hovered;
  return (
    <div {...tilt.handlers} style={tilt.style({ position: "relative", borderRadius: 15, border: `1px solid ${h ? a.c + "55" : C.line}`, background: C.bg, overflow: "hidden" })}>
      {tilt.glow}
      <Link href={`/articles/${a.slug}`}
        style={{ display: "block", padding: "20px 20px 14px", textDecoration: "none", position: "relative", zIndex: 1 }}>
        {done && (
          <span title="読了済み" style={{ position: "absolute", top: 14, right: 48, width: 22, height: 22, borderRadius: "50%", background: a.c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>✓</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingRight: 60 }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: a.c }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: a.c }}>{a.fieldName}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginLeft: "auto" }}>{a.level} · {a.readMin}分</span>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.35, marginBottom: 8 }}>{a.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{a.summary}</div>
        <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11, color: a.c, opacity: h ? 1 : 0.5, transition: "opacity 0.2s" }}>{done ? "もう一度読む →" : "読む →"}</div>
      </Link>
      <div style={{ padding: "0 12px 12px", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
        <BookmarkButton kind="article" id={a.slug} />
      </div>
      {/* ★ bookmark indicator in corner */}
      {bookmarked && <span style={{ position: "absolute", top: 12, right: 12, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 13, color: "#ff9f1c" }}>★</span>}
    </div>
  );
}

export default function ArticlesList() {
  const [field, setField] = useState<string | "all">("all");
  const { isDone } = useProgress();
  const { isBookmarked } = useBookmarks();
  const list = useMemo(() => field === "all" ? ARTICLES : ARTICLES.filter((a) => a.field === field), [field]);
  const doneCount = ARTICLES.reduce((acc, a) => acc + (isDone("article", a.slug) ? 1 : 0), 0);

  const pill = (active: boolean, c: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "6px 13px", borderRadius: 100, cursor: "pointer",
    border: `1px solid ${active ? c : C.line2}`, background: active ? `${c}10` : C.bg, color: active ? c : C.ink2, transition: "all 0.15s",
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 22, alignItems: "center" }}>
        <button style={pill(field === "all", C.ink)} onClick={() => setField("all")}>すべて</button>
        {FIELDS.map((f) => (
          <button key={f.key} style={pill(field === f.key, f.c)} onClick={() => setField(f.key)}>{f.name}</button>
        ))}
        {doneCount > 0 && (
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: C.accent }}>✓ {doneCount}/{ARTICLES.length} 読了</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {list.map((a) => <Card key={a.slug} a={a} done={isDone("article", a.slug)} bookmarked={isBookmarked("article", a.slug)} />)}
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, textAlign: "center", marginTop: 32 }}>
        // 各分野の導入記事から公開中 · 続編を順次追加予定
      </div>
    </div>
  );
}
