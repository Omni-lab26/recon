"use client";

import { useState, useMemo } from "react";
import { TOOLS, TOOL_CATS, type ToolCatKey, type Tool } from "@/lib/tools-data";

const INK = "#0a0a0b";
const INK2 = "#52525b";
const INK3 = "#9a9aa5";
const LINE = "#ececf1";
const LINE2 = "#dcdce4";
const BG = "#ffffff";
const SOFT = "#fbfbfd";
const GREEN = "#00b87a";
const BLUE = "#2b7fff";
const AMBER = "#ff9f1c";
const TERM = "#0c0c0e";

function Stars({ n }: { n: number }) {
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: AMBER, letterSpacing: 1 }}>{"★".repeat(n)}<span style={{ color: LINE2 }}>{"★".repeat(3 - n)}</span></span>;
}
function Tag({ children }: { children: React.ReactNode }) {
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: INK2, background: SOFT, border: `1px solid ${LINE}`, padding: "2px 7px", borderRadius: 6 }}>{children}</span>;
}
function CmdLine({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  const comment = cmd.startsWith("#");
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(cmd).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }).catch(() => {});
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8 }}>
      <span style={{ color: comment ? INK3 : GREEN, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>{comment ? "›" : "$"}</span>
      <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 11.5, color: comment ? "#8a8a98" : "#d6d6e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{comment ? cmd.slice(1).trim() : cmd}</span>
      <button onClick={copy} style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 9.5, color: copied ? GREEN : "#6a6a78", background: "transparent", border: `1px solid ${copied ? GREEN : "#2a2a30"}`, borderRadius: 5, padding: "2px 6px", cursor: "pointer", transition: "all 0.2s" }}>{copied ? "copied" : "copy"}</button>
    </div>
  );
}

function ToolCard({ t, isFav, toggleFav }: { t: Tool; isFav: boolean; toggleFav: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"basic" | "advanced">("basic");
  const [h, setH] = useState(false);
  const cat = TOOL_CATS[t.cat];
  const cmds = tab === "basic" ? t.basic : t.advanced;

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", borderRadius: 16, background: BG, border: `1px solid ${open ? cat.c + "88" : h ? cat.c + "55" : LINE}`, padding: "18px 18px 16px", overflow: "hidden", transition: "border-color 0.3s, box-shadow 0.3s, transform 0.3s", transform: h && !open ? "translateY(-3px)" : "none", boxShadow: open ? `0 18px 44px ${cat.c}22` : h ? `0 14px 32px ${cat.c}18` : "0 1px 2px rgba(10,10,15,0.03)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: `${cat.c}14`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 16, color: cat.c }}>{cat.glyph}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: cat.c, background: `${cat.c}0d`, border: `1px solid ${cat.c}33`, padding: "3px 9px", borderRadius: 7 }}>{cat.name}</span>
          <button onClick={() => toggleFav(t.id)} title="お気に入り" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: isFav ? AMBER : LINE2, transition: "color 0.2s", lineHeight: 1, padding: 0 }}>★</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: INK, letterSpacing: "-0.01em" }}>{t.name}</span>
        <Stars n={t.star} />
        {t.kali && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, color: cat.c, background: `${cat.c}12`, border: `1px solid ${cat.c}40`, padding: "2px 7px", borderRadius: 6 }}>Kali標準</span>}
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: INK2, lineHeight: 1.55, marginBottom: 12 }}>{t.desc}</div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>{t.tags.map((x) => <Tag key={x}>{x}</Tag>)}</div>

      <button onClick={() => setOpen((v) => !v)}
        style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: open ? "#fff" : cat.c, background: open ? cat.c : `${cat.c}0d`, border: `1px solid ${cat.c}${open ? "" : "33"}`, borderRadius: 9, padding: "9px 0", cursor: "pointer", transition: "all 0.25s", width: "100%" }}>
        <span style={{ transition: "transform 0.25s", transform: open ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
        {open ? "閉じる" : "コマンド・使い方を見る"}
      </button>

      {open && (
        <div style={{ marginTop: 14, animation: "rmOpen 0.3s ease both" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 8, background: SOFT, border: `1px solid ${LINE}`, borderRadius: 9, padding: 3, width: "fit-content" }}>
            {(["basic", "advanced"] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "5px 14px", borderRadius: 7, border: "none", cursor: "pointer", background: tab === k ? BG : "transparent", color: tab === k ? cat.c : INK3, fontWeight: tab === k ? 600 : 400, boxShadow: tab === k ? `0 1px 4px ${cat.c}22` : "none", transition: "all 0.2s" }}>{k === "basic" ? "基本" : "応用"}</button>
            ))}
          </div>
          <div style={{ background: TERM, borderRadius: 10, padding: 5, marginBottom: 12 }}>
            {cmds.map((c, i) => <CmdLine key={i} cmd={c} />)}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: INK3, marginBottom: 4 }}>// インストール</div>
          <div style={{ background: TERM, borderRadius: 10, padding: 5, marginBottom: 12 }}>
            <CmdLine cmd={t.install} />
          </div>
          <a href="/roadmap" style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 12px", borderRadius: 10, border: `1px solid ${LINE}`, background: SOFT, textDecoration: "none", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: cat.c }}>⛰</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: INK3 }}>ロードマップで使う</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 600, color: INK }}>{t.roadmap.field} · {t.roadmap.step}</div>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: cat.c }}>→</span>
          </a>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3 }}>~/tools/{t.id}</span>
        <a href={`/tools/${t.id}`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: cat.c, textDecoration: "none" }}>仕組みを解説 →</a>
      </div>
    </div>
  );
}

export default function ToolsList() {
  const [cat, setCat] = useState<ToolCatKey | "all">("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"star" | "name" | "cat">("star");
  const [favOnly, setFavOnly] = useState(false);
  const [fav, setFav] = useState<Set<string>>(new Set(["nmap"]));

  const toggleFav = (id: string) =>
    setFav((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const list = useMemo(() => {
    let r = TOOLS.filter(
      (t) =>
        (cat === "all" || t.cat === cat) &&
        (q === "" || t.name.toLowerCase().includes(q.toLowerCase()) || t.tags.join(" ").toLowerCase().includes(q.toLowerCase())) &&
        (!favOnly || fav.has(t.id))
    );
    if (sort === "star") r = [...r].sort((a, b) => b.star - a.star);
    if (sort === "name") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "cat") r = [...r].sort((a, b) => a.cat.localeCompare(b.cat));
    return r;
  }, [cat, q, sort, favOnly, fav]);

  const pill = (active: boolean, c: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)", fontSize: 12, padding: "7px 13px", borderRadius: 9, cursor: "pointer",
    border: `1px solid ${active ? c : LINE2}`, background: active ? c : BG, color: active ? "#fff" : INK2,
    transition: "all 0.2s", fontWeight: active ? 600 : 400, whiteSpace: "nowrap",
  });

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 14, border: `1px solid ${LINE}`, background: SOFT }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ツール・タグで検索（例: nmap, hash, proxy）" style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "10px 14px", borderRadius: 10, border: `1px solid ${LINE2}`, background: BG, color: INK, outline: "none" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button style={pill(cat === "all", INK)} onClick={() => setCat("all")}>all</button>
          {(Object.keys(TOOL_CATS) as ToolCatKey[]).map((k) => (
            <button key={k} style={pill(cat === k, TOOL_CATS[k].c)} onClick={() => setCat(k)}>{TOOL_CATS[k].glyph} {TOOL_CATS[k].name}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", borderTop: `1px solid ${LINE}`, paddingTop: 10, flexWrap: "wrap" }}>
          <button style={pill(favOnly, AMBER)} onClick={() => setFavOnly((v) => !v)}>★ お気に入り{favOnly ? "のみ" : ""}</button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginLeft: 8 }}>並べ替え</span>
          {([["star", "定番度"], ["name", "名前"], ["cat", "カテゴリ"]] as const).map(([k, l]) => (
            <button key={k} style={pill(sort === k, BLUE)} onClick={() => setSort(k)}>{l}</button>
          ))}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginLeft: "auto" }}>{list.length} tools</span>
        </div>
      </div>

      <div style={{ marginTop: 26 }}>
        {list.length === 0 && <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: INK3, padding: "30px 0", textAlign: "center" }}>該当なし</div>}
        <div className="tools-grid">{list.map((t) => <ToolCard key={t.id} t={t} isFav={fav.has(t.id)} toggleFav={toggleFav} />)}</div>
      </div>
    </div>
  );
}
