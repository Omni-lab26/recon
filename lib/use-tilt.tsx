"use client";

import { useState, useCallback } from "react";

// サイト全体で統一する 3D ティルトカード演出。
// マウス位置に応じてカードが傾き、ホバーで浮き上がり、カーソル位置に光が差す。
//
// 使い方:
//   const tilt = useTilt(accentColor);
//   <div {...tilt.handlers} style={{ ...tilt.style(baseStyle) }}>
//     {tilt.glow}
//     ...content...
//   </div>

export type TiltState = { rx: number; ry: number; mx: number; my: number; h: boolean };

const REST: TiltState = { rx: 0, ry: 0, mx: 50, my: 50, h: false };

export function useTilt(color: string, opts?: { max?: number; lift?: number; glowSize?: number }) {
  const max = opts?.max ?? 8;        // 最大傾き角(度)
  const lift = opts?.lift ?? 3;      // ホバー時の浮き上がり(px)
  const glowSize = opts?.glowSize ?? 360;

  const [s, setS] = useState<TiltState>(REST);

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setS({ rx: (px - 0.5) * max, ry: (0.5 - py) * max, mx: px * 100, my: py * 100, h: true });
  }, [max]);

  const onLeave = useCallback(() => setS(REST), []);

  const handlers = { onMouseMove: onMove, onMouseLeave: onLeave };

  // ベーススタイルに 3D 変形を合成する
  const style = (base: React.CSSProperties = {}): React.CSSProperties => ({
    ...base,
    transformStyle: "preserve-3d",
    transform: `perspective(800px) rotateX(${s.ry}deg) rotateY(${s.rx}deg) translateY(${s.h ? -lift : 0}px)`,
    transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), border-color 0.3s, box-shadow 0.3s",
    boxShadow: s.h ? `0 18px 44px ${color}24, 0 6px 16px rgba(10,10,15,0.05)` : (base.boxShadow ?? "0 1px 2px rgba(10,10,15,0.03)"),
  });

  // カーソル位置に追従する光。カード内の先頭に配置する。
  const glow = (
    <div aria-hidden style={{
      position: "absolute", inset: 0, opacity: s.h ? 1 : 0,
      transition: "opacity 0.3s", pointerEvents: "none", borderRadius: "inherit",
      background: `radial-gradient(${glowSize}px circle at ${s.mx}% ${s.my}%, ${color}1f, transparent 45%)`,
    }} />
  );

  return { handlers, style, glow, hovered: s.h, state: s };
}
