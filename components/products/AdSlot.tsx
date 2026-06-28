// Ad slot placeholder — wire up AdSense/Ezoic by replacing this component
// No network calls until an ad provider is configured

interface AdSlotProps {
  slot: "banner" | "sidebar" | "in-article";
  className?: string;
}

export function AdSlot({ slot, className }: AdSlotProps) {
  // TODO: Replace with your ad provider code
  // AdSense example: <ins className="adsbygoogle" ...>
  const adEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

  if (!adEnabled) return null;

  return (
    <div
      className={className}
      data-ad-slot={slot}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* TODO: Insert ad provider markup here */}
    </div>
  );
}
