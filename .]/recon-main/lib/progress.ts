// 学習進捗のサーバー/共通ヘルパー
import { FIELDS } from "@/lib/roadmap-data";
import { ARTICLES } from "@/lib/articles-data";

export type ProgressKind = "roadmap" | "article";
export type ProgressRow = { kind: string; item_id: string; completed_at: string };

export const ROADMAP_TOTAL = FIELDS.reduce((acc, f) => acc + f.steps.length, 0);
export const ARTICLE_TOTAL = ARTICLES.length;

// 日付を YYYY-MM-DD に(タイムゾーン込み)
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 連続学習日数。今日 or 昨日に完了があれば、そこから連続している日数を返す。
export function computeStreak(timestamps: string[], now: Date = new Date()): number {
  if (timestamps.length === 0) return 0;
  const days = new Set(timestamps.map((t) => ymd(new Date(t))));
  const today = ymd(now);
  const yest = ymd(new Date(now.getTime() - 86400000));
  let cursor: Date;
  if (days.has(today)) cursor = new Date(now);
  else if (days.has(yest)) cursor = new Date(now.getTime() - 86400000);
  else return 0;

  let n = 0;
  while (days.has(ymd(cursor))) {
    n++;
    cursor = new Date(cursor.getTime() - 86400000);
  }
  return n;
}

// 分野ごとの完了数を { linux: 3, net: 1, ... } の形で返す
export function roadmapByField(rows: ProgressRow[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const f of FIELDS) map[f.key] = 0;
  for (const r of rows) {
    if (r.kind !== "roadmap") continue;
    const fieldKey = r.item_id.split(":")[0];
    if (fieldKey in map) map[fieldKey]++;
  }
  return map;
}

export function countByKind(rows: ProgressRow[]): { roadmap: number; article: number } {
  let roadmap = 0, article = 0;
  for (const r of rows) {
    if (r.kind === "roadmap") roadmap++;
    else if (r.kind === "article") article++;
  }
  return { roadmap, article };
}

// 最近の活動(新しい順)に整形
export type ActivityItem = { kind: ProgressKind; item_id: string; completed_at: string; label: string; color: string; href: string };

export function recentActivity(rows: ProgressRow[], limit = 5): ActivityItem[] {
  const sorted = [...rows].sort((a, b) => b.completed_at.localeCompare(a.completed_at)).slice(0, limit);
  return sorted.map((r) => {
    if (r.kind === "roadmap") {
      const [fieldKey, idxStr] = r.item_id.split(":");
      const f = FIELDS.find((x) => x.key === fieldKey);
      const idx = Number(idxStr);
      const step = f?.steps[idx];
      return {
        kind: "roadmap" as const, item_id: r.item_id, completed_at: r.completed_at,
        label: step ? `${f!.name} · ${step.t}` : r.item_id,
        color: f?.c ?? "#9a9aa5", href: `/roadmap#${fieldKey}`,
      };
    }
    if (r.kind === "article") {
      const a = ARTICLES.find((x) => x.slug === r.item_id);
      return {
        kind: "article" as const, item_id: r.item_id, completed_at: r.completed_at,
        label: a ? `記事 · ${a.title}` : `記事 · ${r.item_id}`,
        color: a?.c ?? "#2b7fff", href: a ? `/articles/${a.slug}` : "/articles",
      };
    }
    return { kind: "article" as const, item_id: r.item_id, completed_at: r.completed_at, label: r.item_id, color: "#9a9aa5", href: "/" };
  });
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "たった今";
  if (m < 60) return `${m}分前`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}時間前`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}日前`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}ヶ月前`;
  return `${Math.floor(d / 365)}年前`;
}
