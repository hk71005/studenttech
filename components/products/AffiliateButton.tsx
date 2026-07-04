"use client";

import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, EVENTS } from "@/config/analytics";
import type { Product } from "@/types/product";

interface AffiliateButtonProps {
  product: Product;
  source?: string;
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}

export function AffiliateButton({
  product,
  source = "page",
  size = "default",
  className,
}: AffiliateButtonProps) {
  function handleClick() {
    trackEvent(EVENTS.AFFILIATE_CLICK, { product: product.slug, source });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button variant="amazon" size={size} className={className} asChild>
        <a
          href={product.amazonUrl}
          rel="sponsored nofollow"
          target="_blank"
          onClick={handleClick}
        >
          <ShoppingCart className="h-4 w-4" />
          Check Today&apos;s Price
          <ExternalLink className="h-3.5 w-3.5 ml-auto" />
        </a>
      </Button>
      <p className="text-[10px] text-muted-foreground text-center">
        Price may change — always verify on Amazon
      </p>
    </div>
  );
}
