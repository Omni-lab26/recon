import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TermChip } from "@/components/glossary/TermChip";
import { Reveal } from "@/components/ui/motion";
import { C } from "@/lib/tokens";

const NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

type Severity = "critical" | "high" | "medium" | "low" | "none";
const SEV: Record<Exclude<Severity, "none">, { c: string; t: string; jp: string }> = {
  critical: { c: C.pink, t: "CRITICAL", jp: "緊急" },
  high: { c: C.amber, t: "HIGH", jp: "高" },
  medium: { c: C.blue, t: "MEDIUM", jp: "中" },
  low: { c: C.ink3, t: "LOW", jp: "低" },
};
function severityOf(score: number | null): Severity {
  if (score == null) return "none";
  if (score >= 9) return "critical";
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  if (score > 0) return "low";
  return "none";
}

type CveDetail = {
  id: string;
  cvss: number | null;
  vector: string | null;
  severity: Severity;
  summary: string;
  vendor: string;
  product: string;
  cwe: string[];
  references: string[];
  published: string | null;
  lastModified: string | null;
};

const CVE_RE = /^CVE-\d{4}-\d{4,}$/i;

async function fetchCve(id: string): Promise<CveDetail | null> {
  try {
    const res = await fetch(`${NVD_URL}?cveId=${encodeURIComponent(id)}`, {
      headers: { "User-Agent": "RECON/1.0 (security learning platform)" },
      next: { revalidate: 28800 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const v = json?.vulnerabilities?.[0]?.cve;
    if (!v) return null;

    const descs = (v.descriptions as Array<Record<string, unknown>>) ?? [];
    const en = descs.find((d) => d.lang === "en") ?? descs[0];
    const summary = String(en?.value ?? "");

    const metrics = (v.metrics as Record<string, unknown>) ?? {};
    let cvss: number | null = null;
    let vector: string | null = null;
    for (const key of ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]) {
      const arr = metrics[key] as Array<Record<string, unknown>> | undefined;
      if (arr && arr.length > 0) {
        const data = arr[0].cvssData as Record<string, unknown> | undefined;
        if (typeof data?.baseScore === "number") {
          cvss = data.baseScore as number;
          vector = (data.vectorString as string) ?? null;
          break;
        }
      }
    }

    let vendor = "—", product = "—";
    const configs = (v.configurations as Array<Record<string, unknown>>) ?? [];
    outer: for (const conf of configs) {
      const nodes = (conf.nodes as Array<Record<string, unknown>>) ?? [];
      for (const node of nodes) {
        const matches = (node.cpeMatch as Array<Record<string, unknown>>) ?? [];
        for (const m of matches) {
          const parts = String(m.criteria ?? "").split(":");
          if (parts.length >= 5 && parts[0] === "cpe") { vendor = parts[3] || vendor; product = parts[4] || product; break outer; }
        }
      }
    }

    const cwe: string[] = [];
    const weaknesses = (v.weaknesses as Array<Record<string, unknown>>) ?? [];
    for (const w of weaknesses) {
      const ds = (w.description as Array<Record<string, unknown>>) ?? [];
      for (const d of ds) { const val = String(d.value ?? ""); if (val.startsWith("CWE-") && !cwe.includes(val)) cwe.push(val); }
    }

    const references = ((v.references as Array<Record<string, unknown>>) ?? []).map((r) => String(r.url ?? "")).filter(Boolean).slice(0, 8);

    return {
      id: String(v.id ?? id),
      cvss, vector, severity: severityOf(cvss), summary, vendor, product, cwe, references,
      published: (v.published as string) ?? null,
      lastModified: (v.lastModified as string) ?? null,
    };
  } catch {
    return null;
  }
}

async function isKev(id: string): Promise<boolean> {
  try {
    const res = await fetch(KEV_URL, { next: { revalidate: 28800 } });
    if (!res.ok) return false;
    const j = await res.json();
    return ((j.vulnerabilities as Array<Record<string, unknown>>) ?? []).some((x) => String(x.cveID ?? "") === id);
  } catch { return false; }
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = params.id.toUpperCase();
  return { title: `${id} の詳細`, description: `${id} の脆弱性情報(CVSS・影響製品・参照)。NVD + CISA KEV 連携。` };
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
}

function Heading({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: C.ink3, letterSpacing: 0.5, marginBottom: 10, marginTop: 30 }}>{children}</div>;
}

export default async function CveDetailPage({ params }: { params: { id: string } }) {
  const id = params.id.toUpperCase();
  if (!CVE_RE.test(id)) notFound();

  const [cve, kev] = await Promise.all([fetchCve(id), isKev(id)]);

  // 関連用語(深刻度に応じて足す)
  const baseTerms = ["cve", "cvss", "vuln"];
  const terms = kev ? [...baseTerms, "kev"] : baseTerms;

  return (
    <main style={{ position: "relative", minHeight: "calc(100vh - 64px)" }}>
      <article style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 100px" }}>
        <Reveal>
          <Link href="/cve" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink3, textDecoration: "none" }}>← CVE データベース</Link>

          {!cve ? (
            <div style={{ marginTop: 26, padding: "40px 24px", borderRadius: 16, border: `1px dashed ${C.line2}`, background: C.soft, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: C.ink, marginBottom: 10 }}>{id}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: C.ink2, lineHeight: 1.7 }}>
                この CVE の情報を取得できませんでした。<br />
                IDが正しくないか、NVD のレート制限(30秒5リク)に達している可能性があります。少し待って再読み込みするか、下のリンクから公式を確認してください。
              </div>
              <a href={`https://nvd.nist.gov/vuln/detail/${id}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 12, color: C.blue, textDecoration: "none" }}>NVD公式で見る ↗</a>
            </div>
          ) : (
            <>
              {/* header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, marginBottom: 14, flexWrap: "wrap" }}>
                {cve.severity !== "none" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#fff", background: SEV[cve.severity].c, padding: "3px 10px", borderRadius: 6 }}>{SEV[cve.severity].t} · {SEV[cve.severity].jp}</span>}
                {cve.cvss != null && cve.severity !== "none" && <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: SEV[cve.severity].c, background: `${SEV[cve.severity].c}14`, border: `1px solid ${SEV[cve.severity].c}44`, padding: "2px 9px", borderRadius: 6 }}>CVSS {cve.cvss.toFixed(1)}</span>}
                {kev && <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#fff", background: C.pink, padding: "3px 9px", borderRadius: 6 }}>⚠ KEV 悪用確認済み</span>}
              </div>
              <h1 style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 28, color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 6px" }}>{cve.id}</h1>

              {/* summary */}
              <Heading>// 概要(原文)</Heading>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: C.ink, lineHeight: 1.85, margin: 0 }}>{cve.summary || "(概要なし)"}</p>

              {/* meta */}
              <Heading>// 詳細情報</Heading>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: C.line, border: `1px solid ${C.line}`, borderRadius: 12, overflow: "hidden" }}>
                {[
                  ["ベンダー", cve.vendor],
                  ["製品", cve.product],
                  ["公開日", fmt(cve.published)],
                  ["更新日", fmt(cve.lastModified)],
                  ["脆弱性タイプ", cve.cwe.length ? cve.cwe.join(", ") : "—"],
                  ["CVSSベクター", cve.vector ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: C.bg, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink3, marginBottom: 3 }}>{k}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink, wordBreak: "break-all" }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* references */}
              {cve.references.length > 0 && (
                <>
                  <Heading>// 参照リンク</Heading>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {cve.references.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: C.blue, textDecoration: "none", padding: "9px 12px", borderRadius: 9, border: `1px solid ${C.line}`, background: C.soft, wordBreak: "break-all" }}>↗ {url}</a>
                    ))}
                  </div>
                </>
              )}

              {/* related terms */}
              <Heading>// 関連用語</Heading>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {terms.map((tid) => <TermChip key={tid} termId={tid} />)}
              </div>

              {/* official */}
              <Heading>// 一次情報</Heading>
              <a href={`https://nvd.nist.gov/vuln/detail/${cve.id}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: C.ink2, textDecoration: "none", padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.line}` }}>
                NVD公式ページで見る ↗
              </a>
            </>
          )}
        </Reveal>
      </article>
    </main>
  );
}
