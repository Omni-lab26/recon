"use client";

import { useState } from "react";

const GREEN = "#00b87a";
const INK3 = "#9a9aa5";
const TERM = "#0c0c0e";

function Line({ cmd }: { cmd: string }) {
  const [copied, setCopied] = useState(false);
  const comment = cmd.startsWith("#");
  const copy = () => {
    navigator.clipboard?.writeText(cmd).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }).catch(() => {});
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", borderRadius: 8 }}>
      <span style={{ color: comment ? INK3 : GREEN, flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{comment ? "›" : "$"}</span>
      <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12.5, color: comment ? "#8a8a98" : "#d6d6e0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{comment ? cmd.slice(1).trim() : cmd}</span>
      <button onClick={copy} style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: 9.5, color: copied ? GREEN : "#6a6a78", background: "transparent", border: `1px solid ${copied ? GREEN : "#2a2a30"}`, borderRadius: 5, padding: "3px 7px", cursor: "pointer", transition: "all 0.2s" }}>{copied ? "copied" : "copy"}</button>
    </div>
  );
}

export function CopyCommand({ commands }: { commands: string[] }) {
  return (
    <div style={{ background: TERM, borderRadius: 11, padding: 6 }}>
      {commands.map((cmd, i) => <Line key={i} cmd={cmd} />)}
    </div>
  );
}
