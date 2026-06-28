"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/data";
import { trackEvent, EVENTS } from "@/config/analytics";
import type { Product } from "@/types/product";

interface StickyMobileCTAProps {
  product: Product;
}

export function StickyMobileCTA({ product }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after scrolling past ~400px (hero area)
    const threshold = 400;

    function onScroll() {
      setVisible(window.scrollY > threshold);
    }

    // Check on mount in case already scrolled
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    trackEvent(EVENTS.AFFILIATE_CLICK, { product: product.slug, source: "sticky-mobile" });
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-background/95 backdrop-blur-sm border-t border-border/60 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground">{formatINR(product.priceINR)}</p>
        </div>
        <Button variant="amazon" size="sm" className="shrink-0 gap-1.5 text-xs" asChild>
          <a
            href={product.amazonUrl}
            rel="sponsored nofollow"
            target="_blank"
            onClick={handleClick}
          >
            Check Live Amazon Price
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}
