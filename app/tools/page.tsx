import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import ToolsList from "@/components/sections/ToolsList";
import { C } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "ツール集",
  description: "セキュリティの定番ツールを用途別に。コマンド例・インストール・対応ロードマップ付き。nmap, Burp, Metasploit ほか。",
};

export default function ToolsPage() {
  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 24px 90px" }}>
        <Reveal>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, color: C.cyan, background: `${C.cyan}10`, border: `1px solid ${C.cyan}2e`, padding: "5px 12px", borderRadius: 100, marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan }} />// tools
          </span>
        </Reveal>
        <Reveal>
          <ToolsList />
        </Reveal>
      </section>
    </main>
  );
}
