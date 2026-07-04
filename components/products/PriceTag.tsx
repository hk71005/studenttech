import { formatINR } from "@/lib/data";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  priceINR: number;
  mrpINR?: number;
  /** Size of the main price text */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PRICE_SIZE: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

/**
 * Shows the guide price, and — when a higher manufacturer M.R.P. is known —
 * a struck-through M.R.P. plus a "% off" badge. Falls back to just the price
 * when no mrpINR is set, so it's safe to use everywhere.
 */
export function PriceTag({ priceINR, mrpINR, size = "md", className }: PriceTagProps) {
  const hasDiscount = typeof mrpINR === "number" && mrpINR > priceINR;
  const savings = hasDiscount ? mrpINR! - priceINR : 0;

  return (
    <div className={cn("flex items-baseline flex-wrap gap-x-2 gap-y-0.5", className)}>
      <span className={cn(PRICE_SIZE[size], "font-bold text-foreground")}>
        {formatINR(priceINR)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-xs text-muted-foreground line-through" title="Manufacturer's M.R.P.">
            {formatINR(mrpINR!)}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Save {formatINR(savings)}
          </span>
        </>
      )}
    </div>
  );
}
