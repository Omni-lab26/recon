"use client";

import { useState, type ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

// すべての認証ページに共通の中央寄せカード枠。
export function AuthShell({ label, labelColor = C.accent, children }: { label: string; labelColor?: string; children: ReactNode }) {
  return (
    <main style={{ minHeight: "calc(100vh - 64px)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "30px 28px", borderRadius: 18, border: `1px solid ${C.line}`, background: C.bg, boxShadow: "0 1px 2px rgba(10,10,15,0.03)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: labelColor, background: `${labelColor}10`, border: `1px solid ${labelColor}2e`, padding: "4px 11px", borderRadius: 100, marginBottom: 20 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: labelColor }} />// {label}
            </div>
            {children}
          </div>
        </Reveal>
      </div>
    </main>
  );
}

// 共通スタイル
export const authStyles = {
  h1: { fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 26, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 10 } as React.CSSProperties,
  intro: { fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, lineHeight: 1.6, marginBottom: 22 } as React.CSSProperties,
  label: { fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5 } as React.CSSProperties,
  input: { fontFamily: "var(--font-mono)", fontSize: 14, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none", width: "100%", boxSizing: "border-box" as const },
  error: { fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.pink, padding: "8px 11px", borderRadius: 8, background: `${C.pink}0c`, border: `1px solid ${C.pink}33` } as React.CSSProperties,
  primary: (loading: boolean): React.CSSProperties => ({ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#fff", background: loading ? C.ink3 : `linear-gradient(115deg, ${C.accent}, ${C.cyan})`, border: "none", borderRadius: 10, padding: "12px 0", cursor: loading ? "default" : "pointer", marginTop: 6, transition: "all 0.2s" }),
  footnote: { fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.line}`, lineHeight: 1.8 } as React.CSSProperties,
  link: { color: C.blue, textDecoration: "none" } as React.CSSProperties,
};

// パスワード入力欄(表示/非表示トグル付き)
export function PasswordInput({
  value, onChange, placeholder = "••••••••", autoComplete = "current-password", autoFocus, hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  hasError?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        style={{ ...authStyles.input, paddingRight: 44, borderColor: hasError ? `${C.pink}88` : C.line2 }}
      />
      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "パスワードを隠す" : "パスワードを表示"} tabIndex={-1}
        style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", height: 32, width: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: show ? C.ink2 : C.ink3, padding: 0, borderRadius: 7, transition: "color 0.15s" }}>
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" y1="2" x2="22" y2="22" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
