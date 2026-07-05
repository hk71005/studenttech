import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Shield, IndianRupee, BookOpen } from "lucide-react";
import { getFeaturedProducts, getAllProducts, getAllBestLists, getAllComparisons, categoryMeta, formatINR } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import { HeroMascot } from "@/components/layout/HeroMascot";
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

  // Editor's Budget Picks: cheap impulse buys (< ₹1,500), hero deal first,
  // then the rest ordered by biggest genuine discount.
  const BUDGET_HERO = "prodot-5in1-wired-combo";
  const budgetPool = getAllProducts().filter((p) => p.priceINR < 1500);
  const heroPick = budgetPool.filter((p) => p.slug === BUDGET_HERO);
  const otherPicks = budgetPool
    .filter((p) => p.slug !== BUDGET_HERO)
    .sort((a, b) => {
      const da = a.mrpINR && a.mrpINR > a.priceINR ? (a.mrpINR - a.priceINR) / a.mrpINR : 0;
      const db = b.mrpINR && b.mrpINR > b.priceINR ? (b.mrpINR - b.priceINR) / b.mrpINR : 0;
      return db - da;
    });
  const budgetPicks = [...heroPick, ...otherPicks].slice(0, 10);

  return (
    <>
      <HeroMascot />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-16 pb-14 text-center">
        <Badge variant="secondary" className="mb-5 text-xs px-3 py-1">
          Independent reviews · No paid rankings
        </Badge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-5 leading-[1.08]">
          Tech picks that{" "}
          <span className="text-primary">actually matter</span>
          <br className="hidden sm:block" />
          {" "}for Indian students
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8 leading-relaxed">
          No paid placements. No vague advice. Real specs, real prices in ₹, and a clear verdict on every product.
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
            { icon: Shield, text: "No paid placements", href: undefined },
            { icon: IndianRupee, text: "All prices in ₹INR", href: undefined },
            { icon: Zap, text: "Updated monthly", href: undefined },
            { icon: BookOpen, text: "Transparent methodology", href: "/methodology" },
          ].map(({ icon: Icon, text, href }) => (
            href ? (
              <a key={text} href={href} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {text}
              </a>
            ) : (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {text}
              </div>
            )
          ))}
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="pb-10">
        <Link
          href="/finder"
          className="group flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200"
        >
          <span className="text-2xl shrink-0" role="img" aria-hidden="true">🎯</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Not sure what to buy?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Take the 30-second quiz and find your perfect student tech →
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
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

      {/* Editor's Budget Picks */}
      {budgetPicks.length > 0 && (
        <section className="pb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Editor&apos;s budget picks</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Cheap, high-value buys under ₹1,500 — biggest student deals first. Scroll for more →
              </p>
            </div>
            <Link href="/budget" className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0">
              All budget picks <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <StaggerChildren className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scroll-px-4 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
            {budgetPicks.map((product) => (
              <StaggerItem
                key={product.id}
                className="w-[78vw] sm:w-[260px] shrink-0 snap-start"
              >
                <ProductCard
                  product={product}
                  showCompare={false}
                  highlight={product.slug === BUDGET_HERO}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}

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
    </>
  );
}
