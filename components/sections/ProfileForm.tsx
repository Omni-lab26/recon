"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

const NAME_MAX = 40;
const BIO_MAX = 200;

export default function ProfileForm({ userId, email, initialName, initialBio }: { userId: string; email: string; initialName: string; initialBio: string }) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = name !== initialName || bio !== initialBio;
  const initial = (name || email)[0]?.toUpperCase() ?? "?";

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.from("profiles").upsert(
        { id: userId, display_name: name.trim() || null, bio: bio.trim() || null, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
      if (err) throw err;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />// profile
          </span>
        </Reveal>

        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
            <span style={{ width: 60, height: 60, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 600, flexShrink: 0 }}>{initial}</span>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 22, color: C.ink, letterSpacing: "-0.02em" }}>{name || "(名前未設定)"}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, marginTop: 2 }}>{email}</div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <form onSubmit={onSave} style={{ display: "flex", flexDirection: "column", gap: 18, padding: "24px 24px", borderRadius: 16, border: `1px solid ${C.line}`, background: C.bg }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5 }}>表示名</label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: name.length > NAME_MAX ? C.pink : C.ink3 }}>{name.length}/{NAME_MAX}</span>
              </div>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={NAME_MAX} placeholder="ハンドルネーム" style={{ fontFamily: "var(--font-sans)", fontSize: 14, padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <label style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5 }}>自己紹介</label>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: bio.length > BIO_MAX ? C.pink : C.ink3 }}>{bio.length}/{BIO_MAX}</span>
              </div>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={BIO_MAX} rows={4} placeholder="興味のある分野、目標など" style={{ fontFamily: "var(--font-sans)", fontSize: 14, padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none", resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {error && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.pink, padding: "8px 11px", borderRadius: 8, background: `${C.pink}0c`, border: `1px solid ${C.pink}33` }}>{error}</div>}

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button type="submit" disabled={saving || !dirty} style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "#fff", background: saving || !dirty ? C.ink3 : `linear-gradient(115deg, ${C.accent}, ${C.cyan})`, border: "none", borderRadius: 10, padding: "11px 24px", cursor: saving || !dirty ? "default" : "pointer", transition: "all 0.2s" }}>
                {saving ? "保存中..." : "保存する"}
              </button>
              {saved && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent }}>✓ 保存しました</span>}
            </div>
          </form>
        </Reveal>

        <Reveal>
          <div style={{ marginTop: 20, display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 12 }}>
            <Link href="/dashboard" style={{ color: C.blue, textDecoration: "none" }}>← ダッシュボード</Link>
            <Link href="/forgot-password" style={{ color: C.ink3, textDecoration: "none" }}>パスワードを変更</Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
