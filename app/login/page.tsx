"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell, authStyles as S, PasswordInput } from "@/components/auth/AuthShell";
import { translateAuthError } from "@/lib/password-policy";
import { C } from "@/lib/tokens";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) throw err;
      router.push("/");
      router.refresh();
    } catch (e: unknown) {
      setError(translateAuthError(e instanceof Error ? e.message : "ログインに失敗しました"));
      setLoading(false);
    }
  };

  return (
    <AuthShell label="login">
      <h1 style={S.h1}>RECONに入る</h1>
      <p style={S.intro}>メールアドレスとパスワードでログイン。</p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={S.label}>EMAIL</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus style={S.input} autoComplete="email" />
        <label style={{ ...S.label, marginTop: 6 }}>PASSWORD</label>
        <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
        {error && <div style={S.error}>{error}</div>}
        <button type="submit" disabled={loading || !email.trim() || !password} style={S.primary(loading)}>
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
        <Link href="/signup" style={{ ...S.link, color: C.accent }}>新規登録 →</Link>
        <Link href="/forgot-password" style={S.link}>パスワードを忘れた</Link>
      </div>
    </AuthShell>
  );
}
