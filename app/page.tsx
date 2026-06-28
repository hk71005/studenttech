import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Shield, IndianRupee } from "lucide-react";
import { getFeaturedProducts, getAllBestLists, getAllComparisons, categoryMeta, formatINR } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { EmailCapture } from "@/components/products/EmailCapture";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/fade-in";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default function HomePage() {
  const featured = getFeaturedProducts(6);
  const bestLists = getAllBestLists().slice(0, 4);
  const comparisons = getAllComparisons().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-16 pb-14 text-center">
        <Badge variant="secondary" className="mb-5 text-xs px-3 py-1">
          Honest reviews by a CS student, for CS students
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5 leading-[1.08]">
          Tech picks that{" "}
          <span className="text-primary">actually matter</span>
          <br className="hidden sm:block" />
          {" "}for Indian students
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8 leading-relaxed">
          No paid placements. No vague advice. Real specs, real prices in ₹, and a CS-student verdict on every product.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/laptops">
              Browse Laptops <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/compare">Compare Products</Link>
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          {[
            { icon: Shield, text: "No paid placements" },
            { icon: IndianRupee, text: "All prices in ₹INR" },
            { icon: Zap, text: "Updated monthly" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Object.entries(categoryMeta) as [keyof typeof categoryMeta, (typeof categoryMeta)[keyof typeof categoryMeta]][]).map(([cat, meta]) => (
            <Link
              key={cat}
              href={`/${cat}`}
              className="group rounded-xl border border-border/50 bg-card p-6 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              <div className="text-3xl mb-3">{meta.emoji}</div>
              <h2 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {meta.title}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {meta.description}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                Browse {meta.title} <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Top student picks</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Ranked by Student Score — real usage, not benchmarks alone.</p>
          </div>
        </div>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Best lists */}
      <section className="pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Best-of lists</h2>
          <Link href="/best" className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bestLists.map((list) => (
            <StaggerItem key={list.slug}>
              <Link
                href={`/best/${list.slug}`}
                className="group block rounded-xl border border-border/50 bg-card p-5 hover:border-primary/40 transition-all duration-200 h-full"
              >
                <Badge variant="outline" className="text-[10px] mb-2 capitalize">
                  {list.category}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                  {list.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{list.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                  Read list <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* Latest comparisons */}
      <section className="pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Head-to-head comparisons</h2>
          <Link href="/compare" className="text-xs text-primary hover:underline flex items-center gap-1">
            All comparisons <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {comparisons.map(({ slug, products: [a, b] }) => (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-foreground truncate">{a.name}</span>
                  <span className="text-muted-foreground shrink-0">vs</span>
                  <span className="font-medium text-foreground truncate">{b.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{formatINR(a.priceINR)}</span>
                  <span>·</span>
                  <span>{formatINR(b.priceINR)}</span>
                  <span>·</span>
                  <span className="capitalize">{a.category}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Email capture */}
      <section className="pb-16 max-w-lg mx-auto">
        <EmailCapture />
      </section>
    </div>
  );
}
