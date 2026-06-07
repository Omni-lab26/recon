"use client";
import { useBookmarks } from "@/lib/use-bookmarks";
import { C } from "@/lib/tokens";

// 記事・CVE などに付けられる★ブックマークボタン。
export function BookmarkButton({ kind, id, label = "★" }: { kind: string; id: string; label?: string }) {
  const { isBookmarked, toggle, signedIn } = useBookmarks();
  const saved = isBookmarked(kind, id);
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(kind, id); }}
      title={saved ? "ブックマークを外す" : "ブックマークに追加"}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontSize: 12, padding: "5px 10px", borderRadius: 8, cursor: "pointer", border: `1px solid ${saved ? C.amber : C.line2}`, background: saved ? `${C.amber}12` : "transparent", color: saved ? C.amber : C.ink3, transition: "all 0.18s" }}>
      {label} {saved ? "保存済み" : "保存"}
      {signedIn === false && !saved && <span style={{ fontSize: 9, color: C.ink3, marginLeft: 2 }}>(ログインで記録)</span>}
    </button>
  );
}
