// ツール集のデータ。一覧 + 解説ページ(/tools/[id])で共用。
// docs/解説は RECON 内の解説ページに繋ぐ。

export type ToolCatKey = "recon" | "scan" | "web" | "exploit" | "password" | "forensic";

export const TOOL_CATS: Record<ToolCatKey, { name: string; glyph: string; c: string }> = {
  recon: { name: "情報収集", glyph: "◉", c: "#f4564a" },
  scan: { name: "スキャン", glyph: "◇", c: "#06b6d4" },
  web: { name: "Web攻撃", glyph: "</>", c: "#2b7fff" },
  exploit: { name: "エクスプロイト", glyph: "!", c: "#ff4d8d" },
  password: { name: "パスワード", glyph: "#", c: "#8b5cf6" },
  forensic: { name: "フォレンジック", glyph: "◎", c: "#ff9f1c" },
};

export type Tool = {
  id: string;
  name: string;
  cat: ToolCatKey;
  kali: boolean;
  star: number;
  featured?: boolean;
  desc: string;       // 一覧用の一言
  long: string;       // 解説ページ: これは何か
  how: string;        // 解説ページ: どう動くか
  tags: string[];
  install: string;
  roadmap: { field: string; fieldKey: string; step: string };
  terms: string[];    // 関連する glossary 用語id
  basic: string[];
  advanced: string[];
};

export const TOOLS: Tool[] = [
  {
    id: "nmap", name: "Nmap", cat: "scan", kali: true, star: 3, featured: true,
    desc: "ネットワーク探索とポートスキャンの絶対的定番。",
    long: "Nmap(Network Mapper)は、ネットワーク上にどんなホストが存在し、どのポートが開いていて、何のサービスが動いているかを調べるスキャナ。攻撃でも防御でも、最初の偵察(Recon)でほぼ必ず使われる定番中の定番。",
    how: "対象に特殊なパケットを送り、その応答の有無や内容からポートの開閉・サービスの種類・OSを推定する。NSE(Nmap Scripting Engine)を使えば、脆弱性チェックなどの拡張スキャンも行える。",
    tags: ["Recon", "Network", "CLI"], install: "sudo apt install nmap", roadmap: { field: "ネットワーク", fieldKey: "net", step: "L3 Nmap で探索" }, terms: ["network", "osint", "pentest"],
    basic: ["nmap target.com", "nmap -sV -p- target.com"],
    advanced: ["nmap -sC -A 10.0.0.5", "nmap --script vuln target.com", "nmap -sS -T4 -Pn target"],
  },
  {
    id: "burp", name: "Burp Suite", cat: "web", kali: true, star: 3,
    desc: "Webアプリ診断のためのプロキシ統合環境。",
    long: "Burp Suite は、ブラウザとWebサーバーの間に割り込んでHTTP通信を捕捉・改ざんできるプロキシ統合環境。Webアプリ診断の業界標準で、手動テストの中心になる。",
    how: "ブラウザのプロキシをBurpに向けると、すべてのリクエスト/レスポンスがBurpを経由する。捕捉した通信を Repeater で書き換えて再送したり、Intruder で大量のパターンを自動試行したりできる。",
    tags: ["Web", "Proxy", "GUI"], install: "# Kaliに標準搭載 (burpsuite)", roadmap: { field: "Web", fieldKey: "web", step: "L4 Burp で複合攻撃" }, terms: ["web", "xss", "sqli"],
    basic: ["# Proxy → Intercept で通信を捕捉"],
    advanced: ["# Repeater で改ざんして再送", "# Intruder で総当たり"],
  },
  {
    id: "msf", name: "Metasploit", cat: "exploit", kali: true, star: 3,
    desc: "エクスプロイト開発・実行のフレームワーク。",
    long: "Metasploit は、既知の脆弱性に対するエクスプロイト(攻撃コード)を多数収録したフレームワーク。脆弱性の検証から侵入後の操作までを一貫して扱える。",
    how: "「どのエクスプロイトを使うか(use)」「対象は誰か(set RHOSTS)」「何を実行するか(payload)」を順に設定して実行する。成功すると Meterpreter などのセッションが得られ、対象を遠隔操作できる。",
    tags: ["Exploit", "Framework"], install: "sudo apt install metasploit-framework", roadmap: { field: "Pwn / バイナリ", fieldKey: "pwn", step: "L5 任意コード実行" }, terms: ["exploit", "rce", "payload"],
    basic: ["msfconsole -q", "search type:exploit smb"],
    advanced: ["use exploit/windows/smb/ms17_010", "set RHOSTS 10.0.0.5", "exploit"],
  },
  {
    id: "hashcat", name: "Hashcat", cat: "password", kali: true, star: 3,
    desc: "GPUで高速にハッシュをクラックする。",
    long: "Hashcat は、流出したパスワードのハッシュ値から元のパスワードを推測する(クラックする)ツール。GPUを使った圧倒的な速度が特徴で、現場で最もよく使われる。",
    how: "ハッシュは元に戻せないが、「候補のパスワードを片っ端からハッシュ化して、流出ハッシュと一致するか」を高速に試す。辞書攻撃・総当たり・ルールベースなど複数の戦略を持つ。",
    tags: ["Hash", "GPU"], install: "sudo apt install hashcat", roadmap: { field: "暗号", fieldKey: "crypto", step: "L3 古典暗号を解く" }, terms: ["hash", "bruteforce"],
    basic: ["hashcat -m 0 hash.txt rockyou.txt"],
    advanced: ["hashcat -m 1000 -a 3 hash.txt ?a?a?a?a", "hashcat --show hash.txt"],
  },
  {
    id: "sqlmap", name: "sqlmap", cat: "web", kali: true, star: 2,
    desc: "SQLインジェクションの自動検出・抽出。",
    long: "sqlmap は、WebアプリのSQLインジェクション脆弱性を自動で検出し、悪用してデータベースの中身を抽出できるツール。手作業だと膨大な試行を、自動化してくれる。",
    how: "URLやリクエストに様々なSQL断片を注入し、応答の違いから脆弱性の有無と種類を判定する。見つかれば、データベース名・テーブル・中身のダンプまで自動で進められる。",
    tags: ["SQLi", "Auto"], install: "sudo apt install sqlmap", roadmap: { field: "Web", fieldKey: "web", step: "L3 XSS / SQLi" }, terms: ["sqli", "web"],
    basic: ["sqlmap -u 'http://t/?id=1' --dbs"],
    advanced: ["sqlmap -u 'http://t/?id=1' -D db --tables", "sqlmap -r req.txt --batch --dump"],
  },
  {
    id: "gobuster", name: "Gobuster", cat: "recon", kali: true, star: 2,
    desc: "ディレクトリ・サブドメインの総当たり探索。",
    long: "Gobuster は、Webサーバーの隠れたディレクトリやファイル、サブドメインを総当たりで発見するツール。偵察段階で攻撃対象の全体像を広げるのに使う。",
    how: "単語リスト(wordlist)の各エントリをURLに当てはめてアクセスし、応答コードから「存在するパス」を炙り出す。Goで書かれており高速に動く。",
    tags: ["Brute", "Dir"], install: "sudo apt install gobuster", roadmap: { field: "Recon / OSINT", fieldKey: "osint", step: "L3 攻撃面の特定" }, terms: ["fuzzing", "web", "osint"],
    basic: ["gobuster dir -u http://t -w list.txt"],
    advanced: ["gobuster dns -d t.com -w sub.txt", "gobuster vhost -u http://t -w list.txt"],
  },
  {
    id: "wireshark", name: "Wireshark", cat: "forensic", kali: true, star: 3,
    desc: "パケットをキャプチャして解析する定番GUI。",
    long: "Wireshark は、ネットワークを流れるパケットを捕捉して中身を解析するGUIツール。通信の中で何が起きているかを「目で見る」ための定番。",
    how: "ネットワークインターフェースを流れるパケットをキャプチャし、プロトコルごとに分解して表示する。フィルタで特定の通信だけ抽出したり、TCPストリームを再構成して中身を読んだりできる。",
    tags: ["PCAP", "GUI"], install: "sudo apt install wireshark", roadmap: { field: "フォレンジック", fieldKey: "forensic", step: "L3 パケット復元" }, terms: ["network", "mitm", "forensic"],
    basic: ["wireshark -i eth0"],
    advanced: ["tshark -r cap.pcap -Y 'http'", "tshark -r cap.pcap -T fields -e ip.src"],
  },
  {
    id: "john", name: "John the Ripper", cat: "password", kali: true, star: 2,
    desc: "オフラインのパスワードハッシュ解析。",
    long: "John the Ripper は、パスワードハッシュをクラックする老舗ツール。多様なハッシュ形式に対応し、CPUベースで手軽に使えるのが強み。",
    how: "辞書・総当たり・ルール変換などでパスワード候補を生成し、ハッシュ化して照合する。Hashcatと並ぶ定番で、ハッシュ形式の自動判別が得意。",
    tags: ["Hash", "Crack"], install: "sudo apt install john", roadmap: { field: "暗号", fieldKey: "crypto", step: "L2 ハッシュと衝突" }, terms: ["hash", "bruteforce"],
    basic: ["john --wordlist=rockyou.txt hash.txt"],
    advanced: ["john --format=raw-md5 hash.txt", "john --show hash.txt"],
  },
  {
    id: "ffuf", name: "ffuf", cat: "recon", kali: false, star: 2,
    desc: "高速なWebファジング。",
    long: "ffuf(Fuzz Faster U Fool)は、Webに対して高速にファジング(大量の入力試行)を行うツール。ディレクトリ探索・パラメータ発見・サブドメイン列挙などに使う。",
    how: "URL内の FUZZ というキーワードを単語リストの各項目に置き換えて大量にリクエストし、応答の違い(ステータス・サイズ)から有効な入力を見つける。",
    tags: ["Fuzz", "Web"], install: "go install github.com/ffuf/ffuf/v2@latest", roadmap: { field: "Recon / OSINT", fieldKey: "osint", step: "L3 攻撃面の特定" }, terms: ["fuzzing", "web"],
    basic: ["ffuf -u http://t/FUZZ -w list.txt"],
    advanced: ["ffuf -u http://t/FUZZ -w list.txt -mc 200,301", "ffuf -u http://FUZZ.t.com -w sub.txt"],
  },
  {
    id: "nikto", name: "Nikto", cat: "scan", kali: true, star: 1,
    desc: "Webサーバの既知脆弱性スキャン。",
    long: "Nikto は、Webサーバーに対して既知の脆弱性や設定ミスを素早くスキャンするツール。広く浅く問題を洗い出す、初動向けのスキャナ。",
    how: "数千の既知の問題パターン(危険なファイル、古いソフトのバージョン、設定ミス)に対してリクエストを送り、該当するものを報告する。",
    tags: ["Web", "Scan"], install: "sudo apt install nikto", roadmap: { field: "Web", fieldKey: "web", step: "L2 HTTP と改ざん" }, terms: ["web", "vuln"],
    basic: ["nikto -h http://target.com"],
    advanced: ["nikto -h http://t -ssl", "nikto -h http://t -Tuning 9"],
  },
  {
    id: "volatility", name: "Volatility", cat: "forensic", kali: false, star: 2,
    desc: "メモリダンプからの証拠抽出。",
    long: "Volatility は、メモリダンプ(RAMのスナップショット)から、当時動いていたプロセスや通信、隠されたマルウェアなどを掘り起こすフォレンジックツール。",
    how: "メモリイメージを解析し、OSのデータ構造をたどってプロセス一覧・ネットワーク接続・コマンド履歴などを再構成する。ディスクに残らない痕跡を捉えられるのが強み。",
    tags: ["Memory", "DFIR"], install: "pip install volatility3", roadmap: { field: "フォレンジック", fieldKey: "forensic", step: "L5 メモリ解析でマルウェア再現" }, terms: ["forensic", "malware", "incident"],
    basic: ["vol.py -f mem.raw windows.pslist"],
    advanced: ["vol.py -f mem.raw windows.netscan", "vol.py -f mem.raw windows.malfind"],
  },
  {
    id: "hydra", name: "Hydra", cat: "password", kali: true, star: 2,
    desc: "オンラインのログイン総当たり。",
    long: "Hydra は、SSH・FTP・HTTP など各種サービスのログインを総当たりで突破しようとするオンライン攻撃ツール。多数のプロトコルに対応している。",
    how: "ユーザー名とパスワードの候補リストを組み合わせ、対象サービスへ実際にログインを試行し続ける。成功した組み合わせを報告する。",
    tags: ["Brute", "Login"], install: "sudo apt install hydra", roadmap: { field: "Web", fieldKey: "web", step: "L5 認証バイパスで侵入完遂" }, terms: ["bruteforce", "mfa"],
    basic: ["hydra -l admin -P pass.txt ssh://t"],
    advanced: ["hydra -L users.txt -P pass.txt ssh://t", "hydra -l admin -P pass.txt http-post-form '...'"],
  },
];
