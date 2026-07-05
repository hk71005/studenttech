import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllProducts, formatINR } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { MascotAccent } from "@/components/layout/MascotAccent";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Budget Tech for Students — Best Picks Under Every Price",
  description:
    "The best phones, laptops, and accessories for Indian students on a budget. Every pick ranked by Student Score with real prices in ₹.",
  alternates: { canonical: "/budget" },
  openGraph: {
    title: "Budget Tech for Students — Best Picks Under Every Price",
    description:
      "Phones under ₹15K, laptops under ₹40K, accessories under ₹2K — the best student budget picks.",
  },
};

export default function BudgetPage() {
  const all = getAllProducts();

  const phonesUnder15K = all
    .filter((p) => p.category === "phones" && p.priceINR < 15000)
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall);

  const laptopsUnder40K = all
    .filter((p) => p.category === "laptops" && p.priceINR < 40000)
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall);

  const accessoriesUnder2K = all
    .filter((p) => p.category === "accessories" && p.priceINR < 2000)
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall);

  // "Best full setup under ₹60K" — pick top laptop under 40K, top keyboard under 7K, top mouse under 2K
  const setupLaptop = laptopsUnder40K[0];
  const setupKeyboard = all
    .filter(
      (p) =>
        p.category === "accessories" &&
        p.priceINR < 7000 &&
        p.bestForTags.includes("typing"),
    )
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall)[0];
  const setupMouse = all
    .filter(
      (p) =>
        p.category === "accessories" &&
        p.priceINR < 2000 &&
        !p.bestForTags.includes("typing") &&
        !p.bestForTags.includes("audio"),
    )
    .sort((a, b) => b.studentScore.overall - a.studentScore.overall)[0];
  const setupPicks = [setupLaptop, setupKeyboard, setupMouse].filter(Boolean);
  const setupTotal = setupPicks.reduce((sum, p) => sum + p.priceINR, 0);

  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Budget Picks", href: "/budget" },
  ];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <MascotAccent src="mascot-budget.webp" position="bottom-right" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-10">
          <Badge variant="secondary" className="mb-4">
            💰 Budget Guide
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Best Budget Tech for Students
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Every pick below is ranked by our Student Score and verified at real
            ₹ prices. No fake discounts — just honest value.
          </p>
          <Link
            href="/deals"
            className="group mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            💡 Timing matters too — see when prices actually drop in our Deal Season Guide
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Phones under ₹15K */}
        {phonesUnder15K.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                📱 Phones under ₹15,000
              </h2>
              <Link
                href="/best/best-phones-under-15000"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Full list <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {phonesUnder15K.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={i + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Laptops under ₹40K */}
        {laptopsUnder40K.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                💻 Laptops under ₹40,000
              </h2>
              <Link
                href="/best/best-laptops-under-40000"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Full list <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {laptopsUnder40K.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={i + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Accessories under ₹2K */}
        {accessoriesUnder2K.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">
                ⌨️ Accessories under ₹2,000
              </h2>
              <Link
                href="/best/best-earbuds-for-students-under-2000"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Full list <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {accessoriesUnder2K.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={i + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Best setup under ₹60K */}
        {setupPicks.length > 0 && (
          <section className="mb-12">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-foreground">
                🖥️ Best full setup under ₹60,000
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Laptop + keyboard + mouse — total approx.{" "}
                {formatINR(setupTotal)}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {setupPicks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
