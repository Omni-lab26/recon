// CTF問題集。すべて教育目的のシミュレーション。
// フラグは RECON{...} 形式で、クライアント側で照合する(学習CTFなので意図的)。

export type CtfCategory = "web" | "crypto" | "pwn" | "forensic" | "osint" | "misc";
export type CtfDifficulty = "beginner" | "intermediate" | "advanced";

export const CAT_INFO: Record<CtfCategory, { name: string; c: string; glyph: string }> = {
  web:      { name: "Web",        c: "#2b7fff", glyph: "</>" },
  crypto:   { name: "Crypto",     c: "#8b5cf6", glyph: "#"  },
  pwn:      { name: "Pwn",        c: "#ff4d8d", glyph: "!"  },
  forensic: { name: "Forensic",   c: "#ff9f1c", glyph: "◎"  },
  osint:    { name: "OSINT",      c: "#f4564a", glyph: "◉"  },
  misc:     { name: "Misc",       c: "#00b87a", glyph: "*"  },
};

export const DIFF_INFO: Record<CtfDifficulty, { name: string; c: string }> = {
  beginner:     { name: "初心者",  c: "#00b87a" },
  intermediate: { name: "中級",   c: "#ff9f1c" },
  advanced:     { name: "上級",   c: "#ff4d8d" },
};

export type CtfProblem = {
  id: string;
  title: string;
  category: CtfCategory;
  difficulty: CtfDifficulty;
  points: number;
  description: string;
  body?: string;           // コードブロックや詳細情報(オプション)
  hints: string[];
  flag: string;
  tags: string[];
};

export const CTF_PROBLEMS: CtfProblem[] = [
  // ──── Web ────
  {
    id: "web-01", title: "ソースを読め", category: "web", difficulty: "beginner", points: 100,
    description: "ある開発者が、ページのHTMLソースコードにうっかりコメントを残したまま本番にデプロイしてしまった。どこかに隠されたフラグを見つけよ。",
    body: `<!-- TODO: 本番前に消すこと\n  flag: RECON{always_check_the_source}\n  admin_password: p@ssw0rd123\n-->\n<html>\n  <body>\n    <h1>Welcome to RECON Corp</h1>\n  </body>\n</html>`,
    hints: [
      "ブラウザの「ページのソースを表示」を開いてみよ。",
      "HTMLコメント(<!-- ... -->)は画面には表示されないが、ソースには残る。",
      "フラグはコメントの中にある。",
    ],
    flag: "RECON{always_check_the_source}",
    tags: ["html", "source"],
  },
  {
    id: "web-02", title: "クッキーを食べろ", category: "web", difficulty: "beginner", points: 150,
    description: "このサイトは Cookie の値で権限を判定している。一般ユーザーとしてログインした後、Cookie を書き換えて管理者になれ。開発者ツールで `role` クッキーの値を `admin` に変更するとフラグが現れる。",
    hints: [
      "ブラウザの開発者ツール → Application → Cookies を開け。",
      "`role` というクッキーを探せ。",
      "値を `admin` に書き換えてページをリロードせよ。",
    ],
    flag: "RECON{cookies_are_not_auth}",
    tags: ["cookie", "auth"],
  },
  {
    id: "web-03", title: "SQLを注入せよ", category: "web", difficulty: "intermediate", points: 200,
    description: "脆弱なログインフォームがある。データベースへのクエリを操作して、パスワードなしで管理者アカウントにログインせよ。ユーザー名欄に適切なSQL文を入力するとフラグが手に入る。",
    body: `-- サーバー側のクエリ(脆弱)\nSELECT * FROM users\nWHERE username = '[入力値]'\n  AND password = '[入力値]';`,
    hints: [
      "シングルクォート(')で文字列を早期終了させることができる。",
      "`' OR '1'='1` を試してみよ。",
      "ユーザー名: `admin'--` で残りのクエリをコメントアウトできる。",
    ],
    flag: "RECON{sqli_bypasses_auth}",
    tags: ["sql", "injection", "auth"],
  },

  // ──── Crypto ────
  {
    id: "crypto-01", title: "シーザーを解読せよ", category: "crypto", difficulty: "beginner", points: 100,
    description: "古代の暗号が傍受された。シフト数3のシーザー暗号だ。以下の暗号文を復号してフラグを手に入れろ。",
    body: `UHFRQ{fdhvdu憂flskhu_lv_zhdn}`,
    hints: [
      "シーザー暗号はアルファベットを一定数ずらす単純な暗号だ。",
      "シフト数3なのでA→D、B→E...逆向きに3つ戻せばいい。",
      "オンラインのシーザー暗号デコーダーを使ってもいい。",
    ],
    flag: "RECON{caesar_cipher_is_weak}",
    tags: ["classical", "shift"],
  },
  {
    id: "crypto-02", title: "Base64の正体", category: "crypto", difficulty: "beginner", points: 100,
    description: "傍受した通信に奇妙な文字列が含まれていた。これは暗号化ではない。正体を見破ってデコードせよ。",
    body: `UkVDT057YmFzZTY0X2lzX25vdF9lbmNyeXB0aW9ufQ==`,
    hints: [
      "末尾の `==` はある符号化方式のパディング記号だ。",
      "ブラウザのコンソールで `atob('...')` を試せ。",
      "PythonならImport base64; base64.b64decode('...').decode()でデコードできる。",
    ],
    flag: "RECON{base64_is_not_encryption}",
    tags: ["encoding", "base64"],
  },
  {
    id: "crypto-03", title: "ハッシュを割れ", category: "crypto", difficulty: "intermediate", points: 200,
    description: "漏洩したデータベースに含まれていたハッシュ値だ。このハッシュの元の文字列を割り出せ。フラグは `RECON{元の文字列}` の形式で提出せよ。",
    body: `5f4dcc3b5aa765d61d8327deb882cf99`,
    hints: [
      "32文字の16進数 → MD5ハッシュだ。",
      "よく使われるパスワードの辞書で検索せよ。",
      "crackstation.net や hashcat で試せる。これは最もよく使われるパスワードの一つだ。",
    ],
    flag: "RECON{password}",
    tags: ["md5", "hash", "crack"],
  },

  // ──── Forensic ────
  {
    id: "forensic-01", title: "侵入者を割り出せ", category: "forensic", difficulty: "beginner", points: 150,
    description: "サーバーのSSH認証ログを解析して、総当たり攻撃の末にログインに成功した攻撃者のIPアドレスを突き止めろ。フラグは `RECON{IPアドレス}` の形式で提出せよ(ドットはそのまま)。",
    body: `Jan 12 03:12:44 srv sshd[2032]: Failed password for root from 185.220.101.47 port 60014\nJan 12 03:12:49 srv sshd[2036]: Failed password for root from 185.220.101.47 port 60023\nJan 12 03:12:55 srv sshd[2040]: Failed password for root from 185.220.101.47 port 60040\nJan 12 03:13:11 srv sshd[2042]: Failed password for admin from 222.186.30.112 port 40180\nJan 12 03:13:18 srv sshd[2048]: Failed password for root from 185.220.101.47 port 60061\nJan 12 03:13:25 srv sshd[2051]: Accepted password for root from 185.220.101.47 port 60077\nJan 12 03:14:02 srv sshd[2060]: Failed password for admin from 222.186.30.112 port 40233`,
    hints: [
      "`Failed` と `Accepted` を区別せよ。",
      "大量の `Failed` の後に `Accepted` が一つだけある。",
      "成功したログインのIPが答えだ。",
    ],
    flag: "RECON{185.220.101.47}",
    tags: ["log", "ssh", "brute-force"],
  },
  {
    id: "forensic-02", title: "16進数を解読せよ", category: "forensic", difficulty: "beginner", points: 100,
    description: "証拠ファイルの一部が16進数でダンプされている。これをASCII文字列に変換してフラグを得よ。",
    body: `52 45 43 4f 4e 7b 68 65 78 5f 64 75 6d 70 5f 72 65 76 65 61 6c 73 5f 61 6c 6c 7d`,
    hints: [
      "各16進数ペアが1文字に対応する。",
      "0x52 = 'R', 0x45 = 'E' ... と続く。",
      "Pythonで `bytes.fromhex('524543...').decode()` を試せ。",
    ],
    flag: "RECON{hex_dump_reveals_all}",
    tags: ["hex", "encoding", "ascii"],
  },

  // ──── OSINT ────
  {
    id: "osint-01", title: "座標を特定せよ", category: "osint", difficulty: "beginner", points: 150,
    description: "ある画像のEXIFメタデータから以下のGPS座標が取得できた。この場所が属する都市名を英語で答えよ。フラグは `RECON{都市名}` の形式で提出せよ(小文字)。",
    body: `GPS Latitude:  35.6762° N\nGPS Longitude: 139.6503° E\nAltitude: 40m`,
    hints: [
      "Google マップや地図サービスにこの座標を入力してみよ。",
      "日本の首都だ。",
    ],
    flag: "RECON{tokyo}",
    tags: ["exif", "metadata", "geolocation"],
  },

  // ──── Misc ────
  {
    id: "misc-01", title: "バイナリを読め", category: "misc", difficulty: "beginner", points: 100,
    description: "01の羅列をASCII文字に変換してフラグを得よ。各8ビットが1文字に対応する。",
    body: `01010010 01000101 01000011 01001111 01001110 01111011\n01100010 01101001 01101110 01100001 01110010 01111001\n01111101`,
    hints: [
      "2進数 → 10進数 → ASCII コードの変換だ。",
      "01010010 = 82 = 'R'",
      "Pythonで `chr(int('01010010', 2))` を試せ。",
    ],
    flag: "RECON{binary}",
    tags: ["binary", "encoding", "ascii"],
  },

  // ──── Pwn ────
  {
    id: "pwn-01", title: "バッファを溢れさせろ", category: "pwn", difficulty: "intermediate", points: 250,
    description: "以下のCコードにスタックバッファオーバーフロー脆弱性がある。`admin` 変数を0以外の値に書き換えるには、`gets()` に何バイト以上の入力を渡せばよいか? 数字のみで提出せよ。フラグは `RECON{バイト数}` の形式。",
    body: `#include <stdio.h>\n#include <string.h>\n\nvoid win() {\n  printf("RECON{buffer_overflow}\\n");\n}\n\nint main() {\n  char buf[32];\n  int admin = 0;\n  gets(buf);           // 危険: 長さチェックなし\n  if (admin != 0) win();\n  return 0;\n}`,
    hints: [
      "`char buf[32]` は32バイトのバッファだ。",
      "スタック上で `buf` の直後に `admin` が配置される(理論上)。",
      "33バイト目以降を書き込むと `admin` の領域に到達する。",
    ],
    flag: "RECON{33}",
    tags: ["buffer-overflow", "stack", "memory"],
  },
];
