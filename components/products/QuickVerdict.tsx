"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/products/ScoreRing";
import type { Product, BestForTag } from "@/types/product";

/* Map bestForTags → human-readable "Buy if" bullets */
const TAG_TO_BUY_IF: Record<BestForTag, string> = {
  coding: "You code daily and need a smooth dev experience",
  gaming: "You game between classes",
  "note-taking": "You take heavy digital notes",
  budget: "You're on a tight student budget",
  performance: "You need raw multitasking power",
  portability: "You carry your gear across campus",
  "battery-life": "Battery life is a dealbreaker for you",
  value: "You want the best bang for your buck",
  typing: "Comfortable typing matters for long sessions",
  audio: "Audio quality is a priority",
  display: "Display quality matters for your workflow",
  "dev-setup": "You're building a serious dev setup",
  career: "You want tech that levels up your career",
};

/* Map bestForTags → human-readable "Skip if" bullets (inverse) */
const TAG_TO_SKIP_IF: Partial<Record<BestForTag, string>> = {
  gaming: "You want heavy AAA gaming",
  performance: "Raw specs aren't a priority for you",
  portability: "Portability isn't important",
  "battery-life": "You're always near a charger",
  budget: "You want premium flagship features",
  display: "A basic display is fine for you",
  coding: "You mainly use cloud-based tools",
};

/* Tags that are NOT in the product → potential skip reasons */
function getSkipBullets(tags: BestForTag[], cons: string[]): string[] {
  const skipBullets: string[] = [];

  // Add skip bullets from tags NOT present on product
  const allSkipTags: BestForTag[] = ["gaming", "performance", "portability", "battery-life", "display"];
  for (const tag of allSkipTags) {
    if (!tags.includes(tag) && TAG_TO_SKIP_IF[tag]) {
      skipBullets.push(TAG_TO_SKIP_IF[tag]!);
    }
  }

  // Supplement with cons if needed
  if (skipBullets.length < 2 && cons.length > 0) {
    skipBullets.push(cons[0]);
  }

  return skipBullets.slice(0, 3);
}

interface QuickVerdictProps {
  product: Product;
}

export function QuickVerdict({ product }: QuickVerdictProps) {
  const buyIfBullets = product.bestForTags
    .slice(0, 3)
    .map((tag) => TAG_TO_BUY_IF[tag])
    .filter(Boolean);

  const skipBullets = getSkipBullets(product.bestForTags, product.cons);

  return (
    <Card className="mb-8 border-border/60 bg-card overflow-hidden">
      <CardContent className="pt-5">
        {/* Score + title row */}
        <div className="flex items-center gap-3 mb-4">
          <ScoreRing score={product.studentScore.overall} size={52} />
          <div>
            <p className="text-sm font-semibold text-foreground">Quick Verdict</p>
            <p className="text-xs text-muted-foreground">
              Student Score: {product.studentScore.overall}/100
            </p>
          </div>
        </div>

        {/* Three columns: Buy if / Skip if / Best for */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Buy if */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span>✅</span> Buy if
            </p>
            <ul className="space-y-1.5">
              {buyIfBullets.map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-snug">
                  • {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Skip if */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center gap-1">
              <span>❌</span> Skip if
            </p>
            <ul className="space-y-1.5">
              {skipBullets.map((bullet, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-snug">
                  • {bullet}
                </li>
              ))}
            </ul>
          </div>

          {/* Best for */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-primary flex items-center gap-1">
              <span>🎯</span> Best for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.bestForTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 capitalize">
                  {tag.replace("-", " ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
