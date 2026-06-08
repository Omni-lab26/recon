# RECON

> **Reveal Every Crack, Own Networks.**
> Learn by breaking. Master by defending.

倫理的ハッキング・セキュリティ学習プラットフォーム。
記事・CTF・ツール・CVE・ハンズオンラボを、ひとつの場所で。

これは **土台（共通基盤）** です。プロジェクトの器とブランド/デザイントークンが入っています。
トップページの本実装・各ページ・ターミナル機能はこの上に積み上げます。

---

## 技術スタック

- **Next.js 14**（App Router）/ **TypeScript**
- **Tailwind CSS**（デザイントークンは CSS 変数 + Tailwind テーマの二本立て）
- **next/font**: Inter（本文・見出し）/ JetBrains Mono（コード・ロゴ）

## セットアップ

```bash
npm install
npm run dev
# http://localhost:3000
```

`npm run dev` を実行して、トップに `>_recon` ロゴ（起動キャレット付き）と
タグラインが表示されれば土台OKです。

---

## 含まれているもの

```
recon/
├── app/
│   ├── layout.tsx        # フォント読込・メタデータ・Navbar/Footer
│   ├── globals.css       # デザイントークン・キーフレーム・ユーティリティ
│   └── page.tsx          # 最小トップ（土台確認用）
├── components/
│   ├── brand/ReconLogo.tsx     # 起動キャレット付きロゴ
│   ├── layout/Navbar.tsx       # スクロール追従ナビ
│   ├── layout/Footer.tsx       # フッター
│   └── ui/Aurora.tsx           # オーロラ背景
├── lib/
│   └── tokens.ts         # 色・グラデーション・サイト情報（TS定数）
└── （各種設定ファイル）
```

## デザイントークン

色は `app/globals.css` の CSS 変数が正。`lib/tokens.ts` はその TS ミラー。

| 用途 | CSS変数 | Tailwind | 値 |
|------|---------|----------|-----|
| アクセント（緑・主軸） | `--accent` | `text-accent` | `#00b87a` |
| シアン | `--accent-cyan` | `text-accent-cyan` | `#06b6d4` |
| ブルー | `--accent-blue` | `text-accent-blue` | `#2b7fff` |
| パープル | `--accent-purple` | `text-accent-purple` | `#8b5cf6` |
| ピンク | `--accent-pink` | `text-accent-pink` | `#ff4d8d` |
| アンバー | `--accent-amber` | `text-accent-amber` | `#ff9f1c` |

グラデーション文字は `.grad-text`、ボタンは `.btn-primary` / `.btn-ghost`。

---

## 想定ドメイン

`recon.tech`
