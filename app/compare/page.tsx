import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllComparisons, formatINR } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Product Comparisons — Head-to-Head Specs for Students",
  description: "Compare phones, laptops, and accessories side-by-side with detailed spec tables and honest verdicts for Indian engineering students.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  const comparisons = getAllComparisons();
  const byCategory = {
    phones: comparisons.filter(({ products: [a] }) => a.category === "phones"),
    laptops: comparisons.filter(({ products: [a] }) => a.category === "laptops"),
    accessories: comparisons.filter(({ products: [a] }) => a.category === "accessories"),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">Product comparisons</h1>
        <p className="text-muted-foreground max-w-2xl">
          Head-to-head spec comparisons with honest verdicts. Every comparison is auto-generated from
          real specs — no fluff, just the data you need to choose.
        </p>
      </div>

      {(Object.entries(byCategory) as [string, typeof byCategory[keyof typeof byCategory]][]).map(([category, items]) => (
        <section key={category} className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-5 capitalize">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(({ slug, products: [a, b] }) => (
              <Link
                key={slug}
                href={`/compare/${slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="font-medium text-foreground truncate">{a.name}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">vs</span>
                    <span className="font-medium text-foreground truncate">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatINR(a.priceINR)}</span>
                    <span>·</span>
                    <span>{formatINR(b.priceINR)}</span>
                    <span>·</span>
                    <span>Score: {a.studentScore.overall} vs {b.studentScore.overall}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
