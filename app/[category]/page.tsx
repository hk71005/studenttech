import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProductsByCategory, categoryMeta, getAllComparisons, getAllBestLists, formatINR } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/product";

const validCategories: Category[] = ["phones", "laptops", "accessories"];

export async function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) return {};
  const meta = categoryMeta[category as Category];
  return {
    title: `Best ${meta.title} for Indian Students`,
    description: meta.description,
    alternates: { canonical: `/${category}` },
    openGraph: { title: `Best ${meta.title} for Indian Students`, description: meta.description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) notFound();

  const cat = category as Category;
  const meta = categoryMeta[cat];
  const products = getProductsByCategory(cat).sort(
    (a, b) => b.studentScore.overall - a.studentScore.overall
  );
  const comparisons = getAllComparisons()
    .filter(({ products: [a] }) => a.category === cat)
    .slice(0, 4);
  const bestLists = getAllBestLists().filter((b) => b.category === cat);

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: meta.title, href: `/${cat}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Best ${meta.title} for Indian Students`,
    description: meta.description,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `/product/${p.slug}`,
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="text-3xl mb-3">{meta.emoji}</div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Best {meta.title} for Indian Students
          </h1>
          <p className="text-muted-foreground max-w-2xl">{meta.description}</p>
        </div>

        {/* Best lists for this category */}
        {bestLists.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Curated Lists
            </h2>
            <div className="flex flex-wrap gap-3">
              {bestLists.map((list) => (
                <Link
                  key={list.slug}
                  href={`/best/${list.slug}`}
                  className="group flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-2.5 text-sm text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
                >
                  {list.title}
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products grid — with filter + sort */}
        <div className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-6">
            All {meta.title} ({products.length} products)
          </h2>
          <FilteredProductGrid products={products} category={cat} />
        </div>

        {/* Related comparisons */}
        {comparisons.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              {meta.title} comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparisons.map(({ slug, products: [a, b] }) => (
                <Link
                  key={slug}
                  href={`/compare/${slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {a.name} <span className="text-muted-foreground">vs</span> {b.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatINR(a.priceINR)} vs {formatINR(b.priceINR)}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
