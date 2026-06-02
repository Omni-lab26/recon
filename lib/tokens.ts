// Single source of truth for palette in TS (mirrors the CSS variables in globals.css).
// Use these for inline styles / dynamic values; use Tailwind classes (text-accent etc.)
// or CSS vars (var(--accent)) elsewhere.

export const C = {
  bg: "#ffffff",
  soft: "#fbfbfd",
  ink: "#0a0a0b",
  ink2: "#52525b",
  ink3: "#9a9aa5",
  line: "#ececf1",
  line2: "#dcdce4",
  accent: "#00b87a",
  cyan: "#06b6d4",
  blue: "#2b7fff",
  purple: "#8b5cf6",
  pink: "#ff4d8d",
  amber: "#ff9f1c",
} as const;

export const GRAD = `linear-gradient(115deg, ${C.accent}, ${C.cyan}, ${C.blue}, ${C.purple})`;
export const GRAD_TEXT = `linear-gradient(100deg, ${C.accent}, ${C.cyan} 38%, ${C.blue} 68%, ${C.purple})`;

export const SITE = {
  name: "RECON",
  tagline: "Reveal Every Crack, Own Networks.",
  subcopy: "Learn by breaking. Master by defending.",
  url: "https://recon.tech",
} as const;
