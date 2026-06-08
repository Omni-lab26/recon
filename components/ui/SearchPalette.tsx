"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { TOOLS, TOOL_CATS } from "@/lib/tools-data";
import { ARTICLES } from "@/lib/articles-data";
import { TERMS, CATS } from "@/lib/glossary-data";
import { FIELDS } from "@/lib/roadmap-data";
import { C } from "@/lib/tokens";

type SearchItem = { id: string; title: string; sub: string; href: string; color: string; icon: string; type: string };

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // 静的ページ
  const pages = [
    { title: "ロードマップ", sub: "初級から上級までの体系的な学習マップ", href: "/roadmap", color: C.accent, icon: "</>" },
    { title: "CTF 問題集",  sub: "Web・Crypto・Pwn の練習問題に挑戦",  href: "/ctf",     color: C.purple, icon: "⚑" },
    { title: "ツール集",    sub: "Kali 標準ツールの解説と実用コマンド", href: "/tools",   color: C.cyan,   icon: "$" },
    { title: "CVE DB",      sub: "最新の脆弱性情報を NVD/KEV から取得", href: "/cve",     color: C.pink,   icon: "!" },
    { title: "ニュース",    sub: "CISA の最新セキュリティ勧告",         href: "/news",    color: C.pink,   icon: "◎" },
    { title: "用語集",      sub: "セキュリティの主要用語を平易に解説",   href: "/glossary",color: C.accent, icon: "?" },
    { title: "学習記事",    sub: "分野別の導入記事で土台を固める",       href: "/articles",color: C.blue,   icon: "#" },
    { title: "ラボ",        sub: "ブラウザ内ターミナルで攻撃と防御を体験",href: "/lab",    color: C.amber,  icon: "▶" },
  ];
  pages.forEach((p, i) => items.push({ id: `page-${i}`, ...p, type: "ページ" }));

  // ロードマップの各分野
  FIELDS.forEach((f) => items.push({ id: `field-${f.key}`, title: f.name, sub: f.desc, href: `/roadmap#${f.key}`, color: f.c, icon: f.glyph, type: "ロードマップ" }));

  // ツール
  TOOLS.forEach((t) => {
    const cat = TOOL_CATS[t.cat];
    items.push({ id: `tool-${t.id}`, title: t.name, sub: t.desc, href: `/tools/${t.id}`, color: cat.c, icon: cat.glyph, type: "ツール" });
  });

  // 学習記事
  ARTICLES.forEach((a) => items.push({ id: `article-${a.slug}`, title: a.title, sub: a.fieldName, href: `/articles/${a.slug}`, color: a.c, icon: "#", type: "記事" }));

  // 用語集
  TERMS.forEach((t) => {
    const cat = CATS[t.cat];
    items.push({ id: `term-${t.id}`, title: t.name, sub: t.short, href: `/glossary#${t.id}`, color: cat.c, icon: "?", type: "用語" });
  });

  return items;
}

const INDEX = buildIndex();

function search(q: string): SearchItem[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  const exact: SearchItem[] = [], starts: SearchItem[] = [], contains: SearchItem[] = [];
  for (const item of INDEX) {
    const t = item.title.toLowerCase(), s = item.sub.toLowerCase();
    if (t === lower) exact.push(item);
    else if (t.startsWith(lower)) starts.push(item);
    else if (t.includes(lower) || s.includes(lower)) contains.push(item);
  }
  return [...exact, ...starts, ...contains].slice(0, 9);
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const results = useMemo(() => search(q), [q]);

  const close = useCallback(() => { setOpen(false); setQ(""); setSel(0); }, []);
  const go = useCallback((href: string) => { close(); router.push(href); }, [close, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 60); setSel(0); } }, [open]);
  useEffect(() => { setSel(0); }, [q]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && results[sel]) go(results[sel].href);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "min(15vh, 100px)", padding: "min(15vh, 100px) 20px 20px", background: "rgba(10,10,15,0.46)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", animation: "modalBg 0.15s ease both" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 620, background: C.bg, borderRadius: 16, boxShadow: "0 24px 80px rgba(10,10,15,0.32)", border: `1px solid ${C.line}`, overflow: "hidden", animation: "modalIn 0.2s cubic-bezier(0.16,1,0.3,1) both" }}>
        {/* input */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${C.line}` }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: C.ink3 }}>⌘</span>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            placeholder="ツール・記事・用語・ページを検索..." style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink, background: "transparent", border: "none", outline: "none" }} />
          {q && <button onClick={() => setQ("")} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, background: `${C.line}`, border: "none", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>✕</button>}
          <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, background: C.soft, border: `1px solid ${C.line2}`, borderRadius: 5, padding: "3px 7px" }}>ESC</kbd>
        </div>

        {/* results */}
        {results.length > 0 ? (
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {results.map((item, i) => (
              <button key={item.id} onClick={() => go(item.href)} onMouseEnter={() => setSel(i)}
                style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", border: "none", borderBottom: `1px solid ${C.line}`, background: i === sel ? `${C.line}` : C.bg, cursor: "pointer", transition: "background 0.1s" }}>
                <span style={{ width: 32, height: 32, borderRadius: 9, background: `${item.color}14`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: item.color, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: C.ink3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{item.sub}</div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, flexShrink: 0, background: C.soft, border: `1px solid ${C.line2}`, padding: "2px 7px", borderRadius: 5 }}>{item.type}</span>
              </button>
            ))}
          </div>
        ) : q ? (
          <div style={{ padding: "32px 16px", textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink3 }}>
            「{q}」に一致する結果が見つかりません
          </div>
        ) : (
          <div style={{ padding: "16px 16px 10px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginBottom: 10, letterSpacing: 0.5 }}>// クイックナビ</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[["ロードマップ", "/roadmap", C.accent], ["ラボ", "/lab", C.amber], ["CVE", "/cve", C.pink], ["用語集", "/glossary", C.blue]].map(([label, href, color]) => (
                <button key={href} onClick={() => go(href as string)}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: color as string, background: `${color}0d`, border: `1px solid ${color}33`, padding: "6px 12px", borderRadius: 8, cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "8px 16px", borderTop: `1px solid ${C.line}`, display: "flex", gap: 14, alignItems: "center" }}>
          {["↑↓ 移動", "↵ 決定", "Esc 閉じる"].map((t) => (
            <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
