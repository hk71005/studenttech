"use client";

import { ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, EVENTS } from "@/config/analytics";
import type { GumroadProduct } from "@/config/gumroad";

interface GumroadCTAProps {
  product: GumroadProduct;
}

export function GumroadCTA({ product }: GumroadCTAProps) {
  function handleClick() {
    trackEvent(EVENTS.GUMROAD_CLICK, { product: product.id });
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-semibold text-foreground">{product.title}</p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {product.cta}
      </p>
      <div className="flex items-center gap-3">
        <Button size="sm" asChild onClick={handleClick}>
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            Get it for {product.price}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
        <p className="text-[10px] text-muted-foreground">One-time purchase · Instant download</p>
      </div>
    </div>
  );
}
