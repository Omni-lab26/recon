import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

// 公的機関(CISA)の一次ソースのみを使用。
// 見出し(title)・日付・出典元リンクのみ抽出し、本文は転載しない。
const FEEDS: { url: string; source: string; kind: "news" | "cve" }[] = [
  { url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", source: "CISA", kind: "news" },
  { url: "https://www.cisa.gov/cybersecurity-advisories/ics-advisories.xml", source: "CISA ICS", kind: "cve" },
];

export type TickerItem = {
  title: string;
  link: string;
  date: string | null;
  source: string;
  kind: "news" | "cve";
  severity: "critical" | "high" | "medium" | "info";
};

// タイトル文字列から重大度を推定（バッジ表示用。あくまでヒューリスティック）
function guessSeverity(title: string): TickerItem["severity"] {
  const t = title.toLowerCase();
  if (t.includes("critical") || t.includes("actively exploited") || t.includes("emergency")) return "critical";
  if (t.includes("high") || t.includes("exploit") || t.includes("ransomware") || t.includes("rce")) return "high";
  if (t.includes("medium") || t.includes("advisory")) return "medium";
  return "info";
}

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

async function fetchFeed(feed: (typeof FEEDS)[number]): Promise<TickerItem[]> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "RECON/1.0 (security learning platform)" },
    // 8時間キャッシュ = 1日3回更新相当（朝・昼・夜）。本番では cron で時刻固定する。
    next: { revalidate: 28800 },
  });
  if (!res.ok) throw new Error(`${feed.source}: ${res.status}`);
  const xml = await res.text();
  const data = parser.parse(xml);

  // RSS 2.0 (channel.item) と Atom (feed.entry) の両対応
  const channelItems = data?.rss?.channel?.item;
  const atomEntries = data?.feed?.entry;
  const raw = channelItems ?? atomEntries ?? [];
  const arr = Array.isArray(raw) ? raw : [raw];

  return arr.slice(0, 30).map((it: Record<string, unknown>): TickerItem => {
    const title = String(it.title && typeof it.title === "object" ? (it.title as Record<string, unknown>)["#text"] : it.title ?? "").trim();
    let link = "";
    if (typeof it.link === "string") link = it.link;
    else if (it.link && typeof it.link === "object") link = String((it.link as Record<string, unknown>)["@_href"] ?? "");
    const date = (it.pubDate as string) ?? (it.updated as string) ?? (it.published as string) ?? null;
    return { title, link, date, source: feed.source, kind: feed.kind, severity: guessSeverity(title) };
  });
}

export async function GET() {
  try {
    const results = await Promise.allSettled(FEEDS.map(fetchFeed));
    const items: TickerItem[] = [];
    for (const r of results) if (r.status === "fulfilled") items.push(...r.value);

    // 日付で新しい順にざっくりソート
    items.sort((a, b) => {
      const da = a.date ? Date.parse(a.date) : 0;
      const db = b.date ? Date.parse(b.date) : 0;
      return db - da;
    });

    if (items.length === 0) {
      return NextResponse.json({ ok: false, items: [], note: "no items fetched" }, { status: 200 });
    }
    return NextResponse.json({ ok: true, items: items.slice(0, 60), updatedAt: new Date().toISOString() }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, items: [], error: String(e) }, { status: 200 });
  }
}
