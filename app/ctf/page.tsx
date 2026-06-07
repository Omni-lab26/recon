import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import CTFList from "@/components/sections/CTFList";
import { PageLabel } from "@/components/ui/PageLabel";
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
          <PageLabel label="ctf" description="Web・Crypto・Pwn の練習問題に挑戦" color={C.purple} />
        </Reveal>
        <Reveal>
          <CTFList />
        </Reveal>
      </section>
    </main>
  );
}
