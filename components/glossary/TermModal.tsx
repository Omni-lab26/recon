"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { TERMS, CATS, type Term } from "@/lib/glossary-data";
import { C } from "@/lib/tokens";

const allMap = Object.fromEntries(TERMS.map((t) => [t.id, t])) as Record<string, Term>;

export function TermModal({ termId, onClose }: { termId: string; onClose: () => void }) {
  const [currentId, setCurrentId] = useState(termId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;
  const term = allMap[currentId];
  if (!term) return null;
  const cat = CATS[term.cat];

  return createPortal(
    <div onClick={onClose} role="dialog" aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,10,15,0.42)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", animation: "modalBg 0.2s ease both" }}>
      <article onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 600, maxHeight: "calc(100vh - 40px)", overflowY: "auto", background: C.bg, borderRadius: 16, boxShadow: "0 30px 80px rgba(10,10,15,0.28)", animation: "modalIn 0.24s cubic-bezier(0.16,1,0.3,1) both" }}>
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
                    <button key={rid} onClick={() => setCurrentId(rid)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: rc.c, background: `${rc.c}0d`, border: `1px solid ${rc.c}33`, padding: "5px 11px", borderRadius: 7, cursor: "pointer" }}>
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
    </div>,
    document.body
  );
}
