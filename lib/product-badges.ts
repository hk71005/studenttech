/**
 * lib/product-badges.ts — Pre-computed badge assignments.
 * These are evaluated once at build-time. ProductCard imports the result.
 */

import { products } from "@/data/products";
import type { Category } from "@/types/product";

const categories: Category[] = ["phones", "laptops", "accessories"];

/** Set of slugs for the cheapest product in each category */
export const cheapestSlugs = new Set<string>(
  categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat);
    if (catProducts.length === 0) return "";
    catProducts.sort((a, b) => a.priceINR - b.priceINR);
    return catProducts[0].slug;
  }).filter(Boolean),
);

/** Set of slugs for the "best value" (highest score-to-price ratio) per category */
export const bestValueSlugs = new Set<string>(
  categories.map((cat) => {
    const catProducts = products.filter((p) => p.category === cat);
    if (catProducts.length === 0) return "";
    catProducts.sort(
      (a, b) =>
        b.studentScore.overall / b.priceINR -
        a.studentScore.overall / a.priceINR,
    );
    return catProducts[0].slug;
  }).filter(Boolean),
);

/** Category label for cheapest badge */
export const cheapestCategoryLabel: Record<string, string> = {};
for (const cat of categories) {
  const catProducts = products.filter((p) => p.category === cat);
  if (catProducts.length === 0) continue;
  catProducts.sort((a, b) => a.priceINR - b.priceINR);
  const cheapest = catProducts[0];
  const catLabel = cat === "phones" ? "Phone" : cat === "laptops" ? "Laptop" : "Accessory";
  cheapestCategoryLabel[cheapest.slug] = catLabel;
}
