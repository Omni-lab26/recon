import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/tools-data";
import { ARTICLES } from "@/lib/articles-data";

const BASE = "https://recon.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/roadmap`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/articles`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/cve`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/news`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE}/ctf`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/lab`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((t) => ({
    url: `${BASE}/tools/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...toolRoutes, ...articleRoutes];
}
