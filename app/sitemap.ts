import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllProducts, getAllComparisons, getAllBestLists } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/phones`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/laptops`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/accessories`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/career`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/affiliate-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.lastUpdated).toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const comparisonPages: MetadataRoute.Sitemap = getAllComparisons().map(({ slug }) => ({
    url: `${base}/compare/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const bestListPages: MetadataRoute.Sitemap = getAllBestLists().map((b) => ({
    url: `${base}/best/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticPages, ...productPages, ...comparisonPages, ...bestListPages];
}
