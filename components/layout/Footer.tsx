import Link from "next/link";
import { C, SITE } from "@/lib/tokens";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "プロダクト",
    links: [
      ["/roadmap", "ロードマップ"],
      ["/articles", "学習記事"],
      ["/ctf", "CTF問題集"],
      ["/tools", "ツール集"],
      ["/cve", "CVEデータベース"],
      ["/lab", "ハンズオンラボ"],
    ],
  },
  {
    title: "アカウント",
    links: [
      ["/login", "ログイン"],
      ["/signup", "新規登録"],
      ["/dashboard", "ダッシュボード"],
    ],
  },
  {
    title: "リンク",
    links: [
      ["#", "GitHub"],
      ["#", "X / Twitter"],
      ["#", "お問い合わせ"],
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.line}`, background: C.soft }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 32px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 18 }}>
              <span style={{ color: C.accent }}>&gt;_</span>
              <span style={{ color: C.ink }}>recon</span>
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, marginTop: 12, lineHeight: 1.6 }}>
              {SITE.tagline}
              <br />
              壊して学び、守って極める。
            </p>
          </div>

          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            {COLS.map((col) => (
              <div key={col.title}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, marginBottom: 14, letterSpacing: "0.05em" }}>
                  {col.title}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(([href, label]) => (
                    <li key={label}>
                      <Link href={href} style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, textDecoration: "none" }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.ink3 }}>
            © {new Date().getFullYear()} RECON · recon.tech
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.ink3 }}>
            Learn by breaking. Master by defending.
          </span>
        </div>
      </div>
    </footer>
  );
}
