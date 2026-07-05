import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, HelpCircle } from "lucide-react";
import {
  getAllBestLists, getBestListBySlug, getProductsByTag, getAllComparisons, formatINR,
} from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { EmailCapture } from "@/components/products/EmailCapture";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import generatedContent from "@/data/generated/best-lists.json";

export async function generateStaticParams() {
  return getAllBestLists().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const list = getBestListBySlug(slug);
  if (!list) return {};
  return {
    title: list.title,
    description: list.description,
    alternates: { canonical: `/best/${slug}` },
    openGraph: { title: list.title, description: list.description },
  };
}

export default async function BestListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const list = getBestListBySlug(slug);
  if (!list) notFound();

  const products = getProductsByTag(list.tag, list.category, list.maxPriceINR);
  const content = (generatedContent as Record<string, {
    intro?: string;
    methodology?: string;
    faqItems?: { question: string; answer: string }[];
  }>)[slug];

  const relatedComparisons = getAllComparisons()
    .filter(({ products: [a] }) => a.category === list.category)
    .slice(0, 3);

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: list.category.charAt(0).toUpperCase() + list.category.slice(1), href: `/${list.category}` },
    { name: list.title, href: `/best/${slug}` },
  ];

  const faqItems = content?.faqItems ?? [];

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    description: list.description,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${siteConfig.url}/product/${p.slug}`,
    })),
  };

  const jsonLdFaq = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      {jsonLdFaq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />}
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
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="capitalize">{list.category}</Badge>
            {list.maxPriceINR && (
              <Badge variant="outline">Under {formatINR(list.maxPriceINR)}</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{list.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{list.description}</p>
        </div>

        {/* Intro */}
        {content?.intro && (
          <div className="mb-8 p-5 rounded-xl border border-border/60 bg-card">
            <p className="text-sm text-muted-foreground leading-relaxed">{content.intro}</p>
          </div>
        )}

        {/* Products */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-foreground">
              {products.length} {products.length === 1 ? "pick" : "picks"}, ranked
            </h2>
            <Badge variant="outline" className="text-xs">By Student Score</Badge>
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No products found for this list. Check back as we add more reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Top pick highlight */}
              {products[0] && (
                <div className="relative">
                  <div className="absolute -top-2.5 left-4 z-10">
                    <Badge className="text-[10px] px-2">
                      #1 Pick
                    </Badge>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{products[0].brand}</p>
                        <h3 className="text-lg font-bold text-foreground mb-2">{products[0].name}</h3>
                        <p className="text-2xl font-bold text-foreground mb-3">
                          {formatINR(products[0].priceINR)}
                        </p>
                        <ul className="space-y-1.5 mb-4">
                          {products[0].pros.slice(0, 3).map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/product/${products[0].slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          Read full review →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.slice(1).map((product, i) => (
                  <ProductCard key={product.id} product={product} rank={i + 2} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Methodology note */}
        {content?.methodology && (
          <div className="mb-10 p-5 rounded-xl border border-border/60 bg-card">
            <h2 className="text-sm font-semibold text-foreground mb-2">How these are rated</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{content.methodology}</p>
            <Link href="/methodology" className="text-xs text-primary hover:underline mt-2 inline-block">
              Full methodology →
            </Link>
          </div>
        )}

        {/* FAQ */}
        {faqItems.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div key={i} className="rounded-xl border border-border/60 bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">Related comparisons</h2>
            <div className="space-y-2">
              {relatedComparisons.map(({ slug: cSlug, products: [a, b] }) => (
                <Link
                  key={cSlug}
                  href={`/compare/${cSlug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 hover:border-primary/40 transition-all duration-200"
                >
                  <p className="text-sm font-medium text-foreground flex-1">
                    {a.name} vs {b.name}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">Compare →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <EmailCapture />
      </div>
    </>
  );
}
