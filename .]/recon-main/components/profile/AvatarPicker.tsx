"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AVATAR_PRESETS, parseAvatar } from "@/lib/avatar-presets";
import { Avatar } from "@/components/profile/Avatar";
import { C } from "@/lib/tokens";

const MAX_SIZE = 2 * 1024 * 1024;

export default function AvatarPicker({ userId, current, name, email, onChange }: { userId: string; current?: string | null; name?: string; email?: string; onChange: (next: string | null) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const parsed = parseAvatar(current);

  const persist = async (avatar_url: string | null) => {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert(
      { id: userId, avatar_url, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
    if (error) throw error;
    onChange(avatar_url);
  };

  const pickPreset = async (key: string) => {
    setMsg(null);
    try { await persist(`preset:${key}`); setMsg({ kind: "ok", text: "アイコンを変更しました" }); setTimeout(() => setMsg(null), 1800); }
    catch (e: unknown) { setMsg({ kind: "err", text: e instanceof Error ? e.message : "保存に失敗しました" }); }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(null);
    if (!file.type.startsWith("image/")) { setMsg({ kind: "err", text: "画像ファイルを選んでください" }); return; }
    if (file.size > MAX_SIZE) { setMsg({ kind: "err", text: "2MB以下のファイルを選んでください" }); return; }
    setUploading(true);
    try {
      const supabase = createClient();
      const path = `${userId}/avatar`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type, cacheControl: "0" });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await persist(url);
      setMsg({ kind: "ok", text: "画像をアップロードしました" });
      setTimeout(() => setMsg(null), 1800);
    } catch (e: unknown) {
      setMsg({ kind: "err", text: e instanceof Error ? e.message : "アップロードに失敗しました" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const reset = async () => {
    setMsg(null);
    try { await persist(null); setMsg({ kind: "ok", text: "デフォルトに戻しました" }); setTimeout(() => setMsg(null), 1800); }
    catch (e: unknown) { setMsg({ kind: "err", text: e instanceof Error ? e.message : "保存に失敗しました" }); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <Avatar avatarUrl={current} name={name} email={email} size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: C.ink }}>現在のアイコン</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, marginTop: 2 }}>
            {parsed.kind === "preset" ? `プリセット · ${parsed.preset.label}` : parsed.kind === "image" ? "アップロード画像" : "デフォルト(頭文字)"}
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5, marginBottom: 10 }}>プリセットから選ぶ</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
        {AVATAR_PRESETS.map((p) => {
          const isSel = current === `preset:${p.key}`;
          return (
            <button key={p.key} onClick={() => pickPreset(p.key)} disabled={uploading} title={p.label}
              style={{ padding: 4, borderRadius: 999, border: `2px solid ${isSel ? p.c1 : "transparent"}`, background: "transparent", cursor: "pointer", transition: "all 0.18s", transform: isSel ? "scale(1.04)" : "scale(1)" }}>
              <span style={{ display: "block", width: "100%", aspectRatio: "1 / 1", borderRadius: "50%", background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`, position: "relative" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50%", height: "50%" }}
                  dangerouslySetInnerHTML={{ __html: p.svg }} />
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5, marginBottom: 10 }}>または画像をアップロード</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onFile} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: uploading ? "default" : "pointer", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink }}>
          {uploading ? "アップロード中..." : "画像を選ぶ"}
        </button>
        {current && (
          <button onClick={reset} disabled={uploading}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "9px 14px", borderRadius: 9, cursor: uploading ? "default" : "pointer", border: `1px solid ${C.line}`, background: "transparent", color: C.ink3 }}>
            デフォルトに戻す
          </button>
        )}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>PNG / JPG / WebP / GIF · 2MBまで</span>
      </div>

      {msg && (
        <div style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11.5, color: msg.kind === "ok" ? C.accent : C.pink, padding: "8px 11px", borderRadius: 8, background: `${msg.kind === "ok" ? C.accent : C.pink}0c`, border: `1px solid ${msg.kind === "ok" ? C.accent : C.pink}33` }}>
          {msg.kind === "ok" ? "✓ " : ""}{msg.text}
        </div>
      )}
    </div>
  );
}
