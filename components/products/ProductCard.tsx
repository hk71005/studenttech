"use client";

import Link from "next/link";
import { ExternalLink, BarChart2, Check, X as XIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/components/products/ScoreRing";
import { ProductImage } from "@/components/products/ProductImage";
import { useCompare } from "@/hooks/useCompare";
import { formatINR, getGoUrl } from "@/lib/data";
import { trackEvent, EVENTS } from "@/config/analytics";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  rank?: number;
  showCompare?: boolean;
}

export function ProductCard({ product, rank, showCompare = true }: ProductCardProps) {
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
    <Card className="group relative overflow-hidden border-border/50 hover:border-border transition-all duration-200">
      {rank && (
        <div className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {rank}
        </div>
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
          <p className="text-lg font-bold text-foreground mb-3">
            {formatINR(product.priceINR)}
          </p>

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
            href={getGoUrl(product.asin)}
            rel="sponsored nofollow"
            target="_blank"
            onClick={handleAffiliateClick}
          >
            Check on Amazon
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
