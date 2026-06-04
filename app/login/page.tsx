"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (err) throw err;
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "calc(100vh - 64px)", padding: "60px 24px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <Reveal>
          <div style={{ padding: "30px 28px", borderRadius: 18, border: `1px solid ${C.line}`, background: C.bg, boxShadow: "0 1px 2px rgba(10,10,15,0.03)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}2e`, padding: "4px 11px", borderRadius: 100, marginBottom: 20 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent }} />// login
          </div>

          {!done ? (
            <>
              <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 26, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 10 }}>RECONに入る</h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, lineHeight: 1.6, marginBottom: 22 }}>
                メールアドレスを入れると、ログイン用のリンクが届きます。リンクを開けば認証完了。パスワード不要。
              </p>

              <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5 }}>EMAIL</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus
                  style={{ fontFamily: "var(--font-mono)", fontSize: 14, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none" }} />
                {error && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.pink, padding: "8px 11px", borderRadius: 8, background: `${C.pink}0c`, border: `1px solid ${C.pink}33` }}>{error}</div>}
                <button type="submit" disabled={loading || !email.trim()}
                  style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#fff", background: loading ? C.ink3 : `linear-gradient(115deg, ${C.accent}, ${C.cyan})`, border: "none", borderRadius: 10, padding: "12px 0", cursor: loading ? "default" : "pointer", marginTop: 6, transition: "all 0.2s" }}>
                  {loading ? "送信中..." : "ログインリンクを送る"}
                </button>
              </form>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginTop: 22, paddingTop: 16, borderTop: `1px solid ${C.line}`, lineHeight: 1.7 }}>
                // 初めての場合も自動でアカウント作成<br />
                // パスワード管理不要・OAuth(GitHub/Google)は後日対応
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 22, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>
                <span style={{ color: C.accent }}>✓</span> メールを送りました
              </h1>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, lineHeight: 1.7, marginBottom: 18 }}>
                <span style={{ fontFamily: "var(--font-mono)", color: C.ink, background: C.soft, padding: "1px 7px", borderRadius: 5, border: `1px solid ${C.line}` }}>{email}</span><br />
                宛にログイン用のリンクを送りました。メールを開いてリンクをクリックすれば認証完了です。
              </p>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, padding: "12px 14px", borderRadius: 10, background: C.soft, border: `1px solid ${C.line}`, lineHeight: 1.7 }}>
                // メールが届かない場合は迷惑メールフォルダも確認<br />
                // リンクは1時間有効
              </div>
              <button onClick={() => { setDone(false); setEmail(""); }}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, background: "transparent", border: "none", marginTop: 16, cursor: "pointer", padding: 0 }}>
                ← 別のメールアドレスで送り直す
              </button>
            </>
          )}
        </div>
      </Reveal>
      </div>
    </main>
  );
}
