"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Reveal } from "@/components/ui/motion";
import { PasswordInput, authStyles as S } from "@/components/auth/AuthShell";
import { PASSWORD_RULES, validatePassword, translateAuthError } from "@/lib/password-policy";
import { C } from "@/lib/tokens";

function Section({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "22px 24px", borderRadius: 14, border: `1px solid ${accent ? accent + "44" : C.line}`, background: C.bg, marginBottom: 16 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: accent ?? C.ink3, letterSpacing: 0.5, marginBottom: 14 }}>// {title}</div>
      {children}
    </div>
  );
}

function Status({ kind, msg }: { kind: "ok" | "err"; msg: string }) {
  const color = kind === "ok" ? C.accent : C.pink;
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color, padding: "8px 11px", borderRadius: 8, background: `${color}0c`, border: `1px solid ${color}33`, marginTop: 8 }}>{kind === "ok" ? "✓ " : ""}{msg}</div>;
}

export default function SettingsView({ email }: { email: string }) {
  const router = useRouter();

  // --- email change ---
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const onChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true); setEmailMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      setEmailMsg({ kind: "ok", msg: `${newEmail} に確認メールを送りました。新しいアドレスでリンクを開くと変更が完了します。` });
      setNewEmail("");
    } catch (e: unknown) {
      setEmailMsg({ kind: "err", msg: translateAuthError(e instanceof Error ? e.message : "変更に失敗しました") });
    } finally { setEmailLoading(false); }
  };

  // --- password change ---
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const ruleStatus = PASSWORD_RULES.map((r) => ({ ...r, ok: newPw ? r.test(newPw) : false }));
  const pwAllPass = ruleStatus.every((r) => r.ok);
  const pwMatch = confirmPw.length > 0 && newPw === confirmPw;

  const onChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true); setPwMsg(null);
    const v = validatePassword(newPw);
    if (v) { setPwMsg({ kind: "err", msg: v }); setPwLoading(false); return; }
    if (newPw !== confirmPw) { setPwMsg({ kind: "err", msg: "確認用パスワードが一致しません" }); setPwLoading(false); return; }
    try {
      const supabase = createClient();
      // 現在のパスワードで本人確認
      const { error: verifyErr } = await supabase.auth.signInWithPassword({ email, password: curPw });
      if (verifyErr) throw new Error("現在のパスワードが違います");
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwMsg({ kind: "ok", msg: "パスワードを更新しました。" });
      setCurPw(""); setNewPw(""); setConfirmPw("");
    } catch (e: unknown) {
      setPwMsg({ kind: "err", msg: translateAuthError(e instanceof Error ? e.message : "変更に失敗しました") });
    } finally { setPwLoading(false); }
  };

  // --- global sign out ---
  const [soLoading, setSoLoading] = useState(false);
  const onSignOutAll = async () => {
    if (!confirm("すべての端末からログアウトします。よろしいですか?")) return;
    setSoLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
      router.push("/login");
      router.refresh();
    } catch { setSoLoading(false); }
  };

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.cyan, background: `${C.cyan}10`, border: `1px solid ${C.cyan}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan }} />// settings
          </span>
        </Reveal>

        <Reveal>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 26, color: C.ink, letterSpacing: "-0.02em", marginBottom: 24 }}>アカウント設定</h1>
        </Reveal>

        {/* email */}
        <Reveal>
          <Section title="メールアドレス">
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: C.ink, padding: "10px 12px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}`, marginBottom: 14 }}>{email}</div>
            <form onSubmit={onChangeEmail} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={S.label}>新しいメールアドレス</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" required style={S.input} autoComplete="email" />
              <button type="submit" disabled={emailLoading || !newEmail.trim() || newEmail.trim() === email} style={{ ...S.primary(emailLoading), alignSelf: "flex-start", padding: "9px 18px" }}>
                {emailLoading ? "送信中..." : "確認メールを送る"}
              </button>
              {emailMsg && <Status kind={emailMsg.kind} msg={emailMsg.msg} />}
            </form>
          </Section>
        </Reveal>

        {/* password */}
        <Reveal>
          <Section title="パスワード">
            <form onSubmit={onChangePw} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={S.label}>現在のパスワード</label>
              <PasswordInput value={curPw} onChange={setCurPw} autoComplete="current-password" />

              <label style={{ ...S.label, marginTop: 8 }}>新しいパスワード</label>
              <PasswordInput value={newPw} onChange={setNewPw} autoComplete="new-password" />

              {newPw && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 12px", padding: "8px 11px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}` }}>
                  {ruleStatus.map((r) => (
                    <div key={r.label} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: r.ok ? C.accent : C.ink3, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{r.ok ? "✓" : "○"}</span>{r.label}
                    </div>
                  ))}
                </div>
              )}

              <label style={{ ...S.label, marginTop: 8 }}>新しいパスワード(確認)</label>
              <PasswordInput value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" hasError={!!confirmPw && !pwMatch} />
              {confirmPw && !pwMatch && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink }}>パスワードが一致しません</div>}

              <button type="submit" disabled={pwLoading || !curPw || !pwAllPass || !pwMatch} style={{ ...S.primary(pwLoading), alignSelf: "flex-start", padding: "9px 18px", marginTop: 6 }}>
                {pwLoading ? "更新中..." : "パスワードを更新"}
              </button>
              {pwMsg && <Status kind={pwMsg.kind} msg={pwMsg.msg} />}
            </form>
          </Section>
        </Reveal>

        {/* sessions */}
        <Reveal>
          <Section title="セッション">
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.6, marginBottom: 12 }}>
              他の端末やブラウザに残っているログイン状態をすべて切ります。共有PCを使った後や、不審なログインを疑うときに。
            </div>
            <button onClick={onSignOutAll} disabled={soLoading}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, padding: "9px 18px", borderRadius: 9, cursor: soLoading ? "default" : "pointer", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink }}>
              {soLoading ? "ログアウト中..." : "すべての端末からログアウト"}
            </button>
          </Section>
        </Reveal>

        {/* danger zone */}
        <Reveal>
          <Section title="危険な操作" accent={C.pink}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.6, marginBottom: 4 }}>
              アカウント削除は近日対応予定です。一旦削除するとお気に入り・プロフィールを含むすべてのデータが復元できないため、慎重に実装します。
            </div>
          </Section>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: 8, display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 12 }}>
            <Link href="/dashboard" style={{ color: C.blue, textDecoration: "none" }}>← ダッシュボード</Link>
            <Link href="/profile" style={{ color: C.ink3, textDecoration: "none" }}>プロフィールを編集</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
