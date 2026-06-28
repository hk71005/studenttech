import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Minus, ExternalLink } from "lucide-react";
import { getAllComparisons, getComparisonBySlug, formatINR } from "@/lib/data";
import { AffiliateButton } from "@/components/products/AffiliateButton";
import { ScoreRing, ScoreBreakdown } from "@/components/products/ScoreRing";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types/product";

export async function generateStaticParams() {
  return getAllComparisons().map(({ slug }) => ({ matchup: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchup: string }>;
}): Promise<Metadata> {
  const { matchup } = await params;
  const result = getComparisonBySlug(matchup);
  if (!result) return {};
  const [a, b] = result.products;
  const title = `${a.name} vs ${b.name} — Which Should You Buy?`;
  const description = `${a.name} vs ${b.name} detailed comparison: specs, student scores, pros & cons, and a clear verdict for Indian engineering students.`;
  return {
    title,
    description,
    alternates: { canonical: `/compare/${matchup}` },
    openGraph: { title, description },
  };
}

function SpecCompareRow({
  label,
  valueA,
  valueB,
  winner,
}: {
  label: string;
  valueA: string;
  valueB: string;
  winner?: "a" | "b" | "tie";
}) {
  const winnerLabel = winner && winner !== "tie" ? (
    <span className="ml-1.5 text-[10px] text-primary font-medium whitespace-nowrap">✔ Best {label}</span>
  ) : null;

  return (
    <tr>
      <td className="text-xs text-muted-foreground font-medium py-2.5 px-3 w-32">{label}</td>
      <td className={`text-sm py-2.5 px-3 ${winner === "a" ? "winner" : ""}`}>
        {valueA}{winner === "a" && winnerLabel}
      </td>
      <td className={`text-sm py-2.5 px-3 ${winner === "b" ? "winner" : ""}`}>
        {valueB}{winner === "b" && winnerLabel}
      </td>
    </tr>
  );
}

function determineWinner(a: number | undefined, b: number | undefined): "a" | "b" | "tie" | undefined {
  if (!a || !b) return undefined;
  if (a > b) return "a";
  if (b > a) return "b";
  return "tie";
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ matchup: string }>;
}) {
  const { matchup } = await params;
  const result = getComparisonBySlug(matchup);
  if (!result) notFound();

  const [a, b] = result.products;

  // Determine winners per spec
  const scoreWinner = determineWinner(a.studentScore.overall, b.studentScore.overall);
  const priceWinner = a.priceINR === b.priceINR ? "tie" as const : a.priceINR < b.priceINR ? "a" as const : "b" as const;
  const batteryWinner = determineWinner(a.batteryCapacity, b.batteryCapacity);
  const ramWinner = determineWinner(a.ram, b.ram);
  const storageWinner = determineWinner(a.storage, b.storage);
  const weightWinner = a.weightKg && b.weightKg
    ? a.weightKg === b.weightKg ? "tie" as const : a.weightKg < b.weightKg ? "a" as const : "b" as const
    : undefined;

  const overallWinner = scoreWinner === "a" ? a : scoreWinner === "b" ? b : null;
  const overallLoser = scoreWinner === "a" ? b : scoreWinner === "b" ? a : null;

  const relatedComparisons = getAllComparisons()
    .filter(({ slug: s, products: [pa, pb] }) =>
      s !== matchup && (pa.slug === a.slug || pb.slug === a.slug || pa.slug === b.slug || pb.slug === b.slug)
    )
    .slice(0, 3);

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Compare", href: "/compare" },
    { name: `${a.name} vs ${b.name}`, href: `/compare/${matchup}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${a.name} vs ${b.name}`,
    description: `Detailed comparison of ${a.name} and ${b.name} for Indian engineering students.`,
    author: { "@type": "Person", name: siteConfig.author.name },
    dateModified: new Date(Math.max(
      new Date(a.lastUpdated).getTime(),
      new Date(b.lastUpdated).getTime()
    )).toISOString().split("T")[0],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground line-clamp-1">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">{item.name}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 capitalize">{a.category} comparison</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {a.name} vs {b.name}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Which one should an Indian engineering student actually buy? Here's the honest head-to-head.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[a, b].map((product) => (
            <div
              key={product.id}
              className={`rounded-xl border ${
                overallWinner?.id === product.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-card"
              } p-5 text-center relative`}
            >
              {overallWinner?.id === product.id && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Badge className="text-[10px] px-2 py-0">Our Pick</Badge>
                </div>
              )}
              <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
              <h2 className="text-sm font-semibold text-foreground mb-3 leading-snug">{product.name}</h2>
              <div className="flex justify-center mb-3">
                <ScoreRing score={product.studentScore.overall} size={64} />
              </div>
              <p className="text-lg font-bold text-foreground">{formatINR(product.priceINR)}</p>
              <div className="mt-4">
                <AffiliateButton product={product} source="compare" size="sm" className="w-full text-xs" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick verdict — surfaced above spec table */}
        {overallWinner && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 mb-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Verdict</p>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">{overallWinner.name}</span> edges ahead with a Student Score of{" "}
              {overallWinner.studentScore.overall}/100 — stronger across{" "}
              {overallWinner.bestForTags.slice(0, 2).map((t) => t.replace("-", " ")).join(" and ")}.
              {overallLoser && ` The ${overallLoser.name} remains a solid choice if ${overallLoser.bestForTags[0]?.replace("-", " ")} is your top priority.`}
            </p>
          </div>
        )}

        {/* Who should buy which — before spec table for faster decision */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[a, b].map((product) => (
            <div key={product.id} className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Choose the {product.name} if…
              </h3>
              <ul className="space-y-2 mb-4">
                {product.bestForTags.slice(0, 4).map((tag) => (
                  <li key={tag} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="capitalize">{tag.replace("-", " ")} is your priority</span>
                  </li>
                ))}
              </ul>
              <AffiliateButton product={product} source="compare-verdict" size="sm" className="w-full" />
            </div>
          ))}
        </div>

        {/* Spec comparison table */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Full spec comparison</h2>
          <div className="rounded-xl border border-border/60 overflow-hidden overflow-x-auto">
            <table className="spec-table min-w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="py-3 px-3 text-left">Spec</th>
                  <th className="py-3 px-3 text-left">{a.name}</th>
                  <th className="py-3 px-3 text-left">{b.name}</th>
                </tr>
              </thead>
              <tbody>
                <SpecCompareRow
                  label="Price"
                  valueA={formatINR(a.priceINR)}
                  valueB={formatINR(b.priceINR)}
                  winner={priceWinner}
                />
                <SpecCompareRow label="Processor" valueA={a.processor} valueB={b.processor} />
                <SpecCompareRow
                  label="RAM"
                  valueA={`${a.ram} GB`}
                  valueB={`${b.ram} GB`}
                  winner={ramWinner}
                />
                {a.storage > 0 && b.storage > 0 && (
                  <SpecCompareRow
                    label="Storage"
                    valueA={`${a.storage} GB${a.storageType ? ` ${a.storageType}` : ""}`}
                    valueB={`${b.storage} GB${b.storageType ? ` ${b.storageType}` : ""}`}
                    winner={storageWinner}
                  />
                )}
                {(a.displayInches || b.displayInches) && (
                  <SpecCompareRow
                    label="Display"
                    valueA={a.displayInches ? `${a.displayInches}" ${a.displayType ?? ""} ${a.displayRefreshRate ? `${a.displayRefreshRate}Hz` : ""}`.trim() : "—"}
                    valueB={b.displayInches ? `${b.displayInches}" ${b.displayType ?? ""} ${b.displayRefreshRate ? `${b.displayRefreshRate}Hz` : ""}`.trim() : "—"}
                  />
                )}
                {(a.batteryCapacity || b.batteryCapacity) && (
                  <SpecCompareRow
                    label="Battery"
                    valueA={a.batteryCapacity ? `${a.batteryCapacity}${a.category === "laptops" ? " Wh" : " mAh"}` : "—"}
                    valueB={b.batteryCapacity ? `${b.batteryCapacity}${b.category === "laptops" ? " Wh" : " mAh"}` : "—"}
                    winner={batteryWinner}
                  />
                )}
                {(a.chargingWatts || b.chargingWatts) && (
                  <SpecCompareRow
                    label="Charging"
                    valueA={a.chargingWatts ? `${a.chargingWatts}W` : "—"}
                    valueB={b.chargingWatts ? `${b.chargingWatts}W` : "—"}
                    winner={determineWinner(a.chargingWatts, b.chargingWatts)}
                  />
                )}
                {(a.weightKg || b.weightKg) && (
                  <SpecCompareRow
                    label="Weight"
                    valueA={a.weightKg ? `${a.weightKg} kg` : "—"}
                    valueB={b.weightKg ? `${b.weightKg} kg` : "—"}
                    winner={weightWinner}
                  />
                )}
                {(a.os || b.os) && (
                  <SpecCompareRow
                    label="OS"
                    valueA={a.os ?? "—"}
                    valueB={b.os ?? "—"}
                  />
                )}
                <SpecCompareRow
                  label="Student Score"
                  valueA={`${a.studentScore.overall}/100`}
                  valueB={`${b.studentScore.overall}/100`}
                  winner={scoreWinner}
                />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <span className="text-primary font-medium">Highlighted</span> = better value in this category
          </p>
        </div>

        {/* Score breakdown side-by-side */}
        <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[a, b].map((product) => (
            <div key={product.id} className="rounded-xl border border-border/60 bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">{product.name} — Score Breakdown</h3>
              <ScoreBreakdown scores={product.studentScore} />
            </div>
          ))}
        </div>

        {/* Links to individual reviews */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {[a, b].map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group flex-1 flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Full {product.name} Review</p>
                <p className="text-xs text-muted-foreground">All specs, pros & cons, verdict</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>

        {/* Related comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground mb-4">Related comparisons</h2>
            <div className="space-y-2">
              {relatedComparisons.map(({ slug: cSlug, products: [pa, pb] }) => (
                <Link
                  key={cSlug}
                  href={`/compare/${cSlug}`}
                  className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-foreground truncate">{pa.name}</span>
                      <span className="text-muted-foreground shrink-0">vs</span>
                      <span className="font-medium text-foreground truncate">{pb.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{pa.category}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
