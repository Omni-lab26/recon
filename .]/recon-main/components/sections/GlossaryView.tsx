"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { TERMS, CATS, type Cat, type Term } from "@/lib/glossary-data";
import { C } from "@/lib/tokens";

function Tile({ t, onOpen, active }: { t: Term; onOpen: (id: string) => void; active: boolean }) {
  const [h, setH] = useState(false);
  const cat = CATS[t.cat];
  return (
    <button id={`tile-${t.id}`} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => onOpen(t.id)}
      style={{ position: "relative", textAlign: "left", padding: "12px 14px 12px 18px", borderRadius: 10, background: active ? `${cat.c}06` : C.bg, border: `1px solid ${active ? cat.c + "55" : h ? cat.c + "44" : C.line}`, cursor: "pointer", transition: "all 0.18s", overflow: "hidden", display: "block", fontFamily: "inherit" }}>
      <span aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: cat.c, opacity: h || active ? 1 : 0.5, transition: "opacity 0.2s" }} />
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.25, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: C.ink3, lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.short}</div>
    </button>
  );
}

function DetailModal({ term, allMap, onClose, onJump }: { term: Term | null; allMap: Record<string, Term>; onClose: () => void; onJump: (id: string) => void }) {
  if (!term) return null;
  const cat = CATS[term.cat];
  return (
    <div onClick={onClose} role="dialog" aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,10,15,0.42)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", animation: "modalBg 0.2s ease both" }}>
      <article onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 600, maxHeight: "calc(100vh - 40px)", overflowY: "auto", background: C.bg, borderRadius: 16, boxShadow: "0 30px 80px rgba(10,10,15,0.28)", animation: "modalIn 0.24s cubic-bezier(0.16,1,0.3,1) both" }}>
        {/* sticky header inside modal */}
        <div style={{ position: "sticky", top: 0, background: C.bg, borderBottom: `1px solid ${C.line}`, padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, zIndex: 2 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: cat.c, background: `${cat.c}0d`, border: `1px solid ${cat.c}33`, padding: "3px 9px", borderRadius: 7 }}>{cat.name}</span>
          <button onClick={onClose} aria-label="閉じる" style={{ background: "transparent", border: "none", fontFamily: "var(--font-mono)", fontSize: 14, color: C.ink3, cursor: "pointer", padding: "4px 8px", lineHeight: 1, borderRadius: 6 }}>✕</button>
        </div>

        <div style={{ padding: "22px 26px 32px" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 30, color: C.ink, letterSpacing: "-0.025em", lineHeight: 1.18, marginBottom: 10 }}>{term.name}</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink2, lineHeight: 1.6, marginBottom: 22, paddingBottom: 18, borderBottom: `1px solid ${C.line}` }}>{term.short}</div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 10, letterSpacing: 0.5 }}>// 解説</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: C.ink, lineHeight: 1.95, marginBottom: 26 }}>{term.long}</div>

          {term.related.length > 0 && (
            <>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 8, letterSpacing: 0.5 }}>// 関連用語</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
                {term.related.map((rid) => {
                  const rel = allMap[rid];
                  if (!rel) return null;
                  const rc = CATS[rel.cat];
                  return (
                    <button key={rid} onClick={() => onJump(rid)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: rc.c, background: `${rc.c}0d`, border: `1px solid ${rc.c}33`, padding: "5px 11px", borderRadius: 7, cursor: "pointer" }}>
                      {rel.name} →
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <a href={term.learn.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.soft, textDecoration: "none" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: C.ink3 }}>実際に手を動かす</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: C.ink }}>{term.learn.label}</div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: cat.c }}>→</span>
          </a>
        </div>
      </article>
    </div>
  );
}

export default function GlossaryView() {
  const [activeCat, setActiveCat] = useState<Cat | "all">("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const allMap = useMemo(() => Object.fromEntries(TERMS.map((t) => [t.id, t])) as Record<string, Term>, []);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: TERMS.length };
    (Object.keys(CATS) as Cat[]).forEach((k) => { c[k] = TERMS.filter((t) => t.cat === k).length; });
    return c;
  }, []);
  const filtered = useMemo(() => TERMS.filter((t) =>
    (activeCat === "all" || t.cat === activeCat) &&
    (q === "" || t.name.toLowerCase().includes(q.toLowerCase()) || t.short.includes(q) || t.long.includes(q))
  ), [activeCat, q]);
  const grouped = useMemo(() => {
    const g: Record<string, Term[]> = {};
    filtered.forEach((t) => { (g[t.cat] = g[t.cat] || []).push(t); });
    return g;
  }, [filtered]);

  // URL のハッシュで開く: /glossary#cve → CVE を展開してスクロール
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash && allMap[hash]) {
      setOpenId(hash);
      setTimeout(() => document.getElementById(`tile-${hash}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }, [allMap]);

  // ESC で閉じる
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenId(null); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const openTerm = openId ? allMap[openId] : null;

  return (
    <div className="gl-shell" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      {/* side index */}
      <nav className="gl-side" style={{ width: 180, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
        <div className="gl-side-label" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 10, letterSpacing: 1, padding: "0 10px" }}>CATEGORY</div>
        <div className="gl-side-inner" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button onClick={() => setActiveCat("all")}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, border: "none", background: activeCat === "all" ? C.soft : "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, color: activeCat === "all" ? C.ink : C.ink2, fontWeight: activeCat === "all" ? 600 : 400, transition: "all 0.15s" }}>
            <span>all</span><span style={{ color: C.ink3, fontSize: 10.5 }}>{counts.all}</span>
          </button>
          {(Object.keys(CATS) as Cat[]).map((k) => (
            <button key={k} onClick={() => setActiveCat(k)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, border: "none", background: activeCat === k ? C.soft : "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, color: activeCat === k ? CATS[k].c : C.ink2, fontWeight: activeCat === k ? 600 : 400, transition: "all 0.15s" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: 1.5, background: CATS[k].c }} />
                {CATS[k].name}
              </span>
              <span style={{ color: C.ink3, fontSize: 10.5 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="gl-side-label" style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginTop: 22, padding: "12px 10px 0", borderTop: `1px solid ${C.line}` }}>// クリックで詳細パネル</div>
      </nav>

      {/* main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="用語で検索（例: CVE, シェル, 0day）"
            style={{ flex: 1, minWidth: 200, fontFamily: "var(--font-mono)", fontSize: 12.5, padding: "9px 13px", borderRadius: 8, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{filtered.length} / {TERMS.length} 語</span>
        </div>

        {filtered.length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "60px 0", textAlign: "center", border: `1px dashed ${C.line2}`, borderRadius: 14 }}>// 該当する用語はありません</div>}

        {activeCat === "all" ? (
          (Object.keys(CATS) as Cat[]).map((k) => {
            const arr = grouped[k];
            if (!arr || arr.length === 0) return null;
            return (
              <div key={k} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 1.5, background: CATS[k].c }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink2, letterSpacing: 0.5 }}>{CATS[k].name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>{arr.length}</span>
                  <div style={{ flex: 1, height: 1, background: C.line }} />
                </div>
                <div className="gl-grid">{arr.map((t) => <Tile key={t.id} t={t} onOpen={setOpenId} active={openId === t.id} />)}</div>
              </div>
            );
          })
        ) : (
          <div className="gl-grid">{filtered.map((t) => <Tile key={t.id} t={t} onOpen={setOpenId} active={openId === t.id} />)}</div>
        )}
      </main>

      {mounted && openTerm && createPortal(
        <DetailModal term={openTerm} allMap={allMap} onClose={() => setOpenId(null)} onJump={(id) => setOpenId(id)} />,
        document.body
      )}
    </div>
  );
}
