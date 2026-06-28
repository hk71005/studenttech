/**
 * lib/finder.ts — Quiz matching logic for Tech Finder.
 * Client-safe: operates on a pre-passed product array.
 */

import type { Product, Category, BestForTag } from "@/types/product";

export interface QuizAnswers {
  category: Category;
  budgetMin: number;
  budgetMax: number;
  useTag: BestForTag;
  priority: "performance" | "battery" | "value" | "portability";
}

/** Budget ranges per category */
export const BUDGET_RANGES: Record<Category, { label: string; min: number; max: number }[]> = {
  laptops: [
    { label: "Under ₹40K", min: 0, max: 40000 },
    { label: "₹40K – ₹60K", min: 40000, max: 60000 },
    { label: "₹60K – ₹90K", min: 60000, max: 90000 },
    { label: "₹90K+", min: 90000, max: Infinity },
  ],
  phones: [
    { label: "Under ₹15K", min: 0, max: 15000 },
    { label: "₹15K – ₹25K", min: 15000, max: 25000 },
    { label: "₹25K+", min: 25000, max: Infinity },
  ],
  accessories: [
    { label: "Under ₹2K", min: 0, max: 2000 },
    { label: "₹2K – ₹7K", min: 2000, max: 7000 },
    { label: "₹7K+", min: 7000, max: Infinity },
  ],
};

/** Use-case options mapped to bestForTags */
export const USE_OPTIONS: { label: string; emoji: string; tag: BestForTag }[] = [
  { label: "Coding", emoji: "💻", tag: "coding" },
  { label: "Gaming", emoji: "🎮", tag: "gaming" },
  { label: "Note-taking / Reading", emoji: "📝", tag: "note-taking" },
  { label: "Battery life", emoji: "🔋", tag: "battery-life" },
  { label: "Portability", emoji: "🎒", tag: "portability" },
  { label: "Best value", emoji: "💰", tag: "value" },
];

/** Priority options mapped to studentScore sub-scores */
export const PRIORITY_OPTIONS: { label: string; emoji: string; key: QuizAnswers["priority"] }[] = [
  { label: "Performance", emoji: "⚡", key: "performance" },
  { label: "Battery", emoji: "🔋", key: "battery" },
  { label: "Value for money", emoji: "💎", key: "value" },
  { label: "Portability", emoji: "🪶", key: "portability" },
];

/**
 * Score and rank products based on quiz answers.
 * Returns up to `limit` products sorted by computed score.
 * If strict budget filtering yields 0 results, falls back to ignoring budget.
 */
export function findMatches(
  allProducts: Product[],
  answers: QuizAnswers,
  limit = 3,
): Product[] {
  // Filter by category
  const categoryProducts = allProducts.filter((p) => p.category === answers.category);

  // Filter by budget
  const budgetFiltered = categoryProducts.filter(
    (p) => p.priceINR >= answers.budgetMin && p.priceINR <= answers.budgetMax,
  );

  // Use budget-filtered if we have results, otherwise fallback to category-only
  const candidates = budgetFiltered.length > 0 ? budgetFiltered : categoryProducts;

  // Score each product
  const scored = candidates.map((product) => {
    let score = 0;

    // Base: overall student score (0–100)
    score += product.studentScore.overall;

    // Bonus for matching use-tag (+30)
    if (product.bestForTags.includes(answers.useTag)) {
      score += 30;
    }

    // Bonus for matching related tags (+10 each, max 2)
    const relatedBonus = product.bestForTags
      .filter((t) => t !== answers.useTag)
      .slice(0, 2)
      .length * 5;
    score += relatedBonus;

    // Priority sub-score bonus (weighted)
    const subScore = product.studentScore[answers.priority] ?? 0;
    score += subScore * 0.3;

    return { product, score };
  });

  // Sort by score descending, then by price ascending for ties
  scored.sort((a, b) => b.score - a.score || a.product.priceINR - b.product.priceINR);

  return scored.slice(0, limit).map((s) => s.product);
}
