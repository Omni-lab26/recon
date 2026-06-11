// ロードマップのデータ。各分野は L1..L5 の5ステップ（一本道）。
// step.topics に個別トピックを入れると展開時にリスト表示される。
// 各ステップに学習トピックの目次を用意。今後トピックごとの記事を追加予定。

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
      { t: "ターミナル入門", tag: "記事", topics: ["シェルとは何か（bash / zsh）", "ファイルとディレクトリの操作（ls, cd, cp, mv）", "パイプとリダイレクト（| > >> <）", "標準入出力と環境変数（PATH, HOME）"] },
      { t: "ファイルと権限", tag: "記事", topics: ["パーミッションの読み方（rwx / 数値表記）", "所有者とグループ（chown, chmod）", "SUID / SGID とスティッキービット", "rootと一般ユーザーの境界"] },
      { t: "シェルスクリプト", tag: "演習", topics: ["変数・条件分岐・ループ", "コマンド置換とexit code", "grep / sed / awk によるテキスト処理", "cron による定期実行"] },
      { t: "サービスと設定の悪用", tag: "演習", topics: ["systemd とサービス管理", "設定ミスの発見（弱い権限・平文の鍵）", "PATH ハイジャックと環境変数の悪用", "ログから攻撃の痕跡を追う"] },
      { t: "カーネル権限昇格", tag: "CTF", topics: ["権限昇格の全体像（enumeration）", "SUIDバイナリと GTFOBins", "カーネル脆弱性とエクスプロイト", "linpeas など自動化ツールの活用"] },
    ],
  },
  {
    key: "net", name: "ネットワーク", glyph: "◇", c: "#06b6d4", desc: "パケットの旅を理解する。",
    steps: [
      { t: "ネットワークとは", tag: "記事", topics: ["OSI 参照モデルと TCP/IP 階層", "IPアドレスとサブネット", "ポートとサービスの対応", "ルーティングの基本"] },
      { t: "TCP/IP の仕組み", tag: "記事", topics: ["TCP 3ウェイハンドシェイク", "UDP との違いと使い分け", "DNS による名前解決", "HTTP / HTTPS の通信フロー"] },
      { t: "Nmap で探索", tag: "ツール", topics: ["ホスト発見（ping スキャン）", "ポートスキャンの種類（SYN / connect）", "サービス・バージョン検出（-sV）", "NSE スクリプトによる深掘り"] },
      { t: "トラフィック解析", tag: "演習", topics: ["Wireshark の基本操作", "パケットのフィルタリング", "平文プロトコルからの情報抽出", "不審な通信パターンの発見"] },
      { t: "中間者攻撃・プロトコル悪用", tag: "CTF", topics: ["ARP スプーフィングの原理", "DNS スプーフィングと偽装", "SSL ストリッピング", "防御策（暗号化・証明書検証）"] },
    ],
  },
  {
    key: "web", name: "Web セキュリティ", glyph: "</>", c: "#2b7fff", desc: "最も実戦的で、入口に最適。",
    steps: [
      { t: "Web の仕組み", tag: "記事", topics: ["クライアント・サーバーモデル", "リクエストとレスポンスの構造", "Cookie とセッション管理", "同一オリジンポリシー（SOP）"] },
      { t: "HTTP と改ざん", tag: "記事", topics: ["HTTPメソッドとステータスコード", "ヘッダーの役割と改ざん", "開発者ツールでの通信観察", "プロキシによるリクエスト書き換え"] },
      { t: "XSS / SQLi", tag: "演習", topics: ["XSS の3種類（反射 / 格納 / DOM）", "SQLインジェクションの原理", "入力値検証とサニタイズ", "プリペアドステートメントによる防御"] },
      { t: "Burp で複合攻撃", tag: "ツール", topics: ["Burp Suite の構成（Proxy / Repeater）", "Intruder による総当たり", "CSRF / SSRF の悪用", "複数脆弱性の連鎖（chaining）"] },
      { t: "認証バイパスで侵入完遂", tag: "CTF", topics: ["認証と認可の違い", "JWT の改ざんと検証不備", "IDOR（権限のない参照）", "侵入後の影響範囲の評価"] },
    ],
  },
  {
    key: "crypto", name: "暗号", glyph: "#", c: "#8b5cf6", desc: "数学的な弱点を突く。",
    steps: [
      { t: "暗号の基礎", tag: "記事", topics: ["共通鍵暗号と公開鍵暗号", "暗号化・復号・鍵の概念", "エンコードと暗号化の違い（Base64等）", "暗号が破られる理由"] },
      { t: "ハッシュと衝突", tag: "記事", topics: ["ハッシュ関数の性質（一方向性）", "MD5 / SHA とその用途", "レインボーテーブルとソルト", "衝突攻撃の考え方"] },
      { t: "古典暗号を解く", tag: "演習", topics: ["シーザー暗号と換字式暗号", "頻度分析による解読", "ヴィジュネル暗号", "XOR 暗号と既知平文攻撃"] },
      { t: "RSA への攻撃", tag: "CTF", topics: ["RSA の数学的基礎（素因数分解）", "小さい素数・弱い鍵の脆弱性", "共通モジュラス攻撃", "padding oracle 攻撃の概要"] },
      { t: "実装の弱点で解読 (乱数 / SCA)", tag: "CTF", topics: ["疑似乱数生成器（PRNG）の弱点", "シード予測と再現", "サイドチャネル攻撃（SCA）入門", "タイミング攻撃の原理"] },
    ],
  },
  {
    key: "pwn", name: "Pwn / バイナリ", glyph: "!", c: "#ff4d8d", desc: "メモリの底を覗く。最難関。",
    steps: [
      { t: "アセンブリ入門", tag: "記事", topics: ["レジスタとメモリの基礎", "x86 / x64 の基本命令", "関数呼び出し規約（calling convention）", "gdb によるデバッグ入門"] },
      { t: "スタックの仕組み", tag: "記事", topics: ["スタックフレームの構造", "リターンアドレスの役割", "スタックの伸長方向", "ローカル変数とスタック配置"] },
      { t: "バッファオーバーフロー入門", tag: "演習", topics: ["バッファ境界を超える原因", "リターンアドレスの上書き", "シェルコードの注入", "NX / Stack Canary などの防御機構"] },
      { t: "ROP チェーン", tag: "演習", topics: ["ガジェットとは何か", "ROP による防御回避（DEP/NX）", "ret2libc 攻撃", "pwntools による自動化"] },
      { t: "ヒープ Exploit で任意コード実行", tag: "CTF", topics: ["ヒープメモリの管理構造", "use-after-free の悪用", "ヒープオーバーフロー", "tcache / fastbin 攻撃の概要"] },
    ],
  },
  {
    key: "forensic", name: "フォレンジック", glyph: "◎", c: "#ff9f1c", desc: "痕跡から真実を読む。",
    steps: [
      { t: "ログの読み方", tag: "記事", topics: ["Linux / Windows のログ種別", "認証ログから侵入を追う", "タイムスタンプの相関", "ログ改ざんの検出"] },
      { t: "ファイルシステム", tag: "記事", topics: ["ファイルシステムの構造（ext4 / NTFS）", "削除ファイルの復元原理", "メタデータとタイムライン解析", "隠しファイル・代替データストリーム"] },
      { t: "パケット復元", tag: "演習", topics: ["pcap ファイルの解析", "TCP ストリームの再構築", "転送ファイルの抽出", "暗号化通信の扱い"] },
      { t: "ディスク調査", tag: "演習", topics: ["ディスクイメージの取得（dd）", "ハッシュによる完全性検証", "カービングによるデータ抽出", "Autopsy / Sleuth Kit の活用"] },
      { t: "メモリ解析でマルウェア再現", tag: "CTF", topics: ["メモリダンプの取得", "Volatility による解析", "実行中プロセスの特定", "マルウェアの挙動再現"] },
    ],
  },
  {
    key: "osint", name: "Recon / OSINT", glyph: "◉", c: "#f4564a", desc: "偵察 — RECON の真髄。",
    steps: [
      { t: "OSINT 入門", tag: "記事", topics: ["OSINT とは何か・合法性の境界", "情報源の種類（公開DB・SNS・検索）", "受動的偵察と能動的偵察", "情報の信頼性評価"] },
      { t: "公開情報の収集", tag: "演習", topics: ["Google ドーキング（高度な検索演算子）", "WHOIS / DNS からの情報取得", "サブドメイン列挙", "漏洩情報・公開リポジトリの調査"] },
      { t: "攻撃面の特定", tag: "演習", topics: ["攻撃面（attack surface）の概念", "ポート・サービスの棚卸し", "技術スタックの特定（Wappalyzer等）", "Shodan による公開資産の発見"] },
      { t: "資産の相関分析", tag: "演習", topics: ["複数情報源の突き合わせ", "組織構造・人物の相関", "メタデータからの情報抽出", "可視化による全体像の把握"] },
      { t: "0day 候補に迫る", tag: "CVE", topics: ["既知CVEと未知脆弱性の境界", "バージョン情報からの脆弱性推定", "攻撃シナリオの構築", "責任ある開示（responsible disclosure）"] },
    ],
  },
];
