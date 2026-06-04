"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const onLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.refresh();
  };

  if (!ready) {
    // 認証状態確認中。ガタつきを避けるため同じ幅の placeholder を出す。
    return <span style={{ width: 88, height: 32, display: "inline-block" }} aria-hidden />;
  }

  if (!email) {
    return (
      <Link href="/login" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 9 }}>
        ログイン
      </Link>
    );
  }

  const initial = email[0]?.toUpperCase() ?? "?";

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)} aria-label="メニュー" aria-expanded={open}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 5px", borderRadius: 100, border: "1px solid var(--line-2)", background: "var(--bg)", cursor: "pointer", transition: "all 0.2s" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-cyan))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}>{initial}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink-2)" }}>▾</span>
      </button>
      {open && (
        <div role="menu" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 220, background: "var(--bg)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 14px 40px rgba(10,10,15,0.12)", padding: 6, zIndex: 60, animation: "modalIn 0.16s ease both" }}>
          <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-3)", marginBottom: 3, letterSpacing: 0.5 }}>SIGNED IN AS</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink)", wordBreak: "break-all" }}>{email}</div>
          </div>
          <Link href="/dashboard" onClick={() => setOpen(false)}
            style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 7, textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)", marginTop: 4 }}>
            ダッシュボード
          </Link>
          <button onClick={onLogout}
            style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)" }}>
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
