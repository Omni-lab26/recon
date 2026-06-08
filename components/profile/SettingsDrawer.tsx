"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput, authStyles as S } from "@/components/auth/AuthShell";
import { PASSWORD_RULES, validatePassword, translateAuthError } from "@/lib/password-policy";
import AvatarPicker from "@/components/profile/AvatarPicker";
import { C } from "@/lib/tokens";

type TabKey = "avatar" | "profile" | "email" | "password" | "session" | "danger";

const TABS: { key: TabKey; label: string }[] = [
  { key: "avatar", label: "アイコン" },
  { key: "profile", label: "プロフィール" },
  { key: "email", label: "メール" },
  { key: "password", label: "パスワード" },
  { key: "session", label: "セッション" },
  { key: "danger", label: "危険" },
];

const NAME_MAX = 40;
const BIO_MAX = 200;

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  email: string;
  initialName: string;
  initialBio: string;
  initialAvatar: string | null;
  onProfileUpdated: (next: { name?: string; bio?: string; avatar_url?: string | null }) => void;
};

function Status({ kind, msg }: { kind: "ok" | "err"; msg: string }) {
  const color = kind === "ok" ? C.accent : C.pink;
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color, padding: "8px 11px", borderRadius: 8, background: `${color}0c`, border: `1px solid ${color}33`, marginTop: 10 }}>{kind === "ok" ? "✓ " : ""}{msg}</div>;
}

function DangerZone({ email, onDeleted }: { email: string; onDeleted: () => void }) {
  const [step, setStep] = useState<"idle" | "confirm" | "typing" | "deleting">("idle");
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);

  const doDelete = async () => {
    if (typed !== "DELETE") return;
    setStep("deleting");
    setError(null);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onDeleted();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "削除に失敗しました");
      setStep("typing");
    }
  };

  return (
    <div>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.pink, margin: "0 0 12px" }}>危険な操作</h3>

      {step === "idle" && (
        <>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.7, margin: "0 0 16px" }}>
            アカウントを削除すると、お気に入り・プロフィール・学習記録・ブックマークなどすべてのデータが<strong style={{ color: C.ink }}>完全に削除</strong>され、復元できません。
          </p>
          <button onClick={() => setStep("confirm")}
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, padding: "9px 18px", borderRadius: 9, cursor: "pointer", border: `1px solid ${C.pink}66`, background: `${C.pink}0c`, color: C.pink }}>
            アカウントを削除する
          </button>
        </>
      )}

      {step === "confirm" && (
        <div style={{ padding: "18px 18px", borderRadius: 12, border: `1px solid ${C.pink}44`, background: `${C.pink}08` }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink, lineHeight: 1.7, margin: "0 0 14px" }}>
            本当に削除しますか? <strong>{email}</strong> に関連するすべてのデータが消去されます。
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("typing")}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", border: "none", background: C.pink, color: "#fff" }}>
              続ける
            </button>
            <button onClick={() => setStep("idle")}
              style={{ fontFamily: "var(--font-sans)", fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink2 }}>
              キャンセル
            </button>
          </div>
        </div>
      )}

      {(step === "typing" || step === "deleting") && (
        <div style={{ padding: "18px 18px", borderRadius: 12, border: `1px solid ${C.pink}44`, background: `${C.pink}08` }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: C.ink, marginBottom: 10, lineHeight: 1.6 }}>
            削除を確認するために <strong>DELETE</strong> と入力してください。
          </p>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="DELETE"
            disabled={step === "deleting"}
            style={{ ...S.input, marginBottom: 12, borderColor: typed === "DELETE" ? C.pink : C.line2, fontFamily: "var(--font-mono)" }} />
          {error && <div style={S.error}>{error}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={doDelete} disabled={typed !== "DELETE" || step === "deleting"}
              style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: typed === "DELETE" ? "pointer" : "default", border: "none", background: typed === "DELETE" ? C.pink : C.ink3, color: "#fff", transition: "background 0.2s" }}>
              {step === "deleting" ? "削除中..." : "完全に削除する"}
            </button>
            <button onClick={() => { setStep("idle"); setTyped(""); setError(null); }}
              disabled={step === "deleting"}
              style={{ fontFamily: "var(--font-sans)", fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink2 }}>
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsDrawer({ open, onClose, userId, email, initialName, initialBio, initialAvatar, onProfileUpdated }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<TabKey>("avatar");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  // --- profile (name + bio) ---
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [pSaving, setPSaving] = useState(false);
  const [pMsg, setPMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const pDirty = name !== initialName || bio !== initialBio;

  // 親側のprop更新を反映
  useEffect(() => { setName(initialName); }, [initialName]);
  useEffect(() => { setBio(initialBio); }, [initialBio]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setPSaving(true); setPMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").upsert(
        { id: userId, display_name: name.trim() || null, bio: bio.trim() || null, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      if (error) throw error;
      onProfileUpdated({ name: name.trim(), bio: bio.trim() });
      setPMsg({ kind: "ok", msg: "保存しました" });
      setTimeout(() => setPMsg(null), 1800);
    } catch (e: unknown) {
      setPMsg({ kind: "err", msg: e instanceof Error ? e.message : "保存に失敗しました" });
    } finally { setPSaving(false); }
  };

  // --- email ---
  const [newEmail, setNewEmail] = useState("");
  const [eLoading, setELoading] = useState(false);
  const [eMsg, setEMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const changeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setELoading(true); setEMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      setEMsg({ kind: "ok", msg: `${newEmail} に確認メールを送りました。新アドレスでリンクを開くと変更が完了します。` });
      setNewEmail("");
    } catch (e: unknown) {
      setEMsg({ kind: "err", msg: translateAuthError(e instanceof Error ? e.message : "変更に失敗しました") });
    } finally { setELoading(false); }
  };

  // --- password ---
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const ruleStatus = useMemo(() => PASSWORD_RULES.map((r) => ({ ...r, ok: newPw ? r.test(newPw) : false })), [newPw]);
  const pwAllPass = ruleStatus.every((r) => r.ok);
  const pwMatch = confirmPw.length > 0 && newPw === confirmPw;
  const changePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwLoading(true); setPwMsg(null);
    const v = validatePassword(newPw);
    if (v) { setPwMsg({ kind: "err", msg: v }); setPwLoading(false); return; }
    if (newPw !== confirmPw) { setPwMsg({ kind: "err", msg: "確認用パスワードが一致しません" }); setPwLoading(false); return; }
    try {
      const supabase = createClient();
      const { error: verify } = await supabase.auth.signInWithPassword({ email, password: curPw });
      if (verify) throw new Error("現在のパスワードが違います");
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwMsg({ kind: "ok", msg: "パスワードを更新しました" });
      setCurPw(""); setNewPw(""); setConfirmPw("");
    } catch (e: unknown) {
      setPwMsg({ kind: "err", msg: translateAuthError(e instanceof Error ? e.message : "変更に失敗しました") });
    } finally { setPwLoading(false); }
  };

  // --- sessions ---
  const [soLoading, setSoLoading] = useState(false);
  const signOutAll = async () => {
    if (!confirm("すべての端末からログアウトします。よろしいですか?")) return;
    setSoLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: "global" });
      router.push("/login"); router.refresh();
    } catch { setSoLoading(false); }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* backdrop */}
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(10,10,15,0.42)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.25s ease" }} />

      {/* drawer */}
      <aside role="dialog" aria-modal="true" aria-label="設定"
        style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "min(520px, 100vw)", background: C.bg, zIndex: 1000, boxShadow: "-30px 0 80px rgba(10,10,15,0.18)", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)", display: "flex", flexDirection: "column" }}>
        {/* header */}
        <div style={{ flexShrink: 0, padding: "18px 22px 0", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 11, color: C.cyan, background: `${C.cyan}10`, border: `1px solid ${C.cyan}2e`, padding: "4px 11px", borderRadius: 100 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.cyan }} />// settings
            </div>
            <button onClick={onClose} aria-label="閉じる"
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: C.ink3, lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
          {/* tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto", marginBottom: -1 }}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "10px 14px", border: "none", borderBottom: `2px solid ${active ? (t.key === "danger" ? C.pink : C.cyan) : "transparent"}`, background: "transparent", color: active ? (t.key === "danger" ? C.pink : C.ink) : C.ink3, cursor: "pointer", transition: "all 0.15s" }}>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 22px 40px" }}>
          {tab === "avatar" && (
            <div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, margin: "0 0 14px" }}>アイコン</h3>
              <AvatarPicker userId={userId} current={initialAvatar} name={initialName} email={email} onChange={(url) => onProfileUpdated({ avatar_url: url })} />
            </div>
          )}

          {tab === "profile" && (
            <form onSubmit={saveProfile}>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, margin: "0 0 14px" }}>プロフィール</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <label style={S.label}>表示名</label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: name.length > NAME_MAX ? C.pink : C.ink3 }}>{name.length}/{NAME_MAX}</span>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={NAME_MAX} placeholder="ハンドルネーム" style={{ ...S.input, marginBottom: 14 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <label style={S.label}>自己紹介</label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: bio.length > BIO_MAX ? C.pink : C.ink3 }}>{bio.length}/{BIO_MAX}</span>
              </div>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={BIO_MAX} rows={4} placeholder="興味のある分野、目標など" style={{ ...S.input, resize: "vertical", lineHeight: 1.6 }} />
              <button type="submit" disabled={pSaving || !pDirty} style={{ ...S.primary(pSaving), alignSelf: "flex-start", padding: "9px 18px", marginTop: 14 }}>{pSaving ? "保存中..." : "保存する"}</button>
              {pMsg && <Status kind={pMsg.kind} msg={pMsg.msg} />}
            </form>
          )}

          {tab === "email" && (
            <div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, margin: "0 0 14px" }}>メールアドレス</h3>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: C.ink, padding: "10px 12px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}`, marginBottom: 14 }}>{email}</div>
              <form onSubmit={changeEmail}>
                <label style={S.label}>新しいメールアドレス</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" required style={{ ...S.input, marginTop: 6 }} autoComplete="email" />
                <button type="submit" disabled={eLoading || !newEmail.trim() || newEmail.trim() === email} style={{ ...S.primary(eLoading), padding: "9px 18px", marginTop: 14 }}>{eLoading ? "送信中..." : "確認メールを送る"}</button>
                {eMsg && <Status kind={eMsg.kind} msg={eMsg.msg} />}
              </form>
            </div>
          )}

          {tab === "password" && (
            <form onSubmit={changePw}>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, margin: "0 0 14px" }}>パスワード</h3>
              <label style={S.label}>現在のパスワード</label>
              <div style={{ marginTop: 6 }}><PasswordInput value={curPw} onChange={setCurPw} autoComplete="current-password" /></div>
              <label style={{ ...S.label, display: "block", marginTop: 12 }}>新しいパスワード</label>
              <div style={{ marginTop: 6 }}><PasswordInput value={newPw} onChange={setNewPw} autoComplete="new-password" /></div>
              {newPw && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px 12px", padding: "8px 11px", borderRadius: 8, background: C.soft, border: `1px solid ${C.line}`, marginTop: 10 }}>
                  {ruleStatus.map((r) => (
                    <div key={r.label} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: r.ok ? C.accent : C.ink3, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>{r.ok ? "✓" : "○"}</span>{r.label}
                    </div>
                  ))}
                </div>
              )}
              <label style={{ ...S.label, display: "block", marginTop: 12 }}>新しいパスワード(確認)</label>
              <div style={{ marginTop: 6 }}><PasswordInput value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" hasError={!!confirmPw && !pwMatch} /></div>
              {confirmPw && !pwMatch && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.pink, marginTop: 4 }}>パスワードが一致しません</div>}
              <button type="submit" disabled={pwLoading || !curPw || !pwAllPass || !pwMatch} style={{ ...S.primary(pwLoading), padding: "9px 18px", marginTop: 16 }}>{pwLoading ? "更新中..." : "パスワードを更新"}</button>
              {pwMsg && <Status kind={pwMsg.kind} msg={pwMsg.msg} />}
            </form>
          )}

          {tab === "session" && (
            <div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: C.ink, margin: "0 0 10px" }}>セッション</h3>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.7, margin: "0 0 14px" }}>他の端末やブラウザに残っているログイン状態をすべて切ります。共有PCを使った後や、不審なログインを疑うときに。</p>
              <button onClick={signOutAll} disabled={soLoading}
                style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, padding: "9px 18px", borderRadius: 9, cursor: soLoading ? "default" : "pointer", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink }}>
                {soLoading ? "ログアウト中..." : "すべての端末からログアウト"}
              </button>
            </div>
          )}

          {tab === "danger" && (
            <DangerZone email={email} onDeleted={() => { router.push("/"); router.refresh(); }} />
          )}
        </div>
      </aside>
    </>,
    document.body
  );
}
