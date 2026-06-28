import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImage } from "@/components/products/ProductImage";
import { Check, X as XIcon, ExternalLink, CalendarDays } from "lucide-react";
import {
  getAllProducts, getProductBySlug, getRelatedProducts, getAllComparisons, formatINR,
} from "@/lib/data";
import { getRelevantGumroadProducts } from "@/config/gumroad";
import { AffiliateButton } from "@/components/products/AffiliateButton";
import { GumroadCTA } from "@/components/products/GumroadCTA";
import { EmailCapture } from "@/components/products/EmailCapture";
import { ScoreRing, ScoreBreakdown } from "@/components/products/ScoreRing";
import { ProductCard } from "@/components/products/ProductCard";
import { QuickVerdict } from "@/components/products/QuickVerdict";
import { StickyMobileCTA } from "@/components/products/StickyMobileCTA";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import generatedContent from "@/data/generated/products.json";

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.name} Review — Is It Worth It for CSE Students?`;
  const description = `Independent ${product.name} review for Indian students. Specs, pros & cons, Student Score (${product.studentScore.overall}/100), and who should actually buy it.`;

  return {
    title,
    description,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: product.imageUrl, alt: product.name }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);
  const comparisons = getAllComparisons()
    .filter(({ products: [a, b] }) => a.slug === slug || b.slug === slug)
    .slice(0, 4);
  const gumroadProducts = getRelevantGumroadProducts(product.category, product.bestForTags);
  const content = (generatedContent as Record<string, { intro?: string; verdict?: string }>)[slug];

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
    { name: product.name, href: `/product/${slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: content?.intro ?? product.pros.join(". "),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      price: product.priceINR,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: product.amazonUrl,
      seller: { "@type": "Organization", name: "Amazon India" },
    },
    review: {
      "@type": "Review",
      author: { "@type": "Person", name: siteConfig.author.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: (product.studentScore.overall / 20).toFixed(1),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: content?.verdict ?? "",
      datePublished: product.lastUpdated,
    },
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

  // Spec rows
  const specs = [
    product.processor && { label: "Processor", value: product.processor },
    { label: "RAM", value: `${product.ram} GB` },
    product.storage > 0 && { label: "Storage", value: `${product.storage} GB${product.storageType ? ` ${product.storageType}` : ""}` },
    product.displayInches && { label: "Display", value: `${product.displayInches}" ${product.displayType ?? ""}${product.displayRefreshRate ? ` ${product.displayRefreshRate}Hz` : ""}` },
    product.batteryCapacity && { label: "Battery", value: `${product.batteryCapacity}${product.category === "laptops" ? " Wh" : " mAh"}${product.chargingWatts ? ` · ${product.chargingWatts}W charging` : ""}` },
    product.weightKg && { label: "Weight", value: `${product.weightKg} kg` },
    product.os && { label: "OS", value: product.os },
    product.ports && product.ports.length > 0 && { label: "Ports", value: product.ports.join(", ") },
    { label: "Release Year", value: String(product.releaseYear) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">{item.name}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Main content */}
          <div>
            {/* Product header */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-3 capitalize">{product.category}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
                {product.name} Review
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="font-bold text-xl text-foreground">{formatINR(product.priceINR)}</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Updated {new Date(product.lastUpdated).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.bestForTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs capitalize">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 sm:h-80 bg-muted/30 rounded-2xl overflow-hidden mb-8 border border-border/40">
              <ProductImage
                src={product.imageUrl}
                alt={product.name}
                category={product.category}
                fill
                priority
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 640px"
              />
            </div>

            {/* Quick Verdict */}
            <QuickVerdict product={product} />

            {/* Intro */}
            {content?.intro && (
              <div className="mb-8 prose-p:text-muted-foreground prose-p:leading-relaxed">
                <h2 className="text-lg font-semibold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{content.intro}</p>
              </div>
            )}

            {/* Score breakdown */}
            <div className="mb-8 rounded-xl border border-border/60 bg-card p-5">
              <div className="flex items-center gap-6 mb-5">
                <div className="text-center">
                  <ScoreRing score={product.studentScore.overall} size={72} />
                  <p className="text-xs text-muted-foreground mt-1">Student Score</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Score breakdown</h3>
                    <Link href="/methodology" className="text-[11px] text-primary hover:underline">
                      How we score →
                    </Link>
                  </div>
                  <ScoreBreakdown scores={product.studentScore} />
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">Pros</h3>
                <ul className="space-y-2">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <h3 className="text-sm font-semibold text-red-500 dark:text-red-400 mb-3">Cons</h3>
                <ul className="space-y-2">
                  {product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <XIcon className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            {content?.verdict && (
              <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="text-sm font-semibold text-primary mb-2">Verdict</h3>
                <p className="text-sm text-foreground leading-relaxed">{content.verdict}</p>
              </div>
            )}

            {/* Specs table */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Full specs</h2>
              <div className="rounded-xl border border-border/60 overflow-hidden">
                <table className="spec-table">
                  <tbody>
                    {specs.map(({ label, value }) => (
                      <tr key={label}>
                        <td className="text-xs text-muted-foreground w-36 font-medium">{label}</td>
                        <td className="text-sm text-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gumroad CTA — only for relevant categories */}
            {gumroadProducts.map((gp) => (
              <div key={gp.id} className="mb-6">
                <GumroadCTA product={gp} />
              </div>
            ))}

            {/* Related comparisons */}
            {comparisons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Compare {product.name} with
                </h2>
                <div className="space-y-2">
                  {comparisons.map(({ slug: cSlug, products: [a, b] }) => {
                    const other = a.slug === slug ? b : a;
                    return (
                      <Link
                        key={cSlug}
                        href={`/compare/${cSlug}`}
                        className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 hover:border-primary/40 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {product.name} vs {other.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatINR(other.priceINR)}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email */}
            <EmailCapture />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Sticky buy box */}
            <div className="sticky top-20">
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatINR(product.priceINR)}</p>
                    <p className="text-xs text-muted-foreground">Approx. price</p>
                  </div>
                  <ScoreRing score={product.studentScore.overall} size={52} label="score" />
                </div>
                <AffiliateButton product={product} source="sidebar" size="lg" className="w-full" />
                <Separator />
                <div className="space-y-2">
                  {product.pros.slice(0, 3).map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      {pro}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-bold text-foreground mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky mobile CTA */}
      <StickyMobileCTA product={product} />
    </>
  );
}
