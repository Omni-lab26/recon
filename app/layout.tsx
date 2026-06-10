import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://recon-brown.vercel.app"),
  title: {
    default: "RECON — Reveal Every Crack, Own Networks.",
    template: "%s · RECON",
  },
  description:
    "倫理的ハッキングとセキュリティを、攻撃から防御まで実践で学ぶ。記事・CTF・ツール・ラボをひとつの場所で。Learn by breaking. Master by defending.",
  keywords: ["セキュリティ", "倫理的ハッキング", "CTF", "ペネトレーションテスト", "ethical hacking", "RECON", "サイバーセキュリティ学習"],
  authors: [{ name: "RECON" }],
  openGraph: {
    title: "RECON — Reveal Every Crack, Own Networks.",
    description: "Learn by breaking. Master by defending. 記事・CTF・ツール・ラボをひとつの場所で。",
    url: "https://recon-brown.vercel.app",
    siteName: "RECON",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RECON — Reveal Every Crack, Own Networks.",
    description: "Learn by breaking. Master by defending.",
    creator: "@recontech",
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
