"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authStyles as S, PasswordInput } from "@/components/auth/AuthShell";
import { PASSWORD_RULES, validatePassword, translateAuthError } from "@/lib/password-policy";
import { C } from "@/lib/tokens";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const ruleStatus = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, ok: password ? r.test(password) : false })), [password]);
  const allPass = ruleStatus.every((r) => r.ok);
  const match = confirm.length > 0 && password === confirm;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validatePassword(password);
    if (v) { setError(v); return; }
    if (password !== confirm) { setError("確認用パスワードが一致しません"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (err) throw err;
      setDone(true);
    } catch (e: unknown) {
      setError(translateAuthError(e instanceof Error ? e.message : "登録に失敗しました"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell label="signup">
        <h1 style={{ ...S.h1, fontSize: 22 }}><span style={{ color: C.accent }}>✓</span> 確認メールを送りました</h1>
        <p style={{ ...S.intro, marginBottom: 18 }}>
          <span style={{ fontFamily: "var(--font-mono)", color: C.ink, background: C.soft, padding: "1px 7px", borderRadius: 5, border: `1px solid ${C.line}` }}>{email}</span><br />
          宛に確認メールを送りました。メール内のリンクを開けば本人確認が完了し、自動でログイン状態になります。
        </p>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, padding: "12px 14px", borderRadius: 10, background: C.soft, border: `1px solid ${C.line}`, lineHeight: 1.7 }}>
          // メールが届かない場合は迷惑メールフォルダも確認<br />
          // リンクは24時間有効
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell label="signup">
      <h1 style={S.h1}>新規登録</h1>
      <p style={S.intro}>メールアドレスとパスワードで登録。確認メールを受け取ったら本人確認完了です。</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={S.label}>EMAIL</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus style={S.input} autoComplete="email" />

        <label style={{ ...S.label, marginTop: 6 }}>PASSWORD</label>
        <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />

        {/* live rule check */}
        {password && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 12px", padding: "8px 11px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}` }}>
            {ruleStatus.map((r) => (
              <div key={r.label} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: r.ok ? C.accent : C.ink3, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{r.ok ? "✓" : "○"}</span>{r.label}
              </div>
            ))}
          </div>
        )}

        <label style={{ ...S.label, marginTop: 6 }}>PASSWORD (確認)</label>
        <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" hasError={!!confirm && !match} />
        {confirm && !match && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink }}>パスワードが一致しません</div>}

        {error && <div style={S.error}>{error}</div>}
        <button type="submit" disabled={loading || !email.trim() || !allPass || !match} style={S.primary(loading)}>
          {loading ? "登録中..." : "登録する"}
        </button>
      </form>

      <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11.5, textAlign: "center" }}>
        すでにアカウントを持っている? <Link href="/login" style={{ ...S.link, color: C.accent }}>ログイン →</Link>
      </div>
    </AuthShell>
  );
}
