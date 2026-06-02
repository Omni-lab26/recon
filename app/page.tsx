import Aurora from "@/components/ui/Aurora";
import { C } from "@/lib/tokens";

export default function Home() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Aurora />

      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <span className="badge fade-up d1">
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, display: "inline-block", animation: "pulse 2s infinite" }} />
          v2.0 — Ethical Hacking Platform
        </span>

        <h1
          className="fade-up d2"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "clamp(40px, 8vw, 88px)", lineHeight: 0.98, margin: "24px 0 0", color: C.ink, letterSpacing: "-0.04em" }}
        >
          Reveal Every Crack,
        </h1>
        <h1
          className="fade-up d3"
          style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "clamp(40px, 8vw, 88px)", lineHeight: 0.98, margin: "2px 0 0", letterSpacing: "-0.04em" }}
        >
          <span className="grad-text">Own Networks.</span>
        </h1>

        <p
          className="fade-up d4"
          style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 2vw, 19px)", color: C.ink2, maxWidth: 560, margin: "24px 0 0", lineHeight: 1.6 }}
        >
          Learn by <span style={{ color: C.pink, fontWeight: 500 }}>breaking</span>. Master by{" "}
          <span style={{ color: C.accent, fontWeight: 500 }}>defending</span>.
          <br />
          記事・CTF・ツール・ラボを、ひとつの場所で。
        </p>

        <div className="fade-up d5" style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/roadmap" className="btn-primary">ロードマップを見る →</a>
          <a href="/lab" className="btn-ghost">$ ./start-lab.sh</a>
        </div>

        <p className="fade-up d5" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, marginTop: 40 }}>
          // foundation ready — 土台OK。次はトップページの本実装へ。
        </p>
      </div>
    </main>
  );
}
