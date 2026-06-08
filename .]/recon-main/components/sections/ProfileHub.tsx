"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { Avatar } from "@/components/profile/Avatar";
import SettingsDrawer from "@/components/profile/SettingsDrawer";
import { FIELDS } from "@/lib/roadmap-data";
import { ARTICLES } from "@/lib/articles-data";
import { computeStreak, roadmapByField, countByKind, recentActivity, relativeTime, ROADMAP_TOTAL, type ProgressRow } from "@/lib/progress";
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
  progress: ProgressRow[];
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

function StatTile({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 130, padding: "18px 18px", borderRadius: 14, border: `1px solid ${color}33`, background: `linear-gradient(135deg, ${color}0a, ${color}03)` }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: color, letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 28, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function LearningRecord({ progress }: { progress: ProgressRow[] }) {
  const stats = useMemo(() => {
    const streak = computeStreak(progress.map((r) => r.completed_at));
    const counts = countByKind(progress);
    const byField = roadmapByField(progress);
    const recent = recentActivity(progress, 5);
    return { streak, counts, byField, recent };
  }, [progress]);

  const overall = stats.counts.roadmap + stats.counts.article;
  const overallTotal = ROADMAP_TOTAL + ARTICLES.length;
  const overallPct = overallTotal === 0 ? 0 : (overall / overallTotal) * 100;

  if (progress.length === 0) {
    return (
      <div style={{ padding: "28px 22px", borderRadius: 14, border: `1px dashed ${C.line2}`, background: C.soft, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, marginBottom: 8 }}>まだ学習の記録がありません。</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink3, lineHeight: 1.7, marginBottom: 14 }}>
          ロードマップのステップや記事を「完了」とマークすると、ここに進捗・連続学習日数・最近の活動が積み上がります。
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/roadmap" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.accent, background: `${C.accent}10`, border: `1px solid ${C.accent}33`, padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>ロードマップを開く →</Link>
          <Link href="/articles" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.blue, background: `${C.blue}10`, border: `1px solid ${C.blue}33`, padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>学習記事を読む →</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* top stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <StatTile label="STREAK" value={<span>{stats.streak}<span style={{ fontSize: 14, color: C.ink3, marginLeft: 5 }}>日連続</span></span>} sub={stats.streak >= 1 ? "🔥 今日も学習" : "今日学んで再開"} color={stats.streak >= 1 ? C.amber : C.ink3} />
        <StatTile label="ロードマップ" value={<span>{stats.counts.roadmap}<span style={{ fontSize: 14, color: C.ink3, marginLeft: 5 }}>/ {ROADMAP_TOTAL}</span></span>} sub={`${Math.round((stats.counts.roadmap / ROADMAP_TOTAL) * 100)}% 達成`} color={C.accent} />
        <StatTile label="読了した記事" value={<span>{stats.counts.article}<span style={{ fontSize: 14, color: C.ink3, marginLeft: 5 }}>/ {ARTICLES.length}</span></span>} sub={ARTICLES.length === 0 ? "—" : `${Math.round((stats.counts.article / ARTICLES.length) * 100)}% 完了`} color={C.blue} />
      </div>

      {/* overall progress bar */}
      <div style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5 }}>// 全体の進捗</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink }}>{overall} / {overallTotal} <span style={{ color: C.ink3 }}>· {Math.round(overallPct)}%</span></span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.line, overflow: "hidden" }}>
          <div style={{ width: `${overallPct}%`, height: "100%", background: `linear-gradient(90deg, ${C.accent}, ${C.cyan}, ${C.blue})`, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* per-field bars */}
      <div style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg, marginBottom: 18 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5, marginBottom: 14 }}>// 分野別</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {FIELDS.map((f) => {
            const done = stats.byField[f.key] ?? 0;
            const total = f.steps.length;
            const pct = (done / total) * 100;
            return (
              <Link key={f.key} href={`/roadmap#${f.key}`}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, textDecoration: "none", transition: "background 0.18s" }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: `${f.c}14`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: f.c, flexShrink: 0 }}>{f.glyph}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12.5, color: C.ink }}>{f.name}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: f.c }}>{done}/{total}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: `${f.c}14`, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${f.c}, ${f.c}cc)`, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* recent activity */}
      <div style={{ padding: "18px 20px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink2, letterSpacing: 0.5, marginBottom: 12 }}>// 最近の活動</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {stats.recent.map((r) => (
            <Link key={`${r.kind}:${r.item_id}:${r.completed_at}`} href={r.href}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, textDecoration: "none", color: "inherit" }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: r.color, flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, flexShrink: 0 }}>{relativeTime(r.completed_at)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfileHub({ userId, email, createdAt, initialName, initialBio, initialAvatar, favTools, progress }: Props) {
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
          <LearningRecord progress={progress} />
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
