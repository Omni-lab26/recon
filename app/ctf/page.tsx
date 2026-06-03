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
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.purple, background: `${C.purple}10`, border: `1px solid ${C.purple}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple }} />// ctf
          </span>
        </Reveal>
        <Reveal>
          <CTFList />
        </Reveal>
      </section>
    </main>
  );
}
