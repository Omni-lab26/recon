// ロードマップのデータ。各分野は L1..L5 の5ステップ（一本道）。
// step.topics に個別トピックを入れると展開時にリスト表示される。
// 今は空 = 「準備中」表示。後からここを埋めていく。

export type Level = { lv: string; name: string; c: string };

export const LEVELS: Level[] = [
  { lv: "L1", name: "入門", c: "#00b87a" },
  { lv: "L2", name: "基礎", c: "#06b6d4" },
  { lv: "L3", name: "実践", c: "#2b7fff" },
  { lv: "L4", name: "応用", c: "#8b5cf6" },
  { lv: "L5", name: "到達点", c: "#ff4d8d" },
];

export type StepTag = "記事" | "演習" | "CTF" | "ツール" | "CVE";

export const TAG_GLYPH: Record<StepTag, string> = {
  "記事": "#",
  "演習": "▶",
  "CTF": "⚑",
  "ツール": "$",
  "CVE": "!",
};

export type Step = {
  t: string;            // ステップ見出し（L1..L5の代表名）
  tag: StepTag;
  topics: string[];     // 個別トピック（空なら「準備中」）
};

export type Field = {
  key: string;
  name: string;
  glyph: string;
  c: string;
  desc: string;
  start?: boolean;
  steps: Step[];        // 必ず5つ（L1..L5に対応）
};

export const FIELDS: Field[] = [
  {
    key: "linux", name: "Linux 基礎", glyph: "$", c: "#00b87a", start: true, desc: "すべての土台。ここから始まる。",
    steps: [
      { t: "ターミナル入門", tag: "記事", topics: [] },
      { t: "ファイルと権限", tag: "記事", topics: [] },
      { t: "シェルスクリプト", tag: "演習", topics: [] },
      { t: "サービスと設定の悪用", tag: "演習", topics: [] },
      { t: "カーネル権限昇格", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "net", name: "ネットワーク", glyph: "◇", c: "#06b6d4", desc: "パケットの旅を理解する。",
    steps: [
      { t: "ネットワークとは", tag: "記事", topics: [] },
      { t: "TCP/IP の仕組み", tag: "記事", topics: [] },
      { t: "Nmap で探索", tag: "ツール", topics: [] },
      { t: "トラフィック解析", tag: "演習", topics: [] },
      { t: "中間者攻撃・プロトコル悪用", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "web", name: "Web セキュリティ", glyph: "</>", c: "#2b7fff", desc: "最も実戦的で、入口に最適。",
    steps: [
      { t: "Web の仕組み", tag: "記事", topics: [] },
      { t: "HTTP と改ざん", tag: "記事", topics: [] },
      { t: "XSS / SQLi", tag: "演習", topics: [] },
      { t: "Burp で複合攻撃", tag: "ツール", topics: [] },
      { t: "認証バイパスで侵入完遂", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "crypto", name: "暗号", glyph: "#", c: "#8b5cf6", desc: "数学的な弱点を突く。",
    steps: [
      { t: "暗号の基礎", tag: "記事", topics: [] },
      { t: "ハッシュと衝突", tag: "記事", topics: [] },
      { t: "古典暗号を解く", tag: "演習", topics: [] },
      { t: "RSA への攻撃", tag: "CTF", topics: [] },
      { t: "実装の弱点で解読 (乱数 / SCA)", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "pwn", name: "Pwn / バイナリ", glyph: "!", c: "#ff4d8d", desc: "メモリの底を覗く。最難関。",
    steps: [
      { t: "アセンブリ入門", tag: "記事", topics: [] },
      { t: "スタックの仕組み", tag: "記事", topics: [] },
      { t: "バッファオーバーフロー入門", tag: "演習", topics: [] },
      { t: "ROP チェーン", tag: "演習", topics: [] },
      { t: "ヒープ Exploit で任意コード実行", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "forensic", name: "フォレンジック", glyph: "◎", c: "#ff9f1c", desc: "痕跡から真実を読む。",
    steps: [
      { t: "ログの読み方", tag: "記事", topics: [] },
      { t: "ファイルシステム", tag: "記事", topics: [] },
      { t: "パケット復元", tag: "演習", topics: [] },
      { t: "ディスク調査", tag: "演習", topics: [] },
      { t: "メモリ解析でマルウェア再現", tag: "CTF", topics: [] },
    ],
  },
  {
    key: "osint", name: "Recon / OSINT", glyph: "◉", c: "#f4564a", desc: "偵察 — RECON の真髄。",
    steps: [
      { t: "OSINT 入門", tag: "記事", topics: [] },
      { t: "公開情報の収集", tag: "演習", topics: [] },
      { t: "攻撃面の特定", tag: "演習", topics: [] },
      { t: "資産の相関分析", tag: "演習", topics: [] },
      { t: "0day 候補に迫る", tag: "CVE", topics: [] },
    ],
  },
];
