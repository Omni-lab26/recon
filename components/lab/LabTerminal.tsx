"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SCENARIOS, getScenario } from "@/lib/lab/scenarios";
import { Shell } from "@/lib/lab/shell";
import { loadCompleted, saveCompleted } from "@/lib/lab/storage";
import { C } from "@/lib/tokens";

const XTERM_JS = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js";
const XTERM_CSS = "https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css";
const FIT_JS = "https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js";
const PYODIDE_JS = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { Terminal: any; FitAddon: any; loadPyodide: any; }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}
function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href;
  document.head.appendChild(l);
}

const NL = "\r\n";

export default function LabTerminal() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<any>(null);
  const fitRef = useRef<any>(null);
  const shellRef = useRef<Shell | null>(null);
  const pyodideRef = useRef<any>(null);

  // line editor state (refs to avoid re-render per keystroke)
  const lineRef = useRef("");
  const curRef = useRef(0);
  const histRef = useRef<string[]>([]);
  const histIdxRef = useRef(0);
  const modeRef = useRef<"shell" | "python" | "busy">("busy");

  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenarioIdRef = useRef(scenarioId);
  const [completed, setCompleted] = useState<string[]>([]);
  const [booted, setBooted] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scenario = getScenario(scenarioId)!;

  const prompt = useCallback(() => {
    const sh = shellRef.current;
    if (!sh) return "$ ";
    if (modeRef.current === "python") return "\x1b[38;2;255;159;28m>>> \x1b[0m";
    return `\x1b[38;2;0;184;122m${sh.user}@lab\x1b[0m:\x1b[38;2;43;127;255m${sh.cwdDisplay()}\x1b[0m$ `;
  }, []);

  const redraw = useCallback(() => {
    const t = termRef.current;
    if (!t) return;
    t.write("\r\x1b[K" + prompt() + lineRef.current);
    const back = lineRef.current.length - curRef.current;
    if (back > 0) t.write(`\x1b[${back}D`);
  }, [prompt]);

  const writeOut = useCallback((s: string) => {
    termRef.current?.write(s.replace(/\n/g, NL));
  }, []);

  const markCompleted = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveCompleted(next);
      return next;
    });
  }, []);

  // load a scenario into the shell and reset the screen
  const bootScenario = useCallback((id: string) => {
    const sc = getScenario(id);
    if (!sc) return;
    shellRef.current = new Shell(sc);
    lineRef.current = ""; curRef.current = 0;
    histRef.current = []; histIdxRef.current = 0;
    modeRef.current = "shell";
    const t = termRef.current;
    if (!t) return;
    t.clear();
    t.write(`\x1b[38;2;0;184;122m  >_recon lab\x1b[0m  —  ${sc.title}${NL}`);
    t.write(`  ${sc.brief}${NL}`);
    t.write(`  \x1b[1m目標:\x1b[0m ${sc.goal}${NL}`);
    t.write(`  \x1b[38;2;154;154;165mhelp=コマンド一覧  mission=目標  hint=ヒント  submit <flag>=提出\x1b[0m${NL}${NL}`);
    t.write(prompt());
    t.focus();
  }, [prompt]);

  // run a shell line
  const runShell = useCallback(async (raw: string) => {
    const sh = shellRef.current; const t = termRef.current;
    if (!sh || !t) return;
    const res = sh.exec(raw);
    if (res.clear) t.clear();
    if (res.out) writeOut(res.out + "\n");
    if (res.completed) markCompleted(res.completed);
    if (res.enterPython) { await enterPython(); return; }
    t.write(prompt());
  }, [prompt, writeOut, markCompleted]);

  const enterPython = useCallback(async () => {
    const t = termRef.current; if (!t) return;
    modeRef.current = "busy";
    if (!pyodideRef.current) {
      t.write(`\x1b[38;2;255;159;28mPyodide を読み込み中… 初回は数十秒かかります\x1b[0m${NL}`);
      try {
        await loadScript(PYODIDE_JS);
        pyodideRef.current = await window.loadPyodide();
        pyodideRef.current.setStdout({ batched: (s: string) => writeOut(s) });
        pyodideRef.current.setStderr({ batched: (s: string) => writeOut(s) });
      } catch {
        t.write(`\x1b[38;2;255;77;141mPyodide の読み込みに失敗しました。ネットワークを確認してください。\x1b[0m${NL}`);
        modeRef.current = "shell";
        t.write(prompt());
        return;
      }
    }
    modeRef.current = "python";
    t.write(`Python (Pyodide) — exit() で戻る${NL}`);
    t.write(prompt());
  }, [prompt, writeOut]);

  const runPython = useCallback(async (code: string) => {
    const t = termRef.current; if (!t) return;
    const trimmed = code.trim();
    if (trimmed === "exit()" || trimmed === "quit()") {
      modeRef.current = "shell";
      t.write(prompt());
      return;
    }
    if (!trimmed) { t.write(prompt()); return; }
    modeRef.current = "busy";
    try {
      const res = await pyodideRef.current.runPythonAsync(code);
      if (res !== undefined && res !== null) writeOut(String(res) + "\n");
    } catch (e: unknown) {
      writeOut(`\x1b[38;2;255;77;141m${e instanceof Error ? e.message : String(e)}\x1b[0m\n`);
    }
    modeRef.current = "python";
    t.write(prompt());
  }, [prompt, writeOut]);

  // commit current line
  const commit = useCallback(() => {
    const t = termRef.current; if (!t) return;
    const text = lineRef.current;
    t.write(NL);
    if (text.trim()) { histRef.current.push(text); }
    histIdxRef.current = histRef.current.length;
    lineRef.current = ""; curRef.current = 0;
    if (modeRef.current === "python") void runPython(text);
    else void runShell(text);
  }, [runShell, runPython]);

  // programmatic command (from toolbar buttons)
  const runCmd = useCallback((text: string) => {
    if (modeRef.current !== "shell") return;
    lineRef.current = text; curRef.current = text.length;
    redraw();
    commit();
  }, [redraw, commit]);

  // main init
  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        loadCss(XTERM_CSS);
        await loadScript(XTERM_JS);
        await loadScript(FIT_JS);
        if (disposed || !hostRef.current) return;

        const term = new window.Terminal({
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: 13, lineHeight: 1.35, cursorBlink: true, convertEol: false,
          theme: { background: "#0c0c0e", foreground: "#d6d6e0", cursor: "#00b87a", selectionBackground: "#2b7fff55" },
        });
        const fit = new window.FitAddon.FitAddon();
        term.loadAddon(fit);
        term.open(hostRef.current);
        fit.fit();
        termRef.current = term; fitRef.current = fit;

        const saved = await loadCompleted();
        if (!disposed) setCompleted(saved);

        term.onData((data: string) => {
          if (modeRef.current === "busy") return;
          // enter
          if (data === "\r") { commit(); return; }
          // backspace
          if (data === "\x7f") {
            if (curRef.current > 0) {
              const l = lineRef.current;
              lineRef.current = l.slice(0, curRef.current - 1) + l.slice(curRef.current);
              curRef.current--; redraw();
            }
            return;
          }
          // ctrl-c
          if (data === "\x03") { termRef.current.write("^C" + NL); lineRef.current = ""; curRef.current = 0; termRef.current.write(prompt()); return; }
          // ctrl-l
          if (data === "\x0c") { termRef.current.clear(); redraw(); return; }
          // ctrl-d (exit python)
          if (data === "\x04") { if (modeRef.current === "python") { modeRef.current = "shell"; termRef.current.write(NL + prompt()); } return; }
          // arrows
          if (data === "\x1b[A") { // up
            if (histRef.current.length && histIdxRef.current > 0) { histIdxRef.current--; lineRef.current = histRef.current[histIdxRef.current]; curRef.current = lineRef.current.length; redraw(); }
            return;
          }
          if (data === "\x1b[B") { // down
            if (histIdxRef.current < histRef.current.length - 1) { histIdxRef.current++; lineRef.current = histRef.current[histIdxRef.current]; }
            else { histIdxRef.current = histRef.current.length; lineRef.current = ""; }
            curRef.current = lineRef.current.length; redraw();
            return;
          }
          if (data === "\x1b[C") { if (curRef.current < lineRef.current.length) { curRef.current++; redraw(); } return; }
          if (data === "\x1b[D") { if (curRef.current > 0) { curRef.current--; redraw(); } return; }
          // printable
          if ([...data].every((ch) => ch >= " ")) {
            const l = lineRef.current;
            lineRef.current = l.slice(0, curRef.current) + data + l.slice(curRef.current);
            curRef.current += data.length; redraw();
          }
        });

        if (!disposed) { setBooted(true); bootScenario(scenarioIdRef.current); }
      } catch (e: unknown) {
        if (!disposed) setErr(e instanceof Error ? e.message : "ターミナルの初期化に失敗しました");
      }
    })();

    const onResize = () => { try { fitRef.current?.fit(); } catch { /* noop */ } };
    window.addEventListener("resize", onResize);
    return () => { disposed = true; window.removeEventListener("resize", onResize); try { termRef.current?.dispose(); } catch { /* noop */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchScenario = (id: string) => {
    setScenarioId(id); scenarioIdRef.current = id;
    if (booted) bootScenario(id);
  };

  return (
    <div>
      {/* mission selector */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {SCENARIOS.map((s) => {
          const active = s.id === scenarioId;
          const done = completed.includes(s.id);
          return (
            <button key={s.id} onClick={() => switchScenario(s.id)}
              style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "7px 13px", borderRadius: 10, cursor: "pointer", border: `1px solid ${active ? s.c : C.line2}`, background: active ? `${s.c}12` : C.bg, color: active ? s.c : C.ink2, transition: "all 0.15s" }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: s.c }} />
              {s.title}
              {done && <span style={{ color: C.accent }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* mission brief */}
      <div style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid ${scenario.c}33`, background: `${scenario.c}08`, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: scenario.c }}>[{scenario.id}] {scenario.fieldName}</span>
          {completed.includes(scenario.id) && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.accent }}>✓ クリア済み</span>}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 4 }}>{scenario.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: C.ink2, lineHeight: 1.6 }}>{scenario.goal}</div>
      </div>

      {/* terminal window */}
      <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line2}`, boxShadow: "0 10px 40px rgba(10,10,15,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", background: "#161619", borderBottom: "1px solid #26262c" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8a8a98", marginLeft: 8 }}>{scenario.user}@lab — recon</span>
        </div>
        {err ? (
          <div style={{ padding: "30px 20px", background: "#0c0c0e", color: "#ff9f1c", fontFamily: "var(--font-mono)", fontSize: 13, textAlign: "center" }}>
            ターミナルを読み込めませんでした: {err}<br />
            <span style={{ color: "#8a8a98", fontSize: 11 }}>ネットワーク(CDN)接続を確認して再読み込みしてください。</span>
          </div>
        ) : (
          <div ref={hostRef} style={{ height: 440, padding: "10px 12px", background: "#0c0c0e" }} />
        )}
      </div>

      {/* toolbar */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {[["mission", "目標"], ["hint", "ヒント"], ["help", "コマンド"], ["clear", "クリア"]].map(([cmd, label]) => (
          <button key={cmd} onClick={() => runCmd(cmd)} disabled={!booted}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "7px 14px", borderRadius: 9, cursor: booted ? "pointer" : "default", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink2 }}>
            {label}
          </button>
        ))}
        <button onClick={() => bootScenario(scenarioId)} disabled={!booted}
          style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, padding: "7px 14px", borderRadius: 9, cursor: booted ? "pointer" : "default", border: `1px solid ${C.line2}`, background: C.bg, color: C.ink3, marginLeft: "auto" }}>
          ↺ リセット
        </button>
      </div>
    </div>
  );
}
