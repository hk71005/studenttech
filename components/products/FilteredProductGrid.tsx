"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product, Category } from "@/types/product";

/* ─── Price ranges per category ────────────────────────────────────── */
const PRICE_RANGES: Record<Category, { label: string; min: number; max: number }[]> = {
  phones: [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹15K", min: 0, max: 15000 },
    { label: "₹15–30K", min: 15000, max: 30000 },
    { label: "₹30K+", min: 30000, max: Infinity },
  ],
  laptops: [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹40K", min: 0, max: 40000 },
    { label: "₹40–60K", min: 40000, max: 60000 },
    { label: "₹60–90K", min: 60000, max: 90000 },
    { label: "₹90K+", min: 90000, max: Infinity },
  ],
  accessories: [
    { label: "All", min: 0, max: Infinity },
    { label: "Under ₹1K", min: 0, max: 1000 },
    { label: "₹1–5K", min: 1000, max: 5000 },
    { label: "₹5–10K", min: 5000, max: 10000 },
    { label: "₹10K+", min: 10000, max: Infinity },
  ],
};

/* ─── Sort options ──────────────────────────────────────────────────── */
type SortKey = "score" | "price-asc" | "price-desc";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Top Score" },
  { key: "price-asc", label: "Price: Low → High" },
  { key: "price-desc", label: "Price: High → Low" },
];

function sortProducts(products: Product[], key: SortKey): Product[] {
  const sorted = [...products];
  switch (key) {
    case "score":
      return sorted.sort((a, b) => b.studentScore.overall - a.studentScore.overall);
    case "price-asc":
      return sorted.sort((a, b) => a.priceINR - b.priceINR);
    case "price-desc":
      return sorted.sort((a, b) => b.priceINR - a.priceINR);
  }
}

/* ─── Component ─────────────────────────────────────────────────────── */
interface FilteredProductGridProps {
  products: Product[];
  category: Category;
}

export function FilteredProductGrid({ products, category }: FilteredProductGridProps) {
  const [rangeIdx, setRangeIdx] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const ranges = PRICE_RANGES[category];

  const filtered = useMemo(() => {
    const range = ranges[rangeIdx];
    const priceFiltered = products.filter(
      (p) => p.priceINR >= range.min && p.priceINR < range.max,
    );
    return sortProducts(priceFiltered, sortKey);
  }, [products, rangeIdx, sortKey, ranges]);

  return (
    <div>
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        {/* Price filter */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by price range">
          {ranges.map((range, idx) => (
            <button
              key={range.label}
              type="button"
              onClick={() => setRangeIdx(idx)}
              aria-pressed={rangeIdx === idx}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                rangeIdx === idx
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Sort control */}
        <div className="flex items-center gap-1.5 sm:ml-auto" role="group" aria-label="Sort products">
          <span className="text-xs text-muted-foreground shrink-0">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSortKey(opt.key)}
              aria-pressed={sortKey === opt.key}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-colors cursor-pointer ${
                sortKey === opt.key
                  ? "bg-primary/10 text-primary border-primary/40"
                  : "bg-card text-muted-foreground border-border/60 hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm">
            No products in this price range. Try a different filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              rank={sortKey === "score" ? i + 1 : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
