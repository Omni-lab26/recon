import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import CTFList from "@/components/sections/CTFList";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "CTF問題集",
  description: "分野×難易度で選ぶCTF問題集。Web・Crypto・Pwn・Forensic・Network・OSINT。解いて実戦力を積み上げる。",
};

export default function CTFPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ textAlign: "center", padding: "56px 24px 8px", maxWidth: 880, margin: "0 auto" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.purple, background: `${C.purple}10`, border: `1px solid ${C.purple}2e`, padding: "5px 12px", borderRadius: 100 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple }} />// ctf
          </span>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "clamp(32px, 5.5vw, 52px)", color: C.ink, margin: "16px 0 0", lineHeight: 1.06, letterSpacing: "-0.035em" }}>
            解いて、<span className="grad-text">強くなる</span>
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15.5, color: C.ink2, maxWidth: 500, margin: "14px auto 0", lineHeight: 1.6 }}>
            分野×難易度で選ぶCTF問題集。1問ずつ、実戦力を積み上げよう。
          </p>
        </Reveal>
      </section>

      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 90px" }}>
        <Reveal>
          <CTFList />
        </Reveal>
      </section>
    </main>
  );
}
