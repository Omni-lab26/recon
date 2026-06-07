"use client";

import { useState } from "react";
import { FIELDS, LEVELS, TAG_GLYPH, type Field, type Step } from "@/lib/roadmap-data";
import { Reveal } from "@/components/ui/motion";
import { useProgress } from "@/lib/use-progress";

const INK = "#0a0a0b";
const INK2 = "#52525b";
const INK3 = "#9a9aa5";
const LINE = "#ececf1";
const BG = "#ffffff";

// ノードの中心X = カード本体padding-left(12) + headパディング(8) + ノード幅(38)/2 = 39
// ノードの中心X: ステップ行の左padding(8) + ノード幅(38)/2 = 27（行基準の絶対配置）
const NODE_CENTER_X = 27;

function StepRow({ step, i, total, openKey, toggle, fieldKey, completed, onComplete }: {
  step: Step; i: number; total: number; openKey: string | null;
  toggle: (k: string) => void; fieldKey: string;
  completed: boolean; onComplete: () => void;
}) {
  const L = LEVELS[i];
  const next = LEVELS[i + 1];
  const isSummit = i === total - 1;
  const key = `${fieldKey}:${i}`;
  const open = openKey === key;
  const [hov, setHov] = useState(false);

  return (
    <div style={{ position: "relative", paddingBottom: i < total - 1 ? 16 : 0 }}>
      {/* connector: sits in the gap between this node's bottom and the next node's top,
          with even spacing on both ends. When open, it stretches through the panel (bottom:0). */}
      {i < total - 1 && (
        <div style={{ position: "absolute", left: NODE_CENTER_X, top: 52, bottom: 0, width: 2.5, marginLeft: -1.25, background: `linear-gradient(${L.c}, ${next.c})`, borderRadius: 2, zIndex: 0 }} />
      )}

      <div
        onClick={() => toggle(key)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 13, padding: "7px 10px 7px 8px", borderRadius: 12, cursor: "pointer", background: hov || open ? `${L.c}0d` : "transparent", transition: "background 0.2s" }}
      >
        <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: 11, background: completed ? L.c : `${L.c}16`, border: `1.5px solid ${L.c}${isSummit || completed ? "" : "44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, color: completed ? "#fff" : L.c, boxShadow: completed || isSummit ? `0 4px 12px ${L.c}33` : "none", transition: "all 0.2s" }}>
          {completed ? "✓" : TAG_GLYPH[step.tag]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14.5, color: INK, letterSpacing: "-0.01em", minWidth: 0 }}>{step.t}</span>
            {isSummit && (
              <span style={{ flexShrink: 0, whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "#fff", background: L.c, padding: "1px 6px", borderRadius: 5 }}>▲ 頂</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center", marginTop: 3 }}>
            <span style={{ flexShrink: 0, whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, color: "#fff", background: L.c, padding: "1px 6px", borderRadius: 5 }}>{L.lv}</span>
            <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 11.5, color: L.c, fontWeight: 600 }}>{L.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: INK3 }}>· {step.tag}</span>
          </div>
        </div>

        <span style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 12, color: L.c, transition: "transform 0.25s, opacity 0.2s", transform: open ? "rotate(90deg)" : "rotate(0deg)", opacity: hov || open ? 1 : 0.45 }}>›</span>
      </div>

      {/* expanded panel */}
      {open && (
        <div style={{ marginLeft: 59, marginTop: 6, marginRight: 4, animation: "rmOpen 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
          {step.topics.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {step.topics.map((t, k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 10, border: `1px solid ${LINE}`, background: BG }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: L.c }} />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: INK }}>{t}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 14px", borderRadius: 11, border: `1px dashed ${L.c}55`, background: `${L.c}08` }}>
              <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 8, background: `${L.c}18`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, color: L.c }}>⋯</span>
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: INK }}>コンテンツ準備中</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: INK2, marginTop: 2, lineHeight: 1.5 }}>「{step.t}」の記事・演習は近日公開。</div>
              </div>
            </div>
          )}

          {/* 完了マーク */}
          <button onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "7px 13px", borderRadius: 9, cursor: "pointer",
              border: `1px solid ${completed ? L.c : LINE}`,
              background: completed ? L.c : BG,
              color: completed ? "#fff" : INK2, transition: "all 0.18s" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${completed ? "#fff" : INK3}`, background: completed ? "transparent" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
              {completed ? "✓" : ""}
            </span>
            {completed ? "完了済み(取り消す)" : "このステップを完了とマーク"}
          </button>
        </div>
      )}
    </div>
  );
}

function FieldCard({ f, idx, isDone, onComplete }: { f: Field; idx: number; isDone: (id: string) => boolean; onComplete: (id: string) => void }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const toggle = (k: string) => setOpenKey((cur) => (cur === k ? null : k));
  return (
    <Reveal delay={(idx % 2) * 0.05}>
      <div id={f.key} style={{ position: "relative", borderRadius: 18, border: `1px solid ${f.start ? f.c + "66" : LINE}`, background: BG, overflow: "hidden", boxShadow: f.start ? `0 12px 34px ${f.c}1f` : "0 1px 2px rgba(10,10,15,0.03)", height: "100%", scrollMarginTop: 80 }}>
        {f.start && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${f.c}, ${f.c}55)` }} />}
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${LINE}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 19, color: f.c }}>{f.glyph}</div>
            {f.start && <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", color: "#fff", background: f.c, padding: "4px 10px", borderRadius: 7 }}>START おすすめ</span>}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 19, color: INK, marginTop: 12, letterSpacing: "-0.01em" }}>{f.name}</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: INK2, marginTop: 4, lineHeight: 1.5 }}>{f.desc}</div>
          {/* per-field progress */}
          <FieldProgress f={f} isDone={isDone} />
        </div>
        <div style={{ padding: "16px 12px 18px" }}>
          {f.steps.map((s, i) => {
            const id = `${f.key}:${i}`;
            return (
              <StepRow key={i} step={s} i={i} total={f.steps.length} openKey={openKey} toggle={toggle} fieldKey={f.key}
                completed={isDone(id)} onComplete={() => onComplete(id)} />
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

function FieldProgress({ f, isDone }: { f: Field; isDone: (id: string) => boolean }) {
  const done = f.steps.reduce((acc, _, i) => acc + (isDone(`${f.key}:${i}`) ? 1 : 0), 0);
  const total = f.steps.length;
  const pct = (done / total) * 100;
  return (
    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: `${f.c}14`, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${f.c}, ${f.c}cc)`, transition: "width 0.4s ease" }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: f.c, minWidth: 32, textAlign: "right" }}>{done}/{total}</span>
    </div>
  );
}

export default function RoadmapFields() {
  const { isDone, toggle } = useProgress();
  return (
    <div className="rm-grid">
      {FIELDS.map((f, i) => (
        <FieldCard key={f.key} f={f} idx={i}
          isDone={(id) => isDone("roadmap", id)}
          onComplete={(id) => toggle("roadmap", id)} />
      ))}
    </div>
  );
}
