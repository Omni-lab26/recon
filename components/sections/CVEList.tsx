"use client";

import { useEffect, useMemo, useState } from "react";
import type { CveItem, CveSeverity } from "@/app/api/cve/route";
import { C } from "@/lib/tokens";

const SEV: Record<Exclude<CveSeverity, "none">, { c: string; t: string; jp: string; range: string }> = {
  critical: { c: C.pink, t: "CRITICAL", jp: "緊急", range: "9.0-10.0" },
  high: { c: C.amber, t: "HIGH", jp: "高", range: "7.0-8.9" },
  medium: { c: C.blue, t: "MEDIUM", jp: "中", range: "4.0-6.9" },
  low: { c: C.ink3, t: "LOW", jp: "低", range: "0.1-3.9" },
};

function SevBadge({ s, size = 9 }: { s: CveSeverity; size?: number }) {
  if (s === "none") return null;
  const sv = SEV[s];
  return <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: size, fontWeight: 600, color: "#fff", background: sv.c, padding: "2px 8px", borderRadius: 5 }}>{sv.t}</span>;
}
function CVSSBadge({ score, s }: { score: number | null; s: CveSeverity }) {
  if (score == null) return <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>—</span>;
  const c = s === "none" ? C.ink3 : SEV[s].c;
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: c, background: `${c}14`, border: `1px solid ${c}44`, padding: "2px 7px", borderRadius: 5 }}>{score.toFixed(1)}</span>;
}
function KevBadge({ small }: { small?: boolean }) {
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: small ? 8.5 : 9, fontWeight: 700, color: "#fff", background: C.pink, padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", animation: small ? "none" : "pulse 2s infinite" }}>{small ? "KEV" : "⚠ KEV"}</span>;
}
function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function CveCard({ c }: { c: CveItem }) {
  const [h, setH] = useState(false);
  const sv = c.severity === "none" ? null : SEV[c.severity];
  const edge = sv?.c ?? C.ink3;
  return (
    <a href={`https://nvd.nist.gov/vuln/detail/${c.id}`} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", display: "block", padding: "16px 16px 14px", borderRadius: 14, border: `1px solid ${h ? edge + "66" : C.line}`, background: C.bg, textDecoration: "none", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? `0 14px 32px ${edge}1f` : "0 1px 2px rgba(10,10,15,0.03)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 }}>
        <CVSSBadge score={c.cvss} s={c.severity} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {c.kev && <KevBadge />}
          <SevBadge s={c.severity} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 8, letterSpacing: "-0.01em" }}>{c.id}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: C.ink2, lineHeight: 1.55, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.summary || "（概要なし）"}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `1px solid ${C.line}` }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: edge }}>{c.vendor}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{fmtDate(c.date)}</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.product}</div>
    </a>
  );
}

const stickyId: React.CSSProperties = { position: "sticky", left: 0, zIndex: 2, background: C.bg };

type FeedRes = { ok: boolean; items: CveItem[]; updatedAt?: string };

export default function CVEList() {
  const [data, setData] = useState<FeedRes | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<"table" | "grid">("table");
  const [sev, setSev] = useState<CveSeverity | "all">("all");
  const [vendor, setVendor] = useState<string>("all");
  const [q, setQ] = useState("");
  const [kevOnly, setKevOnly] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/cve")
      .then((r) => r.json())
      .then((d: FeedRes) => {
        if (!alive) return;
        if (d.ok && d.items?.length) setData(d);
        else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, []);

  const vendors = useMemo(() => {
    if (!data) return ["all"];
    const set = new Set<string>();
    data.items.forEach((c) => { if (c.vendor && c.vendor !== "—") set.add(c.vendor); });
    return ["all", ...Array.from(set).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.items.filter((c) =>
      (sev === "all" || c.severity === sev) &&
      (vendor === "all" || c.vendor === vendor) &&
      (!kevOnly || c.kev) &&
      (q === "" || c.id.toLowerCase().includes(q.toLowerCase()) || c.summary.toLowerCase().includes(q.toLowerCase()) || c.product.toLowerCase().includes(q.toLowerCase()))
    );
  }, [data, sev, vendor, q, kevOnly]);

  const grouped = useMemo(() => {
    const g: Record<string, CveItem[]> = { critical: [], high: [], medium: [], low: [], none: [] };
    filtered.forEach((c) => g[c.severity].push(c));
    return g;
  }, [filtered]);

  const pill = (active: boolean, c: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 12, padding: "7px 13px", borderRadius: 9, cursor: "pointer", border: `1px solid ${active ? c : C.line2}`,
    background: active ? c : C.bg, color: active ? "#fff" : C.ink2, transition: "all 0.2s", fontWeight: active ? 600 : 400, whiteSpace: "nowrap",
  });

  if (!data && !failed) {
    return <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "40px 0", textAlign: "center" }}>// 最新のCVE情報を取得中…（NVD 公式から）</div>;
  }
  if (failed) {
    return <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "40px 0", textAlign: "center" }}>// CVE情報を取得できませんでした（NVDに接続できないか、レート制限の可能性）</div>;
  }

  return (
    <div>
      {/* legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, marginBottom: 14 }}>
        <span>CVSS:</span>
        {(Object.keys(SEV) as Array<keyof typeof SEV>).map((k) => (
          <span key={k} style={{ color: SEV[k].c, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: SEV[k].c }} />{SEV[k].t} ({SEV[k].range})
          </span>
        ))}
        <span style={{ marginLeft: "auto" }}>出典: NVD（NIST公式）{data?.updatedAt && ` · 最終更新 ${new Date(data.updatedAt).toLocaleString("ja-JP", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}`}</span>
      </div>

      {/* controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: 14, border: `1px solid ${C.line}`, background: C.soft }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="CVE ID・製品名・キーワードで検索（例: CVE-2026, Apache, RCE）"
          style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.line2}`, background: C.bg, color: C.ink, outline: "none" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, width: 56 }}>深刻度</span>
          <button style={pill(sev === "all", C.ink)} onClick={() => setSev("all")}>all</button>
          {(Object.keys(SEV) as Array<keyof typeof SEV>).map((k) => (
            <button key={k} style={pill(sev === k, SEV[k].c)} onClick={() => setSev(k)}>{SEV[k].t}</button>
          ))}
        </div>
        {vendors.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, width: 56 }}>ベンダー</span>
            {vendors.slice(0, 12).map((v) => <button key={v} style={pill(vendor === v, C.blue)} onClick={() => setVendor(v)}>{v}</button>)}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "center", borderTop: `1px solid ${C.line}`, paddingTop: 10, flexWrap: "wrap" }}>
          <button style={pill(kevOnly, C.pink)} onClick={() => setKevOnly((v) => !v)}>⚠ KEV{kevOnly ? "のみ" : ""}（悪用確認済み）</button>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{filtered.length} 件</span>
            <div style={{ display: "flex", background: C.bg, border: `1px solid ${C.line2}`, borderRadius: 9, padding: 3, gap: 3 }}>
              {(["table", "grid"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer", background: view === v ? C.ink : "transparent", color: view === v ? "#fff" : C.ink2, transition: "all 0.2s" }}>{v === "table" ? "≣ 表" : "▦ グリッド"}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {view === "table" && (
        <div style={{ marginTop: 22, border: `1px solid ${C.line}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ minWidth: 800 }}>
              <div style={{ display: "grid", gridTemplateColumns: "180px 70px 110px 1fr 130px 110px", padding: "11px 0", background: C.soft, borderBottom: `1px solid ${C.line}`, fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>
                <span style={{ ...stickyId, background: C.soft, padding: "0 16px", boxShadow: `2px 0 0 ${C.line}` }}>CVE ID</span>
                <span style={{ padding: "0 8px" }}>CVSS</span>
                <span style={{ padding: "0 8px" }}>SEVERITY</span>
                <span style={{ padding: "0 8px" }}>製品 · 概要</span>
                <span style={{ padding: "0 8px" }}>ベンダー</span>
                <span style={{ padding: "0 8px" }}>公開日</span>
              </div>
              {filtered.map((c) => (
                <a key={c.id} href={`https://nvd.nist.gov/vuln/detail/${c.id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "grid", gridTemplateColumns: "180px 70px 110px 1fr 130px 110px", padding: "13px 0", borderBottom: `1px solid ${C.line}`, alignItems: "center", textDecoration: "none", color: "inherit" }}>
                  <span style={{ ...stickyId, padding: "0 16px", fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 600, color: C.ink, boxShadow: `2px 0 0 ${C.line}`, display: "flex", alignItems: "center", gap: 6 }}>{c.id}{c.kev && <KevBadge small />}</span>
                  <span style={{ padding: "0 8px" }}><CVSSBadge score={c.cvss} s={c.severity} /></span>
                  <span style={{ padding: "0 8px" }}><SevBadge s={c.severity} /></span>
                  <span style={{ padding: "0 8px", minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.product}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.summary || "（概要なし）"}</div>
                  </span>
                  <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 11.5, color: c.severity === "none" ? C.ink3 : SEV[c.severity].c, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.vendor}</span>
                  <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{fmtDate(c.date)}</span>
                </a>
              ))}
            </div>
          </div>
          {filtered.length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "24px 16px", textAlign: "center" }}>該当なし</div>}
        </div>
      )}

      {/* GRID */}
      {view === "grid" && (
        <div style={{ marginTop: 22 }}>
          {(Object.keys(grouped) as Array<keyof typeof grouped>).map((k) => {
            const arr = grouped[k];
            if (arr.length === 0) return null;
            if (k === "none") return null;
            const sv = SEV[k as Exclude<CveSeverity, "none">];
            return (
              <div key={k} style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12, flexWrap: "wrap" }}>
                  <SevBadge s={k as CveSeverity} size={10} />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2 }}>CVSS {sv.range}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{arr.length}</span>
                  <div style={{ flex: 1, height: 1, background: C.line, minWidth: 20 }} />
                </div>
                <div className="cve-grid">{arr.map((c) => <CveCard key={c.id} c={c} />)}</div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: C.ink3, padding: "24px 16px", textAlign: "center" }}>該当なし</div>}
        </div>
      )}

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, textAlign: "center", marginTop: 28 }}>
        // 出典: NVD公式 + CISA KEV連携 · 直近30日のCVEを表示 · 詳細は各CVE IDから公式ページへ
      </div>
    </div>
  );
}
