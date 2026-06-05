"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { Avatar } from "@/components/profile/Avatar";
import SettingsDrawer from "@/components/profile/SettingsDrawer";
import { C } from "@/lib/tokens";

type FavTool = { id: string; name: string; cat: string; catName: string; c: string };

type Props = {
  userId: string;
  email: string;
  createdAt: string;
  initialName: string;
  initialBio: string;
  initialAvatar: string | null;
  favTools: FavTool[];
};

const QUICK = [
  { href: "/roadmap", label: "ロードマップ", mono: "roadmap", glyph: "</>", c: C.accent },
  { href: "/articles", label: "学習記事", mono: "articles", glyph: "#", c: C.blue },
  { href: "/ctf", label: "CTF問題集", mono: "ctf", glyph: "⚑", c: C.purple },
  { href: "/tools", label: "ツール集", mono: "tools", glyph: "$", c: C.cyan },
  { href: "/cve", label: "CVE DB", mono: "cve", glyph: "!", c: C.pink },
  { href: "/lab", label: "ラボ", mono: "lab", glyph: "▶", c: C.amber },
];

function QuickCard({ q }: { q: (typeof QUICK)[number] }) {
  const [h, setH] = useState(false);
  return (
    <Link href={q.href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 13, border: `1px solid ${h ? q.c + "55" : C.line}`, background: C.bg, textDecoration: "none", transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? `0 12px 28px ${q.c}1f` : "0 1px 2px rgba(10,10,15,0.03)" }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: `${q.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 16, color: q.c }}>{q.glyph}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>~/{q.mono}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: C.ink }}>{q.label}</div>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: q.c, opacity: h ? 1 : 0.4, transition: "opacity 0.2s" }}>→</span>
    </Link>
  );
}

function GearButton({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} aria-label="設定を開く"
      style={{ width: 38, height: 38, borderRadius: "50%", border: `1px solid ${h ? C.cyan + "66" : C.line2}`, background: h ? `${C.cyan}10` : C.bg, color: h ? C.cyan : C.ink2, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", transform: h ? "rotate(45deg)" : "rotate(0deg)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  );
}

export default function ProfileHub({ userId, email, createdAt, initialName, initialBio, initialAvatar, favTools }: Props) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const joined = createdAt ? new Date(createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) : "";
  const display = name || email.split("@")[0];

  const handleUpdated = ({ name: n, bio: b, avatar_url: a }: { name?: string; bio?: string; avatar_url?: string | null }) => {
    if (n !== undefined) setName(n);
    if (b !== undefined) setBio(b);
    if (a !== undefined) setAvatar(a);
  };

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      {/* 装飾的なヒーロー背景 */}
      <div aria-hidden style={{ position: "absolute", inset: "0 0 auto 0", height: 340, background: `radial-gradient(ellipse 800px 300px at 50% 0%, ${C.accent}10, transparent 70%), radial-gradient(ellipse 600px 240px at 80% 0%, ${C.cyan}0d, transparent 70%)`, pointerEvents: "none" }} />

      <section style={{ position: "relative", maxWidth: 1000, margin: "0 auto", padding: "56px 24px 100px" }}>
        {/* hero */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 40, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <Avatar avatarUrl={avatar} name={name} email={email} size={104} />
              {/* かすかなリング */}
              <span aria-hidden style={{ position: "absolute", inset: -6, borderRadius: "50%", border: `1px dashed ${C.line2}`, pointerEvents: "none" }} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 32, color: C.ink, letterSpacing: "-0.025em", lineHeight: 1.15, margin: 0 }}>{display}</h1>
                <GearButton onClick={() => setDrawerOpen(true)} />
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: C.ink2, marginTop: 6 }}>
                {email}{joined && <span style={{ color: C.ink3 }}> · {joined} から</span>}
              </div>
              {bio && <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, marginTop: 10, lineHeight: 1.65, maxWidth: 520 }}>{bio}</div>}
              {!bio && !name && (
                <button onClick={() => setDrawerOpen(true)} style={{ marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.cyan, background: "transparent", border: `1px dashed ${C.cyan}55`, padding: "5px 11px", borderRadius: 7, cursor: "pointer" }}>
                  + プロフィールを設定する
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* quick access */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5 }}>// クイックアクセス</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 44 }}>
            {QUICK.map((q) => <QuickCard key={q.href} q={q} />)}
          </div>
        </Reveal>

        {/* favorites */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.amber, letterSpacing: 0.5 }}>★ お気に入りツール</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{favTools.length}</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
            <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.cyan, textDecoration: "none" }}>すべて見る →</Link>
          </div>
          {favTools.length > 0 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 44 }}>
              {favTools.map((t) => (
                <Link key={t.id} href="/tools" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 13px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.bg, textDecoration: "none" }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: t.c }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, color: C.ink }}>{t.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3 }}>{t.catName}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: "28px 20px", borderRadius: 14, border: `1px dashed ${C.line2}`, background: C.soft, textAlign: "center", marginBottom: 44 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, marginBottom: 10 }}>まだお気に入りがありません。</div>
              <Link href="/tools" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.cyan, textDecoration: "none" }}>ツール集で ★ を付ける →</Link>
            </div>
          )}
        </Reveal>

        {/* learning record */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5 }}>// 学習の記録</span>
            <div style={{ flex: 1, height: 1, background: C.line }} />
          </div>
          <div style={{ padding: "24px 22px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.soft }}>
            <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 6 }}>進捗・ストリークは近日対応</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>
              ロードマップの達成状況、連続学習日数(ストリーク)、解いたCTFの記録などをここに表示する予定です。まずはクイックアクセスから学習を進めましょう。
            </div>
          </div>
        </Reveal>
      </section>

      <SettingsDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        userId={userId} email={email}
        initialName={name} initialBio={bio} initialAvatar={avatar}
        onProfileUpdated={handleUpdated}
      />
    </main>
  );
}
