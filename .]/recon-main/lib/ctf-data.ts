// CTF問題のデータ。サンプル + 後から増やせる器。
// 難易度は Easy / Medium / Hard（CTFの慣習に合わせる。サイトのL1-L5とは別軸）。

export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFF: Record<Difficulty, { c: string; label: string }> = {
  Easy: { c: "#00b87a", label: "Easy" },
  Medium: { c: "#ff9f1c", label: "Medium" },
  Hard: { c: "#ff4d8d", label: "Hard" },
};

export type FieldKey = "web" | "crypto" | "pwn" | "forensic" | "net" | "osint";

export const CTF_FIELDS: Record<FieldKey, { name: string; glyph: string; c: string }> = {
  web: { name: "Web", glyph: "</>", c: "#2b7fff" },
  crypto: { name: "Crypto", glyph: "#", c: "#8b5cf6" },
  pwn: { name: "Pwn", glyph: "!", c: "#ff4d8d" },
  forensic: { name: "Forensic", glyph: "◎", c: "#ff9f1c" },
  net: { name: "Network", glyph: "◇", c: "#06b6d4" },
  osint: { name: "OSINT", glyph: "◉", c: "#f4564a" },
};

export type Challenge = {
  id: string;
  title: string;
  field: FieldKey;
  diff: Difficulty;
  pts: number;
  solves: number;
  solved: boolean;
};

export const CHALLENGES: Challenge[] = [
  { id: "w1", title: "Cookie Monster", field: "web", diff: "Easy", pts: 50, solves: 1243, solved: true },
  { id: "w2", title: "Blind Injection", field: "web", diff: "Medium", pts: 200, solves: 412, solved: true },
  { id: "w3", title: "JWT Forgery", field: "web", diff: "Hard", pts: 350, solves: 156, solved: false },
  { id: "c1", title: "XOR Warmup", field: "crypto", diff: "Easy", pts: 50, solves: 980, solved: true },
  { id: "c2", title: "RSA Common Modulus", field: "crypto", diff: "Hard", pts: 350, solves: 98, solved: false },
  { id: "c3", title: "Broken PRNG", field: "crypto", diff: "Hard", pts: 500, solves: 23, solved: false },
  { id: "p1", title: "ret2win", field: "pwn", diff: "Medium", pts: 100, solves: 567, solved: false },
  { id: "p2", title: "Heap Note", field: "pwn", diff: "Hard", pts: 500, solves: 17, solved: false },
  { id: "f1", title: "Hidden in Pixels", field: "forensic", diff: "Easy", pts: 100, solves: 734, solved: true },
  { id: "f2", title: "Memory Dump", field: "forensic", diff: "Hard", pts: 350, solves: 121, solved: false },
  { id: "n1", title: "Packet Hunt", field: "net", diff: "Medium", pts: 100, solves: 645, solved: false },
  { id: "o1", title: "Find the Leak", field: "osint", diff: "Medium", pts: 200, solves: 389, solved: false },
];
