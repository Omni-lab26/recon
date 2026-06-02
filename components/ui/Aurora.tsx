import { C } from "@/lib/tokens";

const BLOBS = [
  { top: "-8%", left: "16%", w: 600, h: 500, c: C.accent, o: 0.16, a: "aur1 22s ease-in-out infinite" },
  { top: "10%", left: "82%", w: 540, h: 500, c: C.blue, o: 0.14, a: "aur2 26s ease-in-out infinite" },
  { top: "48%", left: "12%", w: 560, h: 520, c: C.purple, o: 0.11, a: "aur3 24s ease-in-out infinite 1s" },
  { top: "70%", left: "80%", w: 540, h: 500, c: C.pink, o: 0.11, a: "aur1 28s ease-in-out infinite 2s" },
  { top: "88%", left: "44%", w: 560, h: 500, c: C.cyan, o: 0.12, a: "aur2 25s ease-in-out infinite 1.5s" },
];

function hex(o: number) {
  return Math.round(o * 255).toString(16).padStart(2, "0");
}

/** Soft, drifting aurora on white + a faint grid. Purely decorative. */
export default function Aurora() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            width: b.w,
            height: b.h,
            transform: "translate(-50%,-20%)",
            background: `radial-gradient(ellipse at center, ${b.c}${hex(b.o)} 0%, transparent 65%)`,
            filter: "blur(60px)",
            animation: b.a,
            willChange: "transform",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(10,10,15,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,15,0.02) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 120% 90% at 50% 30%, #000 35%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 120% 90% at 50% 30%, #000 35%, transparent 90%)",
        }}
      />
    </div>
  );
}
