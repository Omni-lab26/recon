"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/tokens";
import { Reveal } from "@/components/ui/motion";
import { createClient } from "@/lib/supabase/client";

const { accent: GREEN, blue: BLUE, purple: PURPLE, pink: PINK, ink: INK, ink2: INK2, ink3: INK3, line: LINE } = C;

type LoopStep = { t: string; en: string; glyph: string; c: string; d: string };
const STEPS: LoopStep[] = [
  { t: "理解する", en: "understand", glyph: "#", c: BLUE, d: "攻撃の仕組みと狙いを知る" },
  { t: "試す", en: "practice", glyph: "▶", c: GREEN, d: "隔離環境で実際に攻撃を体験" },
  { t: "守る", en: "defend", glyph: "✓", c: PINK, d: "自分でその穴を塞ぐ" },
];

function LoopShowcase() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 3), 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <div className="loop">
        {STEPS.map((s, i) => (
          <div key={s.en} style={{ display: "contents" }}>
            <div style={{ width: 200, background: C.bg, border: `1px solid ${active === i ? s.c + "88" : LINE}`, borderRadius: 16, padding: "22px 20px", textAlign: "center", transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)", transform: active === i ? "translateY(-6px)" : "translateY(0)", boxShadow: active === i ? `0 16px 36px ${s.c}26` : "0 1px 2px rgba(10,10,15,0.03)" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 12px", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 20, color: active === i ? "#fff" : INK3, background: active === i ? `linear-gradient(135deg, ${s.c}, ${s.c}aa)` : "#f4f4f7", transition: "all 0.5s", transform: active === i ? "scale(1.1)" : "scale(1)", boxShadow: active === i ? `0 6px 16px ${s.c}55` : "none" }}>{s.glyph}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: s.c, marginBottom: 4 }}>0{i + 1} · {s.en}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: INK, letterSpacing: "-0.01em" }}>{s.t}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: INK2, marginTop: 6, lineHeight: 1.5 }}>{s.d}</div>
            </div>
            {i < STEPS.length - 1 && <div className="loparr" style={{ display: "flex", alignItems: "center", padding: "0 8px", fontFamily: "var(--font-mono)", fontSize: 20, color: active === i ? STEPS[i + 1].c : INK3, transition: "color 0.4s" }}>→</div>}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 12, color: INK3 }}>↻ くり返して、強くなる</div>
    </div>
  );
}

export default function LoopCTA() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session?.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${LINE}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "104px 24px" }}>
        <Reveal>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", padding: "70px 30px", textAlign: "center", background: `linear-gradient(135deg, ${GREEN}0f, ${BLUE}0d 45%, ${PURPLE}0f)`, border: `1px solid ${LINE}` }}>
            <div aria-hidden style={{ position: "absolute", top: "-40%", left: "50%", width: 560, height: 360, transform: "translateX(-50%)", background: `radial-gradient(circle, ${GREEN}1f, transparent 62%)`, filter: "blur(50px)", animation: "aur1 18s ease-in-out infinite" }} />
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ marginBottom: 44 }}>
                <LoopShowcase />
              </div>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "clamp(30px, 5vw, 48px)", color: INK, margin: 0, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
                相手を知り、<span className="grad-text">己を守れ。</span>
              </h2>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: INK2, maxWidth: 480, margin: "20px auto 0", lineHeight: 1.6 }}>
                {signedIn
                  ? <>今日も、一歩進もう。<br />ロードマップから、CTFから、好きなところから。</>
                  : <>攻撃を理解し、安全な環境で試し、自分で守る。<br />その全部が、ここにある。</>}
              </p>
              <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                {signedIn === null ? (
                  // 認証状態判定中は同サイズのプレースホルダー（レイアウトずれ防止）
                  <span style={{ height: 40, width: 200, display: "inline-block" }} aria-hidden />
                ) : signedIn ? (
                  <>
                    <a href="/roadmap" className="btn-primary">ロードマップへ →</a>
                    <a href="/ctf" className="btn-ghost">CTFに挑む</a>
                  </>
                ) : (
                  <a href="/login" className="btn-primary">無料で始める →</a>
                )}
              </div>
              {!signedIn && signedIn !== null && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: INK3, marginTop: 16 }}>メール1通でログイン · パスワード不要</div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
