"use client";

import { useProgress } from "@/lib/use-progress";
import { C } from "@/lib/tokens";

export default function MarkReadButton({ slug, color }: { slug: string; color: string }) {
  const { isDone, toggle, signedIn } = useProgress();
  const read = isDone("article", slug);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderRadius: 12, border: `1px solid ${read ? color : C.line}`, background: read ? `${color}0c` : C.bg, marginTop: 28, transition: "all 0.2s" }}>
      <button onClick={() => toggle("article", slug)}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, padding: "9px 16px", borderRadius: 9, cursor: "pointer", border: "none",
          background: read ? color : C.ink,
          color: "#fff", transition: "all 0.2s" }}>
        <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, lineHeight: 1 }}>
          {read ? "✓" : ""}
        </span>
        {read ? "読了済み" : "この記事を読了とマーク"}
      </button>
      {signedIn === false && (
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>
          <a href="/login" style={{ color: C.cyan, textDecoration: "none" }}>ログイン</a> すると記録が保存されます
        </span>
      )}
    </div>
  );
}
