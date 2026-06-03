// ツール集のデータ。サンプル + 後から増やせる器。
// docs/解説は RECON 内の解説ページ（準備中）に繋ぐ想定。

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
  star: number; // 1-3 定番度
  featured?: boolean;
  desc: string;
  tags: string[];
  install: string;
  roadmap: { field: string; step: string };
  basic: string[];
  advanced: string[];
};

export const TOOLS: Tool[] = [
  {
    id: "nmap", name: "Nmap", cat: "scan", kali: true, star: 3, featured: true,
    desc: "ネットワーク探索とポートスキャンの絶対的定番。",
    tags: ["Recon", "Network", "CLI"], install: "sudo apt install nmap", roadmap: { field: "ネットワーク", step: "L3 Nmap で探索" },
    basic: ["nmap target.com", "nmap -sV -p- target.com"],
    advanced: ["nmap -sC -A 10.0.0.5", "nmap --script vuln target.com", "nmap -sS -T4 -Pn target"],
  },
  {
    id: "burp", name: "Burp Suite", cat: "web", kali: true, star: 3,
    desc: "Webアプリ診断のためのプロキシ統合環境。",
    tags: ["Web", "Proxy", "GUI"], install: "# Kaliに標準搭載 (burpsuite)", roadmap: { field: "Web", step: "L4 Burp で複合攻撃" },
    basic: ["# Proxy → Intercept で通信を捕捉"],
    advanced: ["# Repeater で改ざんして再送", "# Intruder で総当たり"],
  },
  {
    id: "msf", name: "Metasploit", cat: "exploit", kali: true, star: 3,
    desc: "エクスプロイト開発・実行のフレームワーク。",
    tags: ["Exploit", "Framework"], install: "sudo apt install metasploit-framework", roadmap: { field: "Pwn / バイナリ", step: "L5 任意コード実行" },
    basic: ["msfconsole -q", "search type:exploit smb"],
    advanced: ["use exploit/windows/smb/ms17_010", "set RHOSTS 10.0.0.5", "exploit"],
  },
  {
    id: "hashcat", name: "Hashcat", cat: "password", kali: true, star: 3,
    desc: "GPUで高速にハッシュをクラックする。",
    tags: ["Hash", "GPU"], install: "sudo apt install hashcat", roadmap: { field: "暗号", step: "L3 古典暗号を解く" },
    basic: ["hashcat -m 0 hash.txt rockyou.txt"],
    advanced: ["hashcat -m 1000 -a 3 hash.txt ?a?a?a?a", "hashcat --show hash.txt"],
  },
  {
    id: "sqlmap", name: "sqlmap", cat: "web", kali: true, star: 2,
    desc: "SQLインジェクションの自動検出・抽出。",
    tags: ["SQLi", "Auto"], install: "sudo apt install sqlmap", roadmap: { field: "Web", step: "L3 XSS / SQLi" },
    basic: ["sqlmap -u 'http://t/?id=1' --dbs"],
    advanced: ["sqlmap -u 'http://t/?id=1' -D db --tables", "sqlmap -r req.txt --batch --dump"],
  },
  {
    id: "gobuster", name: "Gobuster", cat: "recon", kali: true, star: 2,
    desc: "ディレクトリ・サブドメインの総当たり探索。",
    tags: ["Brute", "Dir"], install: "sudo apt install gobuster", roadmap: { field: "Recon / OSINT", step: "L3 攻撃面の特定" },
    basic: ["gobuster dir -u http://t -w list.txt"],
    advanced: ["gobuster dns -d t.com -w sub.txt", "gobuster vhost -u http://t -w list.txt"],
  },
  {
    id: "wireshark", name: "Wireshark", cat: "forensic", kali: true, star: 3,
    desc: "パケットをキャプチャして解析する定番GUI。",
    tags: ["PCAP", "GUI"], install: "sudo apt install wireshark", roadmap: { field: "フォレンジック", step: "L3 パケット復元" },
    basic: ["wireshark -i eth0"],
    advanced: ["tshark -r cap.pcap -Y 'http'", "tshark -r cap.pcap -T fields -e ip.src"],
  },
  {
    id: "john", name: "John the Ripper", cat: "password", kali: true, star: 2,
    desc: "オフラインのパスワードハッシュ解析。",
    tags: ["Hash", "Crack"], install: "sudo apt install john", roadmap: { field: "暗号", step: "L2 ハッシュと衝突" },
    basic: ["john --wordlist=rockyou.txt hash.txt"],
    advanced: ["john --format=raw-md5 hash.txt", "john --show hash.txt"],
  },
  {
    id: "ffuf", name: "ffuf", cat: "recon", kali: false, star: 2,
    desc: "高速なWebファジング。",
    tags: ["Fuzz", "Web"], install: "go install github.com/ffuf/ffuf/v2@latest", roadmap: { field: "Recon / OSINT", step: "L3 攻撃面の特定" },
    basic: ["ffuf -u http://t/FUZZ -w list.txt"],
    advanced: ["ffuf -u http://t/FUZZ -w list.txt -mc 200,301", "ffuf -u http://FUZZ.t.com -w sub.txt"],
  },
  {
    id: "nikto", name: "Nikto", cat: "scan", kali: true, star: 1,
    desc: "Webサーバの既知脆弱性スキャン。",
    tags: ["Web", "Scan"], install: "sudo apt install nikto", roadmap: { field: "Web", step: "L2 HTTP と改ざん" },
    basic: ["nikto -h http://target.com"],
    advanced: ["nikto -h http://t -ssl", "nikto -h http://t -Tuning 9"],
  },
  {
    id: "volatility", name: "Volatility", cat: "forensic", kali: false, star: 2,
    desc: "メモリダンプからの証拠抽出。",
    tags: ["Memory", "DFIR"], install: "pip install volatility3", roadmap: { field: "フォレンジック", step: "L5 メモリ解析でマルウェア再現" },
    basic: ["vol.py -f mem.raw windows.pslist"],
    advanced: ["vol.py -f mem.raw windows.netscan", "vol.py -f mem.raw windows.malfind"],
  },
  {
    id: "hydra", name: "Hydra", cat: "password", kali: true, star: 2,
    desc: "オンラインのログイン総当たり。",
    tags: ["Brute", "Login"], install: "sudo apt install hydra", roadmap: { field: "Web", step: "L5 認証バイパスで侵入完遂" },
    basic: ["hydra -l admin -P pass.txt ssh://t"],
    advanced: ["hydra -L users.txt -P pass.txt ssh://t", "hydra -l admin -P pass.txt http-post-form '...'"],
  },
];
