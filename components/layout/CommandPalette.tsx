"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Laptop, Smartphone, Keyboard, TrendingUp, FileText, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/types/product";
import { formatINR } from "@/lib/data";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
}

const categoryIcon: Record<string, React.ReactNode> = {
  phones: <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />,
  laptops: <Laptop className="h-4 w-4 shrink-0 text-muted-foreground" />,
  accessories: <Keyboard className="h-4 w-4 shrink-0 text-muted-foreground" />,
};

const staticLinks = [
  { label: "Best Laptops for CSE under ₹50K", href: "/best/best-laptops-for-cse-students-under-50000", icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  { label: "Best Phones under ₹15K", href: "/best/best-phones-under-15000", icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  { label: "Best Mechanical Keyboards", href: "/best/best-mechanical-keyboards-for-coding", icon: <TrendingUp className="h-4 w-4 text-muted-foreground" /> },
  { label: "Career & Dev Resources", href: "/career", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
  { label: "Methodology", href: "/methodology", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
];

export function CommandPalette({ open, onOpenChange, products }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.bestForTags.some((t) => t.includes(q))
    ).slice(0, 6);
  }, [query, products]);

  const filteredLinks = React.useMemo(() => {
    if (!query.trim()) return staticLinks;
    const q = query.toLowerCase();
    return staticLinks.filter((l) => l.label.toLowerCase().includes(q));
  }, [query]);

  function navigate(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, comparisons, guides..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            onKeyDown={(e) => {
              if (e.key === "Escape") onOpenChange(false);
            }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground text-xs">
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto py-2">
          {/* Products */}
          {filtered.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Products
              </p>
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
                >
                  {categoryIcon[p.category]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{formatINR(p.priceINR)} · {p.category}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Quick links */}
          {filteredLinks.length > 0 && (
            <div>
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {query ? "Guides & Pages" : "Quick Links"}
              </p>
              {filteredLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-left"
                >
                  {link.icon}
                  <span className="text-sm text-foreground flex-1">{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {query && filtered.length === 0 && filteredLinks.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border/40 px-4 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">Esc</kbd> close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
