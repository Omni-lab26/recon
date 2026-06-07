import { C } from "@/lib/tokens";

// ページ先頭の `// xxx` ピル + そのページの一行説明。
// 各ページの位置づけを冒頭で伝えるための共通部品。
export function PageLabel({ label, description, color, pulse }: { label: string; description?: string; color?: string; pulse?: boolean }) {
  const c = color ?? C.accent;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap", marginBottom: 24 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: c, background: `${c}10`, border: `1px solid ${c}2e`, padding: "5px 12px", borderRadius: 100, whiteSpace: "nowrap" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, animation: pulse ? "pulse 2s infinite" : undefined }} />// {label}
      </span>
      {description && (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.5 }}>
          {description}
        </span>
      )}
    </div>
  );
}
