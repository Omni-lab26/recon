"use client";

import { useState, useMemo } from "react";
import { CHALLENGES, CTF_FIELDS, DIFF, type FieldKey, type Difficulty, type Challenge } from "@/lib/ctf-data";

const INK = "#0a0a0b";
const INK2 = "#52525b";
const INK3 = "#9a9aa5";
const LINE = "#ececf1";
const LINE2 = "#dcdce4";
const BG = "#ffffff";
const SOFT = "#fbfbfd";
const GREEN = "#00b87a";

function DiffBadge({ diff, size = 10 }: { diff: Difficulty; size?: number }) {
  const d = DIFF[diff];
  return (
    <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: size, fontWeight: 600, color: "#fff", background: d.c, padding: "2px 8px", borderRadius: 5 }}>{d.label}</span>
  );
}

function GridCard({ ch }: { ch: Challenge }) {
  const [h, setH] = useState(false);
  const F = CTF_FIELDS[ch.field];
  return (
    <div
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", borderRadius: 14, border: `1px solid ${h ? F.c + "66" : LINE}`, background: BG, padding: "16px 16px 14px", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", transform: h ? "translateY(-3px)" : "none", boxShadow: h ? `0 14px 32px ${F.c}1f` : "0 1px 2px rgba(10,10,15,0.03)", overflow: "hidden" }}
    >
      {ch.solved && <div aria-hidden style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 34px 34px 0", borderColor: `transparent ${GREEN} transparent transparent` }} />}
      {ch.solved && <span style={{ position: "absolute", top: 2, right: 4, color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: `${F.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, color: F.c }}>{F.glyph}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3 }}>{F.name}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: INK, letterSpacing: "-0.01em", marginBottom: 10 }}>{ch.title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <DiffBadge diff={ch.diff} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}><b style={{ color: INK }}>{ch.pts}</b> pts</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: INK3, marginTop: 8, display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN }} />{ch.solves.toLocaleString()} solves
      </div>
    </div>
  );
}

// 横スクロール時に左端固定するタイトルセル
const stickyTitle: React.CSSProperties = {
  position: "sticky", left: 0, zIndex: 2, background: BG,
  boxShadow: "2px 0 0 " + LINE,
};

export default function CTFList() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [field, setField] = useState<FieldKey | "all">("all");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [onlyUnsolved, setOnlyUnsolved] = useState(false);

  const filtered = useMemo(
    () =>
      CHALLENGES.filter(
        (c) =>
          (field === "all" || c.field === field) &&
          (diff === "all" || c.diff === diff) &&
          (!onlyUnsolved || !c.solved)
      ),
    [field, diff, onlyUnsolved]
  );

  const byField = useMemo(() => {
    const m: Partial<Record<FieldKey, Challenge[]>> = {};
    filtered.forEach((c) => {
      (m[c.field] = m[c.field] || []).push(c);
    });
    return m;
  }, [filtered]);

  const pill = (active: boolean, c: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 12, padding: "7px 13px", borderRadius: 9, cursor: "pointer",
    border: `1px solid ${active ? c : LINE2}`, background: active ? c : BG, color: active ? "#fff" : INK2,
    transition: "all 0.2s", fontWeight: active ? 600 : 400, whiteSpace: "nowrap",
  });

  return (
    <div>
      {/* filter bar (always on) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, borderRadius: 14, border: `1px solid ${LINE}`, background: SOFT }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, width: 44 }}>分野</span>
          <button style={pill(field === "all", INK)} onClick={() => setField("all")}>all</button>
          {(Object.keys(CTF_FIELDS) as FieldKey[]).map((k) => (
            <button key={k} style={pill(field === k, CTF_FIELDS[k].c)} onClick={() => setField(k)}>{CTF_FIELDS[k].glyph} {CTF_FIELDS[k].name}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, width: 44 }}>難易度</span>
          <button style={pill(diff === "all", INK)} onClick={() => setDiff("all")}>all</button>
          {(Object.keys(DIFF) as Difficulty[]).map((k) => (
            <button key={k} style={pill(diff === k, DIFF[k].c)} onClick={() => setDiff(k)}>{DIFF[k].label}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", borderTop: `1px solid ${LINE}`, paddingTop: 10, flexWrap: "wrap" }}>
          <button style={pill(onlyUnsolved, GREEN)} onClick={() => setOnlyUnsolved((v) => !v)}>{onlyUnsolved ? "☑" : "☐"} 未解決のみ</button>
          {/* table / grid toggle */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3 }}>{filtered.length} 問</span>
            <div style={{ display: "flex", background: BG, border: `1px solid ${LINE2}`, borderRadius: 9, padding: 3, gap: 3 }}>
              {(["table", "grid"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer", background: view === v ? INK : "transparent", color: view === v ? "#fff" : INK2, transition: "all 0.2s" }}
                >
                  {v === "table" ? "≣ 表" : "▦ グリッド"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TABLE (default) — horizontal swipe on mobile, sticky title ===== */}
      {view === "table" && (
        <div style={{ marginTop: 22, border: `1px solid ${LINE}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ minWidth: 640 }}>
              {/* header */}
              <div style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) 120px 110px 80px 110px 110px", padding: "11px 0", background: SOFT, borderBottom: `1px solid ${LINE}`, fontFamily: "var(--font-mono)", fontSize: 10.5, color: INK3 }}>
                <span style={{ ...stickyTitle, background: SOFT, boxShadow: "2px 0 0 " + LINE, padding: "0 16px" }}>TITLE</span>
                <span style={{ padding: "0 8px" }}>FIELD</span>
                <span style={{ padding: "0 8px" }}>DIFFICULTY</span>
                <span style={{ padding: "0 8px" }}>PTS</span>
                <span style={{ padding: "0 8px" }}>SOLVES</span>
                <span style={{ padding: "0 8px" }}>STATUS</span>
              </div>
              {/* rows */}
              {filtered.map((ch) => {
                const F = CTF_FIELDS[ch.field];
                return (
                  <div key={ch.id} className="ctf-row" style={{ display: "grid", gridTemplateColumns: "minmax(180px,1fr) 120px 110px 80px 110px 110px", padding: "13px 0", borderBottom: `1px solid ${LINE}`, alignItems: "center", cursor: "pointer" }}>
                    <span style={{ ...stickyTitle, padding: "0 16px", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: INK }}>{ch.title}</span>
                    <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 12, color: F.c, whiteSpace: "nowrap" }}>{F.glyph} {F.name}</span>
                    <span style={{ padding: "0 8px" }}><DiffBadge diff={ch.diff} size={9} /></span>
                    <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 12.5, color: INK }}>{ch.pts}</span>
                    <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 12, color: INK2 }}>{ch.solves.toLocaleString()}</span>
                    <span style={{ padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 11, color: ch.solved ? GREEN : INK3, whiteSpace: "nowrap" }}>{ch.solved ? "✓ solved" : "— unsolved"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {filtered.length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: INK3, padding: "24px 16px", textAlign: "center" }}>該当なし</div>}
        </div>
      )}

      {/* ===== GRID (toggle) — grouped by field ===== */}
      {view === "grid" && (
        <div style={{ marginTop: 22 }}>
          {Object.keys(byField).length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: INK3, padding: "24px 0", textAlign: "center" }}>該当なし</div>}
          {(Object.keys(byField) as FieldKey[]).map((fk) => {
            const F = CTF_FIELDS[fk];
            const list = byField[fk]!;
            return (
              <div key={fk} style={{ marginBottom: 26 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: `${F.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 13, color: F.c }}>{F.glyph}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: INK }}>{F.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3 }}>{list.length}</span>
                  <div style={{ flex: 1, height: 1, background: LINE }} />
                </div>
                <div className="ctf-grid">
                  {list.map((ch) => <GridCard key={ch.id} ch={ch} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
