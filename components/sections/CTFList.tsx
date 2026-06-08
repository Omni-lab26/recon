"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { CTF_PROBLEMS, CAT_INFO, DIFF_INFO, type CtfProblem, type CtfCategory, type CtfDifficulty } from "@/lib/ctf-data";
import { useProgress } from "@/lib/use-progress";
import { C } from "@/lib/tokens";

/* ── Modal ─────────────────────────────────────────────────── */
function ProblemModal({ p, onClose }: { p: CtfProblem; onClose: () => void }) {
  const { isDone, toggle } = useProgress();
  const [input, setInput] = useState("");
  const [hintIdx, setHintIdx] = useState(0);
  const [result, setResult] = useState<"idle" | "ok" | "ng">("idle");
  const solved = isDone("ctf", p.id);
  const cat = CAT_INFO[p.category];
  const diff = DIFF_INFO[p.difficulty];

  const submit = () => {
    if (input.trim() === p.flag) {
      setResult("ok");
      if (!solved) toggle("ctf", p.id);
    } else {
      setResult("ng");
      setTimeout(() => setResult("idle"), 1500);
    }
  };

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(10,10,15,0.5)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", animation: "modalBg 0.2s ease both" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 640, maxHeight: "calc(100vh - 40px)", overflowY: "auto", background: C.bg, borderRadius: 18, boxShadow: "0 30px 80px rgba(10,10,15,0.28)", animation: "modalIn 0.24s cubic-bezier(0.16,1,0.3,1) both" }}>
        {/* header */}
        <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: cat.c, background: `${cat.c}0d`, border: `1px solid ${cat.c}33`, padding: "3px 9px", borderRadius: 7 }}>{cat.glyph} {cat.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: diff.c }}>{diff.name}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3 }}>{p.points}pts</span>
            {solved && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.accent }}>✓ 解答済み</span>}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.ink3, fontFamily: "var(--font-mono)", fontSize: 16, padding: "2px 8px" }}>✕</button>
        </div>

        <div style={{ padding: "22px 26px 32px" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 24, color: C.ink, letterSpacing: "-0.02em", margin: "0 0 14px" }}>{p.title}</h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14.5, color: C.ink, lineHeight: 1.85, margin: "0 0 18px" }}>{p.description}</p>

          {p.body && (
            <div style={{ background: "#0c0c0e", borderRadius: 10, padding: "14px 16px", marginBottom: 18, overflowX: "auto" }}>
              <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "#d6d6e0", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{p.body}</pre>
            </div>
          )}

          {/* hints */}
          {hintIdx > 0 && (
            <div style={{ marginBottom: 16 }}>
              {p.hints.slice(0, hintIdx).map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 9, padding: "9px 12px", borderRadius: 9, background: `${C.amber}0a`, border: `1px solid ${C.amber}33`, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.amber, flexShrink: 0 }}>ヒント {i + 1}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink, lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          )}
          {hintIdx < p.hints.length && (
            <button onClick={() => setHintIdx((n) => n + 1)} style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.amber, background: `${C.amber}0a`, border: `1px solid ${C.amber}33`, borderRadius: 8, padding: "7px 13px", cursor: "pointer", marginBottom: 18 }}>
              ヒントを見る ({hintIdx}/{p.hints.length})
            </button>
          )}

          {/* flag input */}
          {result === "ok" || solved ? (
            <div style={{ padding: "16px 18px", borderRadius: 12, background: `${C.accent}0d`, border: `1px solid ${C.accent}44` }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: C.accent, fontWeight: 600 }}>✓ 正解！ +{p.points}pts</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent, marginTop: 6 }}>{p.flag}</div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="RECON{...}" style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 13.5, padding: "11px 14px", borderRadius: 10, border: `1px solid ${result === "ng" ? C.pink : C.line2}`, background: C.bg, color: C.ink, outline: "none", transition: "border-color 0.2s" }} />
              <button onClick={submit} style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13.5, padding: "11px 18px", borderRadius: 10, background: `linear-gradient(115deg, ${C.accent}, ${C.cyan})`, color: "#fff", border: "none", cursor: "pointer" }}>
                提出
              </button>
            </div>
          )}
          {result === "ng" && <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.pink, marginTop: 8 }}>✗ 不正解。もう一度試せ。</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Card ───────────────────────────────────────────────────── */
function ProblemCard({ p, onOpen }: { p: CtfProblem; onOpen: () => void }) {
  const { isDone } = useProgress();
  const [h, setH] = useState(false);
  const solved = isDone("ctf", p.id);
  const cat = CAT_INFO[p.category];
  const diff = DIFF_INFO[p.difficulty];

  return (
    <button onClick={onOpen} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: "100%", textAlign: "left", padding: "18px 18px", borderRadius: 14, border: `1px solid ${h || solved ? cat.c + "55" : C.line}`, background: C.bg, cursor: "pointer", transition: "all 0.2s", transform: h ? "translateY(-2px)" : "none", boxShadow: h ? `0 12px 28px ${cat.c}1f` : "0 1px 2px rgba(10,10,15,0.03)", position: "relative" }}>
      {solved && <span style={{ position: "absolute", top: 12, right: 12, fontFamily: "var(--font-mono)", fontSize: 11, color: "#fff", background: C.accent, padding: "2px 8px", borderRadius: 6 }}>✓ SOLVED</span>}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: `${cat.c}14`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 14, color: cat.c }}>{cat.glyph}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: cat.c }}>{cat.name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: diff.c, background: `${diff.c}0d`, border: `1px solid ${diff.c}33`, padding: "2px 7px", borderRadius: 6 }}>{diff.name}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3 }}>{p.points}pts</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15.5, color: C.ink, marginBottom: 6 }}>{p.title}</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: C.ink2, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</div>
    </button>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
const CATS = Object.keys(CAT_INFO) as CtfCategory[];
const DIFFS = Object.keys(DIFF_INFO) as CtfDifficulty[];

export default function CTFList() {
  const [cat, setCat] = useState<CtfCategory | "all">("all");
  const [diff, setDiff] = useState<CtfDifficulty | "all">("all");
  const [active, setActive] = useState<CtfProblem | null>(null);
  const { isDone } = useProgress();

  const list = useMemo(() => CTF_PROBLEMS.filter((p) => (cat === "all" || p.category === cat) && (diff === "all" || p.difficulty === diff)), [cat, diff]);
  const solvedCount = CTF_PROBLEMS.reduce((acc, p) => acc + (isDone("ctf", p.id) ? 1 : 0), 0);
  const totalPts = CTF_PROBLEMS.filter((p) => isDone("ctf", p.id)).reduce((acc, p) => acc + p.points, 0);

  const pill = (active: boolean, c: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "6px 13px", borderRadius: 100, cursor: "pointer",
    border: `1px solid ${active ? c : C.line2}`, background: active ? `${c}10` : C.bg, color: active ? c : C.ink2, transition: "all 0.15s",
  });

  return (
    <div>
      {/* stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.accent }}>{solvedCount}/{CTF_PROBLEMS.length} 解答済み</span>
        {totalPts > 0 && <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.amber }}>{totalPts}pts 獲得</span>}
      </div>

      {/* filters */}
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
        <button style={pill(cat === "all", C.ink)} onClick={() => setCat("all")}>すべて</button>
        {CATS.map((c) => <button key={c} style={pill(cat === c, CAT_INFO[c].c)} onClick={() => setCat(c)}>{CAT_INFO[c].name}</button>)}
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 24 }}>
        <button style={pill(diff === "all", C.ink)} onClick={() => setDiff("all")}>全難易度</button>
        {DIFFS.map((d) => <button key={d} style={pill(diff === d, DIFF_INFO[d].c)} onClick={() => setDiff(d)}>{DIFF_INFO[d].name}</button>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {list.map((p) => <ProblemCard key={p.id} p={p} onOpen={() => setActive(p)} />)}
      </div>

      {list.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink3 }}>
          該当する問題がありません。
        </div>
      )}

      {active && <ProblemModal p={active} onClose={() => setActive(null)} />}
    </div>
  );
}
