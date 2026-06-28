/**
 * lib/data.ts — single data access layer.
 * All pages import from here. Swap to Supabase/Postgres by replacing the
 * implementations below without touching any page file.
 */

import { products } from "@/data/products";
import { bestLists } from "@/data/best-lists";
import { buildAffiliateUrl, buildRedirectUrl } from "@/config/affiliate";
import type { Product, Category, BestForTag, BestListSlug } from "@/types/product";

export type { Product, Category, BestForTag, BestListSlug };

// ─── Product queries ──────────────────────────────────────────────────────────

export function getAllProducts(): Product[] {
  return products.map(enrichProduct);
}

export function getProductBySlug(slug: string): Product | undefined {
  const p = products.find((p) => p.slug === slug);
  return p ? enrichProduct(p) : undefined;
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category).map(enrichProduct);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products
    .filter((p) => p.featured)
    .slice(0, limit)
    .map(enrichProduct);
}

export function getProductsByTag(tag: BestForTag, category?: Category, maxPrice?: number): Product[] {
  return products
    .filter((p) => {
      const tagMatch = p.bestForTags.includes(tag);
      const catMatch = category ? p.category === category : true;
      const priceMatch = maxPrice ? p.priceINR <= maxPrice : true;
      return tagMatch && catMatch && priceMatch;
    })
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall)
    .map(enrichProduct);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        p.bestForTags.some((t) => product.bestForTags.includes(t))
    )
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall)
    .slice(0, limit)
    .map(enrichProduct);
}

// ─── Best lists ────────────────────────────────────────────────────────────────

export function getAllBestLists(): BestListSlug[] {
  return bestLists;
}

export function getBestListBySlug(slug: string): BestListSlug | undefined {
  return bestLists.find((b) => b.slug === slug);
}

// ─── Comparisons ──────────────────────────────────────────────────────────────

/** Generates all meaningful pairings within each category */
export function getAllComparisons(): { slug: string; products: [Product, Product] }[] {
  const byCategory = {
    phones: products.filter((p) => p.category === "phones"),
    laptops: products.filter((p) => p.category === "laptops"),
    accessories: products.filter((p) => p.category === "accessories"),
  } as Record<string, Product[]>;

  const pairs: { slug: string; products: [Product, Product] }[] = [];

  for (const items of Object.values(byCategory)) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = enrichProduct(items[i]);
        const b = enrichProduct(items[j]);
        // Only compare if price within ~2x of each other (avoids absurd matchups)
        const ratio = Math.max(a.priceINR, b.priceINR) / Math.min(a.priceINR, b.priceINR);
        if (ratio <= 2.5) {
          pairs.push({
            slug: `${a.slug}-vs-${b.slug}`,
            products: [a, b],
          });
        }
      }
    }
  }

  return pairs;
}

export function getComparisonBySlug(slug: string): { products: [Product, Product] } | undefined {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return undefined;
  const [slugA, slugB] = parts;
  const a = getProductBySlug(slugA);
  const b = getProductBySlug(slugB);
  if (!a || !b) return undefined;
  return { products: [a, b] };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function enrichProduct(p: Product): Product {
  return {
    ...p,
    amazonUrl: buildAffiliateUrl(p.asin),
    // Store the go-link reference for internal use
  };
}

export function getGoUrl(asin: string): string {
  return buildRedirectUrl(asin);
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const categoryMeta: Record<Category, { title: string; description: string; emoji: string }> = {
  phones: {
    title: "Phones",
    description: "Smartphones reviewed and ranked for Indian college students — from under ₹10K to flagship.",
    emoji: "📱",
  },
  laptops: {
    title: "Laptops",
    description: "Laptops tested by a CSE student for coding, dev tools, and college life in India.",
    emoji: "💻",
  },
  accessories: {
    title: "Accessories",
    description: "Keyboards, mice, monitors, earbuds, and storage — the CS student setup guide.",
    emoji: "⌨️",
  },
};

// Format INR
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
