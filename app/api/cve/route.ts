import { NextResponse } from "next/server";

// NVD CVE API（公式・無料・APIキー不要 / 30秒5リクの制限あり）
// + CISA KEV カタログ（悪用が確認された脆弱性）
const NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

export type CveSeverity = "critical" | "high" | "medium" | "low" | "none";

export type CveItem = {
  id: string;
  cvss: number | null;
  severity: CveSeverity;
  vendor: string;
  product: string;
  summary: string;
  date: string | null;
  kev: boolean;
};

function severityOf(score: number | null): CveSeverity {
  if (score == null) return "none";
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "none";
}

function parseNvd(json: Record<string, unknown>): Omit<CveItem, "kev">[] {
  const vulns = (json.vulnerabilities as Array<Record<string, unknown>>) ?? [];
  const out: Omit<CveItem, "kev">[] = [];
  for (const v of vulns) {
    const cve = (v.cve as Record<string, unknown>) ?? {};
    const id = String(cve.id ?? "");
    if (!id) continue;

    const descsRaw = (cve.descriptions as Array<Record<string, unknown>>) ?? [];
    const enDesc = descsRaw.find((d) => d.lang === "en") ?? descsRaw[0];
    const summary = String(enDesc?.value ?? "").slice(0, 280);

    const metrics = (cve.metrics as Record<string, unknown>) ?? {};
    let cvss: number | null = null;
    for (const key of ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]) {
      const arr = metrics[key] as Array<Record<string, unknown>> | undefined;
      if (arr && arr.length > 0) {
        const data = arr[0].cvssData as Record<string, unknown> | undefined;
        const score = data?.baseScore;
        if (typeof score === "number") { cvss = score; break; }
      }
    }

    let vendor = "—", product = "—";
    const configs = (cve.configurations as Array<Record<string, unknown>>) ?? [];
    outer: for (const conf of configs) {
      const nodes = (conf.nodes as Array<Record<string, unknown>>) ?? [];
      for (const node of nodes) {
        const matches = (node.cpeMatch as Array<Record<string, unknown>>) ?? [];
        for (const m of matches) {
          const criteria = String(m.criteria ?? "");
          const parts = criteria.split(":");
          if (parts.length >= 5 && parts[0] === "cpe") {
            vendor = parts[3] || vendor;
            product = parts[4] || product;
            break outer;
          }
        }
      }
    }

    const date = (cve.published as string) ?? (cve.lastModified as string) ?? null;
    out.push({ id, cvss, severity: severityOf(cvss), vendor, product, summary, date });
  }
  return out;
}

async function fetchKev(): Promise<Set<string>> {
  try {
    const res = await fetch(KEV_URL, { next: { revalidate: 28800 } });
    if (!res.ok) return new Set();
    const j = await res.json();
    const arr = (j.vulnerabilities as Array<Record<string, unknown>>) ?? [];
    return new Set(arr.map((v) => String(v.cveID ?? "")).filter(Boolean));
  } catch { return new Set(); }
}

async function fetchNvd(): Promise<Omit<CveItem, "kev">[]> {
  const end = new Date();
  const start = new Date(Date.now() - 30 * 86400_000);
  const url = `${NVD_URL}?pubStartDate=${start.toISOString()}&pubEndDate=${end.toISOString()}&resultsPerPage=50`;
  const res = await fetch(url, {
    headers: { "User-Agent": "RECON/1.0 (security learning platform)" },
    next: { revalidate: 28800 },
  });
  if (!res.ok) throw new Error(`NVD: ${res.status}`);
  const json = await res.json();
  return parseNvd(json);
}

export async function GET() {
  try {
    const [cveItems, kevSet] = await Promise.all([fetchNvd(), fetchKev()]);
    const items: CveItem[] = cveItems.map((c) => ({ ...c, kev: kevSet.has(c.id) }));
    items.sort((a, b) => (b.cvss ?? 0) - (a.cvss ?? 0));
    if (items.length === 0) {
      return NextResponse.json({ ok: false, items: [], note: "no items" }, { status: 200 });
    }
    return NextResponse.json({ ok: true, items, updatedAt: new Date().toISOString() }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, items: [], error: String(e) }, { status: 200 });
  }
}
