"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authStyles as S } from "@/components/auth/AuthShell";
import { translateAuthError } from "@/lib/password-policy";
import { C } from "@/lib/tokens";

export default function ForgotPasswordPage() {
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
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
      });
      if (err) throw err;
      setDone(true);
    } catch (e: unknown) {
      setError(translateAuthError(e instanceof Error ? e.message : "送信に失敗しました"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell label="reset" description="リセット用リンクをメールで送る" labelColor={C.blue}>
        <h1 style={{ ...S.h1, fontSize: 22 }}><span style={{ color: C.accent }}>✓</span> リセットメールを送りました</h1>
        <p style={{ ...S.intro, marginBottom: 18 }}>
          <span style={{ fontFamily: "var(--font-mono)", color: C.ink, background: C.soft, padding: "1px 7px", borderRadius: 5, border: `1px solid ${C.line}` }}>{email}</span><br />
          宛にリンクを送りました。メール内のリンクを開くと、新しいパスワードを設定できます。
        </p>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, padding: "12px 14px", borderRadius: 10, background: C.soft, border: `1px solid ${C.line}`, lineHeight: 1.7 }}>
          // メールが届かない場合は迷惑メールフォルダも確認<br />
          // リンクは1時間有効
        </div>
        <div style={{ marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
          <Link href="/login" style={S.link}>← ログイン画面に戻る</Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell label="reset" description="リセット用リンクをメールで送る" labelColor={C.blue}>
      <h1 style={S.h1}>パスワードを再設定</h1>
      <p style={S.intro}>登録したメールアドレスを入れると、リセット用のリンクを送ります。</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={S.label}>EMAIL</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus style={S.input} autoComplete="email" />
        {error && <div style={S.error}>{error}</div>}
        <button type="submit" disabled={loading || !email.trim()} style={S.primary(loading)}>
          {loading ? "送信中..." : "リセットメールを送る"}
        </button>
      </form>

      <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11.5, textAlign: "center" }}>
        <Link href="/login" style={S.link}>← ログイン画面に戻る</Link>
      </div>
    </AuthShell>
  );
}
