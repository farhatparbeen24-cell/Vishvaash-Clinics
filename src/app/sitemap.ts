import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";

/**
 * Single-page site → one route in the sitemap.
 * The URL derives from clinic.seo.canonicalUrl, which reads
 * NEXT_PUBLIC_SITE_URL when set (see clinic.ts) and otherwise falls back to
 * the pre-launch placeholder domain. Set the env var in Vercel at go-live and
 * this sitemap + the canonical + OG URLs all follow automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = clinic.seo.canonicalUrl.replace(/\/$/, "");
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
