"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReconLogo from "@/components/brand/ReconLogo";

const LINKS: [string, string][] = [
  ["/roadmap", "roadmap"],
  ["/ctf", "ctf"],
  ["/tools", "tools"],
  ["/cve", "cve"],
  ["/lab", "lab"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 26px",
        background: scrolled ? "rgba(255,255,255,0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
        transition: "all 0.4s var(--ease)",
      }}
    >
      <Link href="/" style={{ textDecoration: "none" }}>
        <ReconLogo size={18} />
      </Link>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <div className="nav-links" style={{ display: "flex", gap: 22, alignItems: "center" }}>
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--ink-2)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link href="/signup" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9 }}>
          今すぐ始める
        </Link>
      </div>
    </nav>
  );
}
