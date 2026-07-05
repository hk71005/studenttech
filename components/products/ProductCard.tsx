"use client";

import Link from "next/link";
import { ExternalLink, BarChart2, Check, X as XIcon, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/products/ScoreRing";
import { ProductImage } from "@/components/products/ProductImage";
import { PriceTag } from "@/components/products/PriceTag";
import { DealCountdown } from "@/components/products/DealCountdown";
import { useCompare } from "@/hooks/useCompare";
import { trackEvent, EVENTS } from "@/config/analytics";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { cheapestSlugs, bestValueSlugs, cheapestCategoryLabel } from "@/lib/product-badges";

function getBudgetBadge(product: Product): { emoji: string; label: string } | null {
  // Highest priority: Top Rated
  if (product.studentScore.overall >= 85) return { emoji: "🏆", label: "Top Rated" };
  // Best value (highest score-to-price ratio in category)
  if (bestValueSlugs.has(product.slug)) return { emoji: "💎", label: "Best Value" };
  // Cheapest in category
  if (cheapestSlugs.has(product.slug)) {
    const catLabel = cheapestCategoryLabel[product.slug] ?? "";
    return { emoji: "💰", label: `Cheapest ${catLabel}` };
  }
  // Price-tier fallbacks
  if (product.priceINR < 15000) return { emoji: "💚", label: "Under ₹15K" };
  if (product.priceINR < 30000) return { emoji: "💚", label: "Under ₹30K" };
  if (product.priceINR < 50000) return { emoji: "💰", label: "Under ₹50K" };
  if (product.bestForTags.includes("gaming")) return { emoji: "🎮", label: "Gaming" };
  if (product.bestForTags.includes("coding")) return { emoji: "💻", label: "Coding Pick" };
  if (product.bestForTags.includes("value")) return { emoji: "⭐", label: "Great Value" };
  return null;
}

interface ProductCardProps {
  product: Product;
  rank?: number;
  showCompare?: boolean;
  /** Visually feature this card (used for the top budget deal) */
  highlight?: boolean;
  /** Suppress the "Popular with students" line — use when the surrounding
   *  section (e.g. "Top student picks") already conveys that signal. */
  hidePopularBadge?: boolean;
}

export function ProductCard({
  product,
  rank,
  showCompare = true,
  highlight = false,
  hidePopularBadge = false,
}: ProductCardProps) {
  const { add, remove, has } = useCompare();
  const inTray = has(product.slug);

  function handleCompareToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (inTray) {
      remove(product.slug);
    } else {
      add({ slug: product.slug, name: product.name, category: product.category });
      trackEvent(EVENTS.COMPARE_ADD, { product: product.slug });
    }
  }

  function handleAffiliateClick() {
    trackEvent(EVENTS.AFFILIATE_CLICK, { product: product.slug, source: "card" });
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/50 hover:border-border transition-all duration-200",
        "hover:-translate-y-1 hover:shadow-lg",
        highlight && "border-primary/60 ring-2 ring-primary/40 shadow-md"
      )}
    >
      {rank && (
        <div className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {rank}
        </div>
      )}
      {highlight && !rank && (
        <span className="absolute top-3 left-3 z-10 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
          🔥 Top Deal
        </span>
      )}

      <Link href={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative h-44 bg-muted/30 flex items-center justify-center overflow-hidden">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            category={product.category}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {(() => {
            // Discount badge takes priority over budget/rating badge (one badge max)
            const discountPct =
              product.mrpINR && product.mrpINR > product.priceINR
                ? Math.round(((product.mrpINR - product.priceINR) / product.mrpINR) * 100)
                : 0;
            if (discountPct >= 5) {
              return (
                <span className="absolute top-3 right-3 z-10 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  {discountPct}% OFF
                </span>
              );
            }
            const badge = getBudgetBadge(product);
            return badge ? (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 z-10 text-[10px] px-2 py-0.5 gap-1 bg-background/80 backdrop-blur-sm"
              >
                {badge.emoji} {badge.label}
              </Badge>
            ) : null;
          })()}
        </div>

        <CardContent className="pt-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{product.brand}</p>
              <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-150">
                {product.name}
              </h3>
            </div>
            <ScoreRing score={product.studentScore.overall} size={40} />
          </div>

          {/* Price */}
          <div className="mb-3">
            <PriceTag priceINR={product.priceINR} mrpINR={product.mrpINR} size="md" />
          </div>

          {/* Countdown — only on the featured Top Deal */}
          {highlight && (
            <div className="mb-3">
              <DealCountdown />
            </div>
          )}

          {/* Honest social proof — only for genuinely featured editorial picks */}
          {product.featured && !highlight && !hidePopularBadge && (
            <div className="mb-3 flex items-center gap-1 text-[11px] font-medium text-primary">
              <Flame className="h-3 w-3 shrink-0" />
              Popular with students
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.bestForTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0 capitalize">
                {tag.replace("-", " ")}
              </Badge>
            ))}
          </div>

          {/* Top pro/con */}
          <div className="space-y-1 text-xs text-muted-foreground">
            {product.pros[0] && (
              <div className="flex items-start gap-1.5">
                <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{product.pros[0]}</span>
              </div>
            )}
            {product.cons[0] && (
              <div className="flex items-start gap-1.5">
                <XIcon className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />
                <span className="line-clamp-1">{product.cons[0]}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Actions */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <Button
          variant="amazon"
          size="sm"
          className="flex-1 text-xs gap-1.5"
          asChild
        >
          <a
            href={product.amazonUrl}
            rel="sponsored nofollow"
            target="_blank"
            onClick={handleAffiliateClick}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
            Check Today&apos;s Price
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>

        {showCompare && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0 border-border/60 transition-colors",
              inTray && "bg-primary/10 border-primary/40 text-primary"
            )}
            onClick={handleCompareToggle}
            aria-label={inTray ? "Remove from compare" : "Add to compare"}
            title={inTray ? "Remove from compare" : "Add to compare"}
          >
            <BarChart2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
