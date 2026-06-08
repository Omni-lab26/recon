"use client";

import { useState } from "react";
import { TERMS, CATS } from "@/lib/glossary-data";
import { TermModal } from "@/components/glossary/TermModal";

// 関連用語のチップ。クリックするとその場でモーダルが開く(glossaryページに遷移しない)。
export function TermChip({ termId }: { termId: string }) {
  const [open, setOpen] = useState(false);
  const term = TERMS.find((t) => t.id === termId);
  if (!term) return null;
  const c = CATS[term.cat].c;
  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: c, background: `${c}0d`, border: `1px solid ${c}33`, padding: "5px 11px", borderRadius: 7, cursor: "pointer" }}>
        {term.name} →
      </button>
      {open && <TermModal termId={termId} onClose={() => setOpen(false)} />}
    </>
  );
}
