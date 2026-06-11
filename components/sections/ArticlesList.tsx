"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles-data";
import { FIELDS } from "@/lib/roadmap-data";
import { useProgress } from "@/lib/use-progress";
import { useBookmarks } from "@/lib/use-bookmarks";
import { useTilt } from "@/lib/use-tilt";
import { BookmarkButton } from "@/components/ui/BookmarkButton";
import { C } from "@/lib/tokens";

/* ── 記事カード ─────────────────────────────────────────── */
function ArticleCard({ a }: { a: (typeof ARTICLES)[number] }) {
  const { isDone } = useProgress();
  const { isBookmarked } = useBookmarks();
  const done = isDone("article", a.slug);
  const bookmarked = isBookmarked("article", a.slug);
  const tilt = useTilt(a.c, { max: 5, lift: 2, glowSize: 280 });
  const h = tilt.hovered;

  return (
    <div {...tilt.handlers} style={tilt.style({ position: "relative", borderRadius: 13, border: `1px solid ${h ? a.c + "55" : C.line}`, background: C.bg, overflow: "clip" })}>
      {tilt.glow}
      <Link href={`/articles/${a.slug}`}
        style={{ display: "block", padding: "16px 18px 12px", textDecoration: "none", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: a.c, background: `${a.c}10`, border: `1px solid ${a.c}33`, padding: "2px 8px", borderRadius: 5 }}>{a.level}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginLeft: "auto" }}>{a.readMin}分</span>
          {done && <span style={{ width: 18, height: 18, borderRadius: "50%", background: a.c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700 }}>✓</span>}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.35, marginBottom: 6 }}>{a.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: C.ink2, lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.summary}</div>
        <div style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 10.5, color: a.c, opacity: h ? 1 : 0.5, transition: "opacity 0.2s" }}>{done ? "もう一度読む →" : "読む →"}</div>
      </Link>
      <div style={{ padding: "0 10px 10px", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
        <BookmarkButton kind="article" id={a.slug} />
      </div>
      {bookmarked && <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2, fontFamily: "var(--font-mono)", fontSize: 12, color: "#ff9f1c" }}>★</span>}
    </div>
  );
}

/* ── 分野カード ─────────────────────────────────────────── */
function FieldCard({ fieldKey, open, onToggle }: { fieldKey: string; open: boolean; onToggle: () => void }) {
  const f = FIELDS.find((x) => x.key === fieldKey)!;
  const { isDone } = useProgress();
  const fieldArticles = useMemo(() => ARTICLES.filter((a) => a.field === fieldKey), [fieldKey]);
  const doneCount = fieldArticles.reduce((acc, a) => acc + (isDone("article", a.slug) ? 1 : 0), 0);
  const tilt = useTilt(f.c);
  const h = tilt.hovered;

  return (
    <div
      {...(!open ? tilt.handlers : {})}
      style={{
        borderRadius: 16,
        border: `1px solid ${open ? f.c + "55" : h ? f.c + "33" : C.line}`,
        background: C.bg,
        overflow: "clip",
        transition: "border-color 0.3s",
        ...(!open ? tilt.style({}) : {}),
      }}>

      {/* ヘッダー */}
      <div
        onClick={onToggle}
        role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onToggle()}
        style={{
          position: "relative", padding: "20px 22px", cursor: "pointer",
          overflow: "clip", background: open ? `${f.c}08` : C.bg,
          transition: "background 0.3s",
        }}>
        {!open && tilt.glow}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: `${f.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 20, color: f.c, flexShrink: 0 }}>
            {f.glyph}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: C.ink, letterSpacing: "-0.02em" }}>{f.name}</span>
              {fieldArticles.length > 0 && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: doneCount > 0 ? f.c : C.ink3 }}>
                  {doneCount > 0 ? `✓ ${doneCount}/` : ""}{fieldArticles.length}本
                </span>
              )}
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, marginTop: 3 }}>{f.desc}</div>
          </div>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
            {fieldArticles.length === 0 && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.ink3, background: C.soft, border: `1px solid ${C.line2}`, padding: "2px 8px", borderRadius: 5 }}>準備中</span>
            )}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, color: f.c, transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)", transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block", lineHeight: 1 }}>›</span>
          </div>
        </div>

        {/* 進捗バー */}
        {fieldArticles.length > 0 && (
          <div style={{ position: "relative", zIndex: 1, marginTop: 14, height: 3, borderRadius: 2, background: `${f.c}14`, overflow: "hidden" }}>
            <div style={{ width: `${fieldArticles.length > 0 ? (doneCount / fieldArticles.length) * 100 : 0}%`, height: "100%", background: `linear-gradient(90deg, ${f.c}, ${f.c}cc)`, transition: "width 0.5s ease" }} />
          </div>
        )}
      </div>

      {/* 記事リスト — 展開パネル */}
      {open && (
        <div style={{ borderTop: `1px solid ${f.c}22`, padding: "18px 18px 20px", animation: "rmOpen 0.28s cubic-bezier(0.16,1,0.3,1) both" }}>
          {fieldArticles.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {fieldArticles.map((a) => <ArticleCard key={a.slug} a={a} />)}
            </div>
          ) : (
            <div style={{ padding: "28px 20px", textAlign: "center", borderRadius: 12, border: `1px dashed ${f.c}44`, background: `${f.c}05` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: f.c, marginBottom: 10 }}>{f.glyph}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14.5, color: C.ink, marginBottom: 6 }}>{f.name} の記事は準備中</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, lineHeight: 1.7, marginBottom: 16 }}>
                ロードマップで全体像を確認しながら学習を進めましょう。
              </div>
              <Link href={`/roadmap#${f.key}`}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: f.c, background: `${f.c}0d`, border: `1px solid ${f.c}33`, padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>
                {f.name} のロードマップを見る →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── メイン ─────────────────────────────────────────────── */
export default function ArticlesList() {
  const [openKey, setOpenKey] = useState<string | null>("linux");
  const { isDone } = useProgress();
  const toggle = (key: string) => setOpenKey((cur) => cur === key ? null : key);
  const totalDone = ARTICLES.reduce((acc, a) => acc + (isDone("article", a.slug) ? 1 : 0), 0);

  return (
    <div>
      {totalDone > 0 && (
        <div style={{ marginBottom: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent }}>
          ✓ {totalDone} / {ARTICLES.length} 記事を読了済み
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FIELDS.map((f) => (
          <FieldCard key={f.key} fieldKey={f.key} open={openKey === f.key} onToggle={() => toggle(f.key)} />
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, textAlign: "center", marginTop: 32 }}>
        // 記事は順次追加予定 · 分野をクリックして展開
      </div>
    </div>
  );
}
