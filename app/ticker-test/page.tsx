import NewsTicker from "@/components/sections/NewsTicker";
import { C } from "@/lib/tokens";

export const metadata = { title: "Ticker Test" };

export default function TickerTest() {
  return (
    <main style={{ minHeight: "calc(100vh - 64px)", padding: "60px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto 40px", padding: "0 24px" }}>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em" }}>
          ニュースティッカー動作確認
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: C.ink2, marginTop: 10, lineHeight: 1.7 }}>
          下のバーにCISAの最新セキュリティ情報が横に流れれば成功です。ホバーで一時停止。各項目をクリックすると出典元（CISA公式）へ飛びます。
          <br />
          流れない／「取得できませんでした」と出る場合は、フィード元への接続を確認します（その時は画面の表示をそのまま伝えてください）。
        </p>
      </div>

      <NewsTicker />

      <div style={{ maxWidth: 1100, margin: "40px auto 0", padding: "0 24px" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3 }}>
          // API単体の確認: <a href="/api/feed" style={{ color: C.accent }}>/api/feed</a> を開くと、取得したJSON（ok / items）が見えます。
        </p>
      </div>
    </main>
  );
}
