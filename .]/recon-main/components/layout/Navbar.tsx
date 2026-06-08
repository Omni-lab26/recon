"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ReconLogo from "@/components/brand/ReconLogo";
import AuthMenu from "@/components/layout/AuthMenu";
import { C } from "@/lib/tokens";

const LINKS: [string, string][] = [
  ["/roadmap", "roadmap"],
  ["/ctf", "ctf"],
  ["/tools", "tools"],
  ["/cve", "cve"],
  ["/news", "news"],
  ["/glossary", "glossary"],
  ["/articles", "articles"],
  ["/lab", "lab"],
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <><line x1="4" y1="4" x2="18" y2="18" style={{ transition: "all 0.2s" }} /><line x1="18" y1="4" x2="4" y2="18" style={{ transition: "all 0.2s" }} /></>
      ) : (
        <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="3" y1="15" x2="19" y2="15" /></>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // パス変更でモバイルメニューを閉じる
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // メニュー開いている間はスクロールを止める
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 26px",
        background: scrolled || mobileOpen ? "rgba(255,255,255,0.9)" : "transparent",
        backdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled || mobileOpen ? "blur(20px) saturate(180%)" : "none",
        borderBottom: `1px solid ${scrolled || mobileOpen ? "var(--line)" : "transparent"}`,
        transition: "all 0.3s var(--ease)",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <ReconLogo size={18} />
        </Link>

        {/* desktop nav */}
        <div className="nav-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: pathname === href ? C.accent : "var(--ink-2)", textDecoration: "none", transition: "color 0.2s", fontWeight: pathname === href ? 600 : 400 }}>
                {label}
              </Link>
            ))}
          </div>
          <AuthMenu />
        </div>

        {/* mobile: AuthMenu + hamburger */}
        <div className="nav-mobile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AuthMenu />
          <button onClick={() => setMobileOpen(v => !v)} aria-label={mobileOpen ? "メニューを閉じる" : "メニューを開く"}
            style={{ background: "transparent", border: `1px solid ${C.line2}`, borderRadius: 9, padding: "6px 8px", cursor: "pointer", color: C.ink2, lineHeight: 0 }}>
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      <div style={{
        position: "fixed", top: 57, left: 0, right: 0, bottom: 0, zIndex: 49,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        transform: mobileOpen ? "translateY(0)" : "translateY(-110%)",
        opacity: mobileOpen ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
        overflowY: "auto",
        padding: "24px 26px 48px",
        pointerEvents: mobileOpen ? "auto" : "none",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 12px", borderRadius: 12, textDecoration: "none", background: pathname === href ? `${C.accent}0d` : "transparent", borderLeft: `3px solid ${pathname === href ? C.accent : "transparent"}`, transition: "all 0.15s" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: C.ink3, width: 14 }}>~/</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: pathname === href ? C.accent : C.ink, fontWeight: pathname === href ? 600 : 400 }}>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
