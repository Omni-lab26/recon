// アバターのプリセット。クリックで選択。SVGなので拡大しても綺麗。
// 各プリセットは円形のグラデーション背景 + 中央の白いSVGアイコン。
// 値は profiles.avatar_url に "preset:terminal" のように保存される。

export type AvatarPreset = { key: string; label: string; c1: string; c2: string; svg: string };

const ICONS: Record<string, string> = {
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  ghost: '<path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>',
  bot: '<rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/>',
  crown: '<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7Z"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  { key: "terminal", label: "ターミナル", c1: "#00b87a", c2: "#06b6d4", svg: ICONS.terminal },
  { key: "shield",   label: "シールド",   c1: "#2b7fff", c2: "#8b5cf6", svg: ICONS.shield },
  { key: "key",      label: "キー",        c1: "#ff9f1c", c2: "#ff4d8d", svg: ICONS.key },
  { key: "eye",      label: "アイ",        c1: "#ff4d8d", c2: "#8b5cf6", svg: ICONS.eye },
  { key: "ghost",    label: "ゴースト",    c1: "#06b6d4", c2: "#2b7fff", svg: ICONS.ghost },
  { key: "bot",      label: "ボット",      c1: "#06b6d4", c2: "#00b87a", svg: ICONS.bot },
  { key: "crown",    label: "クラウン",    c1: "#ff9f1c", c2: "#ffd166", svg: ICONS.crown },
  { key: "flame",    label: "フレイム",    c1: "#ff4d8d", c2: "#ff9f1c", svg: ICONS.flame },
  { key: "bolt",     label: "ボルト",      c1: "#ffd166", c2: "#ff9f1c", svg: ICONS.bolt },
  { key: "star",     label: "スター",      c1: "#ff9f1c", c2: "#ff4d8d", svg: ICONS.star },
  { key: "code",     label: "コード",      c1: "#2b7fff", c2: "#06b6d4", svg: ICONS.code },
  { key: "globe",    label: "グローブ",    c1: "#00b87a", c2: "#2b7fff", svg: ICONS.globe },
];

export const getPreset = (key: string) => AVATAR_PRESETS.find((p) => p.key === key);

// avatar_url を解釈する
export type AvatarKind =
  | { kind: "initial" }
  | { kind: "preset"; preset: AvatarPreset }
  | { kind: "image"; url: string };

export function parseAvatar(url: string | null | undefined): AvatarKind {
  if (!url) return { kind: "initial" };
  if (url.startsWith("preset:")) {
    const p = getPreset(url.slice(7));
    return p ? { kind: "preset", preset: p } : { kind: "initial" };
  }
  return { kind: "image", url };
}
