// ラボのミッション定義。各ミッションは仮想ファイルシステムと目標・ヒント・フラグ判定を持つ。
// すべてシミュレーションで、実際の攻撃は行わない安全な学習環境。

export type FSNode =
  | { type: "dir"; children: Record<string, FSNode> }
  | { type: "file"; content: string };

export type Scenario = {
  id: string;
  field: string;
  fieldName: string;
  c: string;
  title: string;
  brief: string;
  goal: string;
  hints: string[];
  home: string;
  user: string;
  fs: () => FSNode;
  check: (flag: string) => boolean;
  success: string;
};

const dir = (children: Record<string, FSNode>): FSNode => ({ type: "dir", children });
const file = (content: string): FSNode => ({ type: "file", content });

const AUTH_LOG = [
  "Jan 12 03:11:02 srv sshd[2011]: Failed password for root from 91.240.118.22 port 51244 ssh2",
  "Jan 12 03:11:05 srv sshd[2013]: Failed password for root from 91.240.118.22 port 51251 ssh2",
  "Jan 12 03:11:09 srv sshd[2015]: Failed password for admin from 222.186.30.112 port 40122 ssh2",
  "Jan 12 03:12:44 srv sshd[2032]: Failed password for root from 185.220.101.47 port 60014 ssh2",
  "Jan 12 03:12:46 srv sshd[2034]: Failed password for root from 185.220.101.47 port 60019 ssh2",
  "Jan 12 03:12:49 srv sshd[2036]: Failed password for root from 185.220.101.47 port 60023 ssh2",
  "Jan 12 03:12:52 srv sshd[2038]: Failed password for root from 185.220.101.47 port 60031 ssh2",
  "Jan 12 03:12:55 srv sshd[2040]: Failed password for root from 185.220.101.47 port 60040 ssh2",
  "Jan 12 03:13:01 srv sshd[2042]: Failed password for admin from 222.186.30.112 port 40180 ssh2",
  "Jan 12 03:13:07 srv sshd[2044]: Failed password for root from 185.220.101.47 port 60052 ssh2",
  "Jan 12 03:13:11 srv sshd[2046]: Failed password for root from 91.240.118.22 port 51399 ssh2",
  "Jan 12 03:13:18 srv sshd[2048]: Failed password for root from 185.220.101.47 port 60061 ssh2",
  "Jan 12 03:13:25 srv sshd[2051]: Accepted password for root from 185.220.101.47 port 60077 ssh2",
  "Jan 12 03:13:25 srv sshd[2051]: pam_unix(sshd:session): session opened for user root by (uid=0)",
  "Jan 12 03:14:02 srv sshd[2060]: Failed password for admin from 222.186.30.112 port 40233 ssh2",
].join("\n");

export const SCENARIOS: Scenario[] = [
  {
    id: "recon-01", field: "osint", fieldName: "Recon / OSINT", c: "#f4564a",
    title: "隠れたファイルを暴け",
    brief: "サーバーに侵入し、ホームディレクトリに足がかりを得た。だが重要な情報は、目に見える場所には無い。",
    goal: "隠しファイルを見つけ、その中のフラグを submit せよ。",
    hints: ["ls だけでは見えないファイルがある。", "ドット(.)で始まるファイルは ls -a で表示される。", "cat .secret でフラグが読める。"],
    home: "/home/recon", user: "recon",
    fs: () => dir({ home: dir({ recon: dir({
      "readme.txt": file("ようこそ、ラボへ。\nこのマシンのどこかに隠しファイルがある。探し出せ。\n\nヒント: ls には隠れて見えないものがある。"),
      ".secret": file("RECON{hidden_in_plain_sight}\n\nこれがフラグだ。`submit RECON{...}` で提出せよ。"),
      notes: dir({ "todo.txt": file("- パスワードを変更する\n- .secret を削除する (まだやっていない…)") }),
    }) }) }),
    check: (f) => f.trim() === "RECON{hidden_in_plain_sight}",
    success: "正解。ドットで始まるファイルは通常の ls では隠れる。攻撃者も防御者も、まず『見えていないもの』を疑う。",
  },
  {
    id: "forensic-01", field: "forensic", fieldName: "フォレンジック", c: "#ff9f1c",
    title: "侵入者を特定せよ",
    brief: "あるサーバーが不正アクセスを受けた。認証ログには総当たり攻撃の痕跡が残っている。",
    goal: "ログを解析し、ログインに成功した攻撃者のIPアドレスを submit せよ。",
    hints: ["認証ログは /var/log/auth.log にある。", "grep で行を絞り込め。Failed と Accepted がある。", "grep Accepted /var/log/auth.log — 成功したIPが答え。"],
    home: "/home/analyst", user: "analyst",
    fs: () => dir({
      home: dir({ analyst: dir({ "mission.txt": file("auth.log に総当たり攻撃の痕跡がある。\n大量の失敗の中に、たった1つ『成功』が混じっている。\nログインに成功した攻撃者のIPを突き止め、submit せよ。") }) }),
      var: dir({ log: dir({ "auth.log": file(AUTH_LOG) }) }),
    }),
    check: (f) => f.trim() === "185.220.101.47",
    success: "正解。大量の Failed のあとに1つだけ Accepted — それが突破された瞬間だ。ログは嘘をつかない。",
  },
  {
    id: "crypto-01", field: "crypto", fieldName: "暗号", c: "#8b5cf6",
    title: "暗号を解け",
    brief: "通信を傍受したところ、エンコードされたメッセージが見つかった。中身を読み解け。",
    goal: "message.txt をデコードし、中のフラグを submit せよ。python が使える。",
    hints: ["これは『暗号』ではなく『エンコード』。誰でも戻せる。", "python を起動し、base64 モジュールを使え。", "import base64; print(base64.b64decode(open('message.txt').read()).decode())"],
    home: "/home/recon", user: "recon",
    fs: () => dir({ home: dir({ recon: dir({
      "readme.txt": file("message.txt は Base64 でエンコードされている。\nデコードして、中に隠れたフラグを submit せよ。\n\nヒント: `python` でPythonが使える。"),
      "message.txt": file("UkVDT057YmFzZTY0X2lzX25vdF9lbmNyeXB0aW9ufQ=="),
    }) }) }),
    check: (f) => f.trim() === "RECON{base64_is_not_encryption}",
    success: "正解。Base64 は暗号化ではなく単なる符号化で、鍵なしで誰でも復元できる。機密を守る手段にはならない。",
  },
  {
    id: "web-01", field: "web", fieldName: "Web セキュリティ", c: "#2b7fff",
    title: "設定ミスを見つけろ",
    brief: "Webサーバーの公開ディレクトリを調べている。開発者が置き忘れた設定ファイルがあるようだ。",
    goal: "公開領域に漏れているDBパスワードを見つけ、submit せよ。",
    hints: ["アプリは /var/www/app に置かれている。", "設定ファイル(.env や config)に認証情報が書かれていることが多い。", "grep -i password /var/www/app/.env"],
    home: "/home/recon", user: "recon",
    fs: () => dir({
      home: dir({ recon: dir({ "mission.txt": file("公開ディレクトリ /var/www/app に設定ファイルが残されている。\n外部から読めてしまう場所に、DBの認証情報が漏れている。\nそのパスワードを突き止め、submit せよ。") }) }),
      var: dir({ www: dir({ app: dir({
        "index.php": file("<?php require __DIR__.'/config.php'; echo 'RECON app'; ?>"),
        "config.php": file("<?php\n$DEBUG = true;\nrequire __DIR__.'/.env';\n// TODO: .env を公開領域の外に移す\n?>"),
        ".env": file("APP_NAME=recon-app\nAPP_ENV=production\nDB_HOST=127.0.0.1\nDB_USER=admin\nDB_PASSWORD=S3cr3t_Adm1n_2019\n"),
      }) }) }),
    }),
    check: (f) => f.trim() === "S3cr3t_Adm1n_2019",
    success: "正解。設定ファイルが公開領域にあると認証情報が丸見えになる。.env は必ず公開ディレクトリの外へ — これが鉄則。",
  },
];

export const getScenario = (id: string) => SCENARIOS.find((s) => s.id === id);
