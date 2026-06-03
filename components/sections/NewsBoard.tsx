"use client";

import { useEffect, useMemo, useState } from "react";
import type { TickerItem } from "@/app/api/feed/route";
import { C } from "@/lib/tokens";

const SEV: Record<TickerItem["severity"], { c: string; t: string; jp: string }> = {
  critical: { c: C.pink, t: "CRITICAL", jp: "緊急" },
  high: { c: C.amber, t: "HIGH", jp: "高" },
  medium: { c: C.blue, t: "MEDIUM", jp: "中" },
  info: { c: C.ink3, t: "INFO", jp: "情報" },
};

const SLOTS: [string, string][] = [["06:00", "朝"], ["12:00", "昼"], ["18:00", "夜"]];

function relTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const days = Math.round((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "今日";
  if (days === 1) return "昨日";
  return `${days}日前`;
}
function fmtTime(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

function HeroStory({ n }: { n: TickerItem }) {
  const [h, setH] = useState(false);
  const s = SEV[n.severity];
  return (
    <a href={n.link || "#"} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", display: "block", borderRadius: 20, overflow: "hidden", border: `1px solid ${h ? s.c + "88" : s.c + "44"}`, background: `linear-gradient(135deg, ${s.c}0e, transparent 60%)`, padding: "28px 28px", textDecoration: "none", transition: "all 0.3s", boxShadow: h ? `0 18px 44px ${s.c}22` : "0 1px 2px rgba(10,10,15,0.03)" }}>
      <div aria-hidden style={{ position: "absolute", top: "-30%", right: "-8%", width: 360, height: 320, background: `radial-gradient(circle, ${s.c}22, transparent 65%)`, filter: "blur(45px)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff", background: s.c, padding: "3px 10px", borderRadius: 6, animation: n.severity === "critical" ? "pulse 1.6s infinite" : "none" }}>{s.t} · {s.jp}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>今日のトップ脅威</span>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 24, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 12 }}>{n.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink3, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>// 日本語要約は近日対応（AI生成予定）</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, borderTop: `1px solid ${C.line}`, paddingTop: 14 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: s.c }}>{n.source}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{relTime(n.date)} {fmtTime(n.date)} · 出典を読む ↗</span>
        </div>
      </div>
    </a>
  );
}

function MidCard({ n }: { n: TickerItem }) {
  const [h, setH] = useState(false);
  const s = SEV[n.severity];
  return (
    <a href={n.link || "#"} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", flexDirection: "column", padding: "18px 18px", borderRadius: 16, border: `1px solid ${h ? s.c + "66" : C.line}`, background: C.bg, textDecoration: "none", transition: "all 0.25s", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? `0 14px 32px ${s.c}20` : "0 1px 2px rgba(10,10,15,0.03)", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 700, color: "#fff", background: s.c, padding: "2px 8px", borderRadius: 5 }}>{s.t}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{n.source}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginLeft: "auto" }}>{relTime(n.date)} {fmtTime(n.date)}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15.5, color: C.ink, letterSpacing: "-0.01em", lineHeight: 1.45, marginBottom: 10 }}>{n.title}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: C.ink3, lineHeight: 1.55, flex: 1, fontStyle: "italic" }}>// 要約は近日対応</div>
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.line}`, display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: s.c, opacity: h ? 1 : 0.5, transition: "opacity 0.2s" }}>読む ↗</span>
      </div>
    </a>
  );
}

function CompactRow({ n }: { n: TickerItem }) {
  const [h, setH] = useState(false);
  const s = SEV[n.severity];
  return (
    <a href={n.link || "#"} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: h ? C.soft : "transparent", textDecoration: "none", transition: "all 0.15s" }}>
      <span style={{ flexShrink: 0, width: 6, height: 6, borderRadius: "50%", background: s.c }} />
      <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600, color: s.c, width: 50, textAlign: "center" }}>{s.t}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13.5, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</span>
      <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, whiteSpace: "nowrap" }}>{n.source}</span>
      <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, whiteSpace: "nowrap" }}>{relTime(n.date)}</span>
      <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: s.c, opacity: h ? 1 : 0.4 }}>↗</span>
    </a>
  );
}

type FeedRes = { ok: boolean; items: TickerItem[]; updatedAt?: string };

export default function NewsBoard() {
  const [data, setData] = useState<FeedRes | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d: FeedRes) => {
        if (!alive) return;
        if (d.ok && d.items?.length) setData(d);
        else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, []);

  const split = useMemo(() => {
    const all = data?.items ?? [];
    const items = q
      ? all.filter((n) => n.title.toLowerCase().includes(q.toLowerCase()) || n.source.toLowerCase().includes(q.toLowerCase()))
      : all;
    const counts = { critical: 0, high: 0, medium: 0, info: 0 };
    items.forEach((n) => { counts[n.severity]++; });
    const hero = items.find((n) => n.severity === "critical") || items[0];
    const highs = items.filter((n) => n !== hero && n.severity === "high");
    const mediums = items.filter((n) => n.severity === "medium");
    const infos = items.filter((n) => n.severity === "info");
    return { all, items, counts, hero, highs, mediums, infos };
  }, [data, q]);

  if (!data && !failed) {
    return <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "40px 0", textAlign: "center" }}>// 最新の脅威情報を取得中…</div>;
  }
  if (failed || !split.all.length) {
    return <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "40px 0", textAlign: "center" }}>// 最新情報を取得できませんでした（フィード元に接続できません）</div>;
  }

  const { all, items, counts, hero, highs, mediums, infos } = split;

  return (
    <>
      {/* search */}
      <div style={{ marginBottom: 16 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="見出し・出典でニュースを検索（例: CVE, ICS, Microsoft）"
          style={{ width: "100%", boxSizing: "border-box", fontFamily: "var(--font-mono)", fontSize: 13, padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none" }} />
        {q && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span>「{q}」で絞り込み中: {items.length} / {all.length} 件</span>
            <button onClick={() => setQ("")} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.blue, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>クリア</button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "60px 0", textAlign: "center", border: `1px dashed ${C.line2}`, borderRadius: 14 }}>
          // 「{q}」に該当するニュースはありません
        </div>
      ) : (
      <>
      {/* today's summary */}
      <div style={{ borderRadius: 16, border: `1px solid ${C.line}`, background: C.soft, padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: C.ink }}>今日のサマリー</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString("ja-JP") : ""}</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{data?.updatedAt ? `最終更新 ${fmtDate(data.updatedAt)}` : ""}</span>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(["critical", "high", "medium", "info"] as const).map((k) => (
            <div key={k} style={{ flex: "1 1 110px", display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: 12, background: C.bg, border: `1px solid ${C.line}` }}>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 26, color: SEV[k].c, lineHeight: 1 }}>{counts[k]}</span>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: SEV[k].c }}>{SEV[k].t}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: C.ink2 }}>{SEV[k].jp}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>更新:</span>
          {SLOTS.map(([time, label]) => (
            <span key={time} style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink2, background: C.bg, border: `1px solid ${C.line2}`, padding: "3px 9px", borderRadius: 7 }}>{label} {time}</span>
          ))}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginLeft: "auto" }}>出典: CISA 公式</span>
        </div>
      </div>

      {/* hero */}
      {hero && <div style={{ marginTop: 22 }}><HeroStory n={hero} /></div>}

      {/* HIGH */}
      {highs.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: C.amber, background: `${C.amber}10`, border: `1px solid ${C.amber}33`, padding: "3px 9px", borderRadius: 6 }}>// 注目（HIGH）</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2 }}>次に押さえておくべき脅威</span>
            <div style={{ flex: 1, height: 1, background: C.line, minWidth: 20 }} />
          </div>
          <div className="news-mid-grid">{highs.map((n, i) => <MidCard key={i} n={n} />)}</div>
        </div>
      )}

      {/* MEDIUM */}
      {mediums.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: C.blue, background: `${C.blue}10`, border: `1px solid ${C.blue}33`, padding: "3px 9px", borderRadius: 6 }}>// 製品脆弱性（MEDIUM）</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink3 }}>特定製品に関する報告</span>
            <div style={{ flex: 1, height: 1, background: C.line, minWidth: 20 }} />
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
            {mediums.map((n, i, a) => <div key={i} style={{ borderBottom: i === a.length - 1 ? "none" : `1px solid ${C.line}` }}><CompactRow n={n} /></div>)}
          </div>
        </div>
      )}

      {/* INFO */}
      {infos.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: C.ink3, background: C.soft, border: `1px solid ${C.line}`, padding: "3px 9px", borderRadius: 6 }}>// 参考情報（INFO）</span>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink3 }}>勧告・通知</span>
            <div style={{ flex: 1, height: 1, background: C.line, minWidth: 20 }} />
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
            {infos.map((n, i, a) => <div key={i} style={{ borderBottom: i === a.length - 1 ? "none" : `1px solid ${C.line}` }}><CompactRow n={n} /></div>)}
          </div>
        </div>
      )}

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, textAlign: "center", marginTop: 28 }}>
        // 1日3回(朝・昼・夜)更新 · 日本語要約はAIで近日対応 · 詳細は出典元(CISA公式)へ
      </div>
      </>
      )}
    </>
  );
}
