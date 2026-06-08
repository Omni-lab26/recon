// 仮想ファイルシステム上で動く簡易シェル。すべてメモリ内で完結する安全な環境。
import { type FSNode, type Scenario } from "@/lib/lab/scenarios";

export type CmdResult = {
  out: string;
  clear?: boolean;
  enterPython?: boolean;
  completed?: string;
};

export class Shell {
  root: FSNode;
  cwd: string[];
  scenario: Scenario;
  hintIdx = 0;
  solved = false;

  constructor(scenario: Scenario) {
    this.scenario = scenario;
    this.root = scenario.fs();
    this.cwd = scenario.home.split("/").filter(Boolean);
  }

  get user() { return this.scenario.user; }

  cwdDisplay(): string {
    const path = "/" + this.cwd.join("/");
    const home = this.scenario.home;
    if (path === home) return "~";
    if (path.startsWith(home + "/")) return "~" + path.slice(home.length);
    return path;
  }

  private resolve(p: string): string[] {
    let segs: string[];
    if (!p || p === "~") return this.scenario.home.split("/").filter(Boolean);
    if (p.startsWith("~/")) segs = (this.scenario.home + p.slice(1)).split("/");
    else if (p.startsWith("/")) segs = p.split("/");
    else segs = ["/" + this.cwd.join("/") + "/" + p].join("").split("/");
    const out: string[] = [];
    for (const s of segs) {
      if (s === "" || s === ".") continue;
      if (s === "..") out.pop();
      else out.push(s);
    }
    return out;
  }

  private node(segs: string[]): FSNode | null {
    let cur: FSNode = this.root;
    for (const s of segs) {
      if (cur.type !== "dir" || !cur.children[s]) return null;
      cur = cur.children[s];
    }
    return cur;
  }

  exec(input: string): CmdResult {
    const line = input.trim();
    if (!line) return { out: "" };
    const parts = line.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const tokens = parts.map((t) => t.replace(/^['"]|['"]$/g, ""));
    const cmd = tokens[0];
    const args = tokens.slice(1);
    const flags = args.filter((a) => a.startsWith("-"));
    const rest = args.filter((a) => !a.startsWith("-"));

    switch (cmd) {
      case "help": return { out: this.help() };
      case "ls": return { out: this.ls(rest[0], flags) };
      case "cd": return { out: this.cd(rest[0]) };
      case "pwd": return { out: "/" + this.cwd.join("/") };
      case "cat": return { out: this.cat(rest) };
      case "echo": return { out: args.join(" ") };
      case "grep": return { out: this.grep(rest, flags) };
      case "find": return { out: this.find(rest[0]) };
      case "whoami": return { out: this.user };
      case "id": return { out: `uid=1000(${this.user}) gid=1000(${this.user})` };
      case "clear": return { out: "", clear: true };
      case "python": case "python3": return { out: "", enterPython: true };
      case "hint": return { out: this.hint() };
      case "mission": case "goal": return { out: this.mission() };
      case "submit": return this.submit(rest.join(" "));
      case "banner": case "about": return { out: this.banner() };
      default: return { out: `\x1b[38;2;255;77;141m${cmd}: コマンドが見つかりません\x1b[0m  (help でコマンド一覧)` };
    }
  }

  private help(): string {
    return [
      "\x1b[38;2;0;184;122m使えるコマンド:\x1b[0m",
      "  ls [-a] [-l] [path]   ファイル一覧 (-a で隠しファイルも)",
      "  cd [path]             ディレクトリ移動",
      "  pwd                   現在地",
      "  cat <file>            ファイルの中身を表示",
      "  grep [-i] <語> <file> ファイル内を検索",
      "  find [path]           配下を再帰的に一覧",
      "  echo <text>           文字列を表示",
      "  whoami / id           自分の権限",
      "  python                Pythonを起動 (exit() で戻る)",
      "  mission               今のミッションの目標",
      "  hint                  ヒントを1つ表示",
      "  submit <flag>         フラグを提出",
      "  clear                 画面クリア",
    ].join("\n");
  }

  private ls(path: string | undefined, flags: string[]): string {
    const segs = this.resolve(path || ".");
    const n = this.node(segs);
    if (!n) return `\x1b[38;2;255;77;141mls: ${path}: が見つかりません\x1b[0m`;
    if (n.type === "file") return path || "";
    const all = flags.some((f) => f.includes("a"));
    const long = flags.some((f) => f.includes("l"));
    let names = Object.keys(n.children);
    if (!all) names = names.filter((nm) => !nm.startsWith("."));
    names.sort();
    if (names.length === 0) return "";
    if (long) {
      return names.map((nm) => {
        const child = n.children[nm];
        const isDir = child.type === "dir";
        const size = child.type === "file" ? child.content.length : 4096;
        const color = isDir ? "\x1b[38;2;43;127;255m" : nm.startsWith(".") ? "\x1b[38;2;154;154;165m" : "";
        return `${isDir ? "drwxr-xr-x" : "-rw-r--r--"}  ${this.user}  ${String(size).padStart(5)}  ${color}${nm}\x1b[0m`;
      }).join("\n");
    }
    return names.map((nm) => {
      const child = n.children[nm];
      if (child.type === "dir") return `\x1b[38;2;43;127;255m${nm}/\x1b[0m`;
      if (nm.startsWith(".")) return `\x1b[38;2;154;154;165m${nm}\x1b[0m`;
      return nm;
    }).join("  ");
  }

  private cd(path: string | undefined): string {
    const segs = this.resolve(path || "~");
    const n = this.node(segs);
    if (!n) return `\x1b[38;2;255;77;141mcd: ${path}: そのようなディレクトリはありません\x1b[0m`;
    if (n.type !== "dir") return `\x1b[38;2;255;77;141mcd: ${path}: ディレクトリではありません\x1b[0m`;
    this.cwd = segs;
    return "";
  }

  private cat(files: string[]): string {
    if (files.length === 0) return "\x1b[38;2;255;77;141mcat: ファイルを指定してください\x1b[0m";
    return files.map((f) => {
      const n = this.node(this.resolve(f));
      if (!n) return `\x1b[38;2;255;77;141mcat: ${f}: そのようなファイルはありません\x1b[0m`;
      if (n.type !== "file") return `\x1b[38;2;255;77;141mcat: ${f}: ディレクトリです\x1b[0m`;
      return n.content;
    }).join("\n");
  }

  private grep(args: string[], flags: string[]): string {
    if (args.length < 2) return "\x1b[38;2;255;77;141m使い方: grep [-i] <検索語> <ファイル>\x1b[0m";
    const ci = flags.some((f) => f.includes("i"));
    const pat = args[0];
    const n = this.node(this.resolve(args[1]));
    if (!n) return `\x1b[38;2;255;77;141mgrep: ${args[1]}: そのようなファイルはありません\x1b[0m`;
    if (n.type !== "file") return `\x1b[38;2;255;77;141mgrep: ${args[1]}: ディレクトリです\x1b[0m`;
    const needle = ci ? pat.toLowerCase() : pat;
    const matched = n.content.split("\n").filter((ln) => (ci ? ln.toLowerCase() : ln).includes(needle));
    if (matched.length === 0) return "";
    return matched.map((ln) => ln.replace(new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ci ? "gi" : "g"), (m) => `\x1b[38;2;255;159;28m${m}\x1b[0m`)).join("\n");
  }

  private find(path: string | undefined): string {
    const start = this.resolve(path || ".");
    const base = this.node(start);
    if (!base) return `\x1b[38;2;255;77;141mfind: '${path}' が見つかりません\x1b[0m`;
    const out: string[] = [];
    const walk = (n: FSNode, p: string) => {
      out.push(p || "/");
      if (n.type === "dir") for (const k of Object.keys(n.children).sort()) walk(n.children[k], p + "/" + k);
    };
    walk(base, "/" + start.join("/"));
    return out.join("\n");
  }

  private mission(): string {
    const s = this.scenario;
    return [
      `\x1b[38;2;0;184;122m[${s.id}] ${s.title}\x1b[0m`,
      s.brief,
      "",
      `\x1b[1m目標:\x1b[0m ${s.goal}`,
    ].join("\n");
  }

  private hint(): string {
    const s = this.scenario;
    if (this.hintIdx >= s.hints.length) return "\x1b[38;2;154;154;165mこれ以上のヒントはありません。\x1b[0m";
    const h = s.hints[this.hintIdx];
    this.hintIdx++;
    return `\x1b[38;2;255;159;28mヒント ${this.hintIdx}/${s.hints.length}:\x1b[0m ${h}`;
  }

  private submit(flag: string): CmdResult {
    if (!flag) return { out: "\x1b[38;2;255;77;141m使い方: submit <フラグ>\x1b[0m" };
    if (this.scenario.check(flag)) {
      this.solved = true;
      return { out: `\x1b[38;2;0;184;122m✓ 正解！\x1b[0m\n${this.scenario.success}`, completed: this.scenario.id };
    }
    return { out: "\x1b[38;2;255;77;141m✗ 不正解。もう一度試そう。(hint でヒント)\x1b[0m" };
  }

  private banner(): string {
    return [
      "\x1b[38;2;0;184;122m  >_recon lab\x1b[0m",
      "  ブラウザ内の隔離環境。すべてシミュレーションで安全。",
      "  help でコマンド一覧、mission で目標、hint でヒント。",
    ].join("\n");
  }
}
