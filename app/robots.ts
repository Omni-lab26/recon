import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // 認証・個人データ・API系はクロール対象外
        disallow: ["/api/", "/auth/", "/profile", "/dashboard", "/settings", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: "https://recon-brown.vercel.app/sitemap.xml",
  };
}
