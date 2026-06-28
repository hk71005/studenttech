import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllBestLists, formatINR } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Best-of Lists — Top Tech Picks for Indian Students",
  description: "Curated best-of lists for Indian engineering students: best laptops, phones, keyboards, and accessories at every budget.",
  alternates: { canonical: "/best" },
};

export default function BestListsIndexPage() {
  const lists = getAllBestLists();

  const byCategory = {
    laptops: lists.filter((l) => l.category === "laptops"),
    phones: lists.filter((l) => l.category === "phones"),
    accessories: lists.filter((l) => l.category === "accessories"),
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">Best-of lists</h1>
        <p className="text-muted-foreground max-w-2xl">
          Every list is ranked by Student Score — a composite of performance, battery, value, and portability
          weighted specifically for Indian engineering students.
        </p>
      </div>

      {(Object.entries(byCategory) as [string, typeof byCategory[keyof typeof byCategory]][]).map(([cat, catLists]) =>
        catLists.length > 0 ? (
          <section key={cat} className="mb-12">
            <h2 className="text-lg font-bold text-foreground mb-5 capitalize">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {catLists.map((list) => (
                <Link
                  key={list.slug}
                  href={`/best/${list.slug}`}
                  className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/40 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Badge variant="outline" className="text-[10px] capitalize shrink-0">
                      {list.category}
                    </Badge>
                    {list.maxPriceINR && (
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        Under {formatINR(list.maxPriceINR)}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {list.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {list.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium">
                    Read list <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
