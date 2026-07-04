import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-sm font-bold text-foreground hover:text-primary transition-colors">
              {siteConfig.name}
            </Link>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              By {siteConfig.author.name}
            </p>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Reviews</p>
            <ul className="space-y-2">
              {[
                { label: "Phones", href: "/phones" },
                { label: "Laptops", href: "/laptops" },
                { label: "Accessories", href: "/accessories" },
                { label: "Compare", href: "/compare" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buying guides */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Buying Guides</p>
            <ul className="space-y-2">
              {[
                { label: "Budget Picks", href: "/budget" },
                { label: "Deal Season Guide", href: "/deals" },
                { label: "Best Laptops under ₹50K", href: "/best/best-laptops-for-cse-students-under-50000" },
                { label: "Best Phones under ₹15K", href: "/best/best-phones-under-15000" },
                { label: "Career & Dev", href: "/career" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Info</p>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "Methodology", href: "/methodology" },
                { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-6 bg-border/40" />

        {/* Affiliate disclosure banner */}
        <div className="mb-6 rounded-lg border border-border/40 bg-muted/30 px-4 py-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Affiliate Disclosure:</span>{" "}
            {siteConfig.name} participates in the Amazon Associates programme (Amazon.in).
            We earn a small commission on qualifying purchases — at zero extra cost to you.
            All recommendations are based on genuine research and hands-on evaluation.
            Prices and availability may change; always verify on Amazon before buying.{" "}
            <Link href="/affiliate-disclosure" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Full disclosure →
            </Link>
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
