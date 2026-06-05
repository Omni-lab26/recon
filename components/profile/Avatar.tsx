"use client";

import { parseAvatar, type AvatarPreset } from "@/lib/avatar-presets";
import { C } from "@/lib/tokens";

function PresetCircle({ preset, size }: { preset: AvatarPreset; size: number }) {
  const iconSize = Math.round(size * 0.5);
  return (
    <span aria-hidden style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${preset.c1}, ${preset.c2})`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 6px 22px ${preset.c1}33` }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: preset.svg }} />
    </span>
  );
}

function InitialCircle({ ch, size }: { ch: string; size: number }) {
  return (
    <span aria-hidden style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.cyan})`, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: Math.round(size * 0.42), fontWeight: 600, flexShrink: 0, boxShadow: `0 6px 22px ${C.accent}33` }}>{ch}</span>
  );
}

function ImageCircle({ url, size }: { url: string; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="avatar" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, boxShadow: "0 6px 22px rgba(10,10,15,0.18)" }} />
  );
}

export function Avatar({ avatarUrl, name, email, size = 60 }: { avatarUrl?: string | null; name?: string; email?: string; size?: number }) {
  const initial = (name || email || "?")[0]?.toUpperCase() ?? "?";
  const k = parseAvatar(avatarUrl);
  if (k.kind === "preset") return <PresetCircle preset={k.preset} size={size} />;
  if (k.kind === "image") return <ImageCircle url={k.url} size={size} />;
  return <InitialCircle ch={initial} size={size} />;
}
