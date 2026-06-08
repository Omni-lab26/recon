"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authStyles as S, PasswordInput } from "@/components/auth/AuthShell";
import { PASSWORD_RULES, validatePassword, translateAuthError } from "@/lib/password-policy";
import { C } from "@/lib/tokens";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // セッション(リカバリ)が確立しているか確認
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
  }, []);

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
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      router.push("/");
      router.refresh();
    } catch (e: unknown) {
      setError(translateAuthError(e instanceof Error ? e.message : "パスワード更新に失敗しました"));
      setLoading(false);
    }
  };

  if (!ready) {
    return <AuthShell label="reset" description="新しいパスワードを設定する" labelColor={C.blue}><div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, padding: "20px 0", textAlign: "center" }}>// 確認中...</div></AuthShell>;
  }

  if (!hasSession) {
    return (
      <AuthShell label="reset" description="新しいパスワードを設定する" labelColor={C.blue}>
        <h1 style={{ ...S.h1, fontSize: 22 }}>リンクが無効です</h1>
        <p style={S.intro}>このページはパスワードリセットメールのリンクから開く必要があります。リンクの有効期限が切れているか、すでに使用済みかもしれません。</p>
        <a href="/forgot-password" style={{ ...S.link, color: C.blue, fontFamily: "var(--font-mono)", fontSize: 12.5 }}>もう一度リセットメールを送る →</a>
      </AuthShell>
    );
  }

  return (
    <AuthShell label="reset" description="新しいパスワードを設定する" labelColor={C.blue}>
      <h1 style={S.h1}>新しいパスワード</h1>
      <p style={S.intro}>新しいパスワードを設定してください。</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={S.label}>NEW PASSWORD</label>
        <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" autoFocus />

        {password && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 12px", padding: "8px 11px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}` }}>
            {ruleStatus.map((r) => (
              <div key={r.label} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: r.ok ? C.accent : C.ink3, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{r.ok ? "✓" : "○"}</span>{r.label}
              </div>
            ))}
          </div>
        )}

        <label style={{ ...S.label, marginTop: 6 }}>NEW PASSWORD (確認)</label>
        <PasswordInput value={confirm} onChange={setConfirm} autoComplete="new-password" hasError={!!confirm && !match} />
        {confirm && !match && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink }}>パスワードが一致しません</div>}

        {error && <div style={S.error}>{error}</div>}
        <button type="submit" disabled={loading || !allPass || !match} style={S.primary(loading)}>
          {loading ? "更新中..." : "パスワードを更新"}
        </button>
      </form>
    </AuthShell>
  );
}
