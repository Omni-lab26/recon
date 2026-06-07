import type { Metadata } from "next";
import { Reveal } from "@/components/ui/motion";
import ToolsList from "@/components/sections/ToolsList";
import { PageLabel } from "@/components/ui/PageLabel";
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
          <PageLabel label="tools" description="Kali 標準ツールの解説と実用コマンド" color={C.cyan} />
        </Reveal>
        <Reveal>
          <ToolsList />
        </Reveal>
      </section>
    </main>
  );
}
