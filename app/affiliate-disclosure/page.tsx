import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Full affiliate and advertising disclosure for " + siteConfig.name,
  alternates: { canonical: "/affiliate-disclosure" },
  robots: { index: true, follow: false },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-4">Affiliate Disclosure</h1>
      <p className="text-muted-foreground mb-2 text-sm">Last updated: January 2025</p>

      <div className="space-y-8 mt-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Amazon Associates</h2>
          <p>
            {siteConfig.name} is a participant in the Amazon Associates Programme, an affiliate advertising
            programme designed to provide a means for sites to earn advertising fees by advertising and linking
            to amazon.in.
          </p>
          <p className="mt-3">
            When you click an Amazon link on this site and make a qualifying purchase, we earn a small
            commission — at <strong className="text-foreground">zero additional cost to you</strong>. The price
            you pay is identical whether you arrive at Amazon through our link or directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">How it affects our recommendations</h2>
          <p>
            It doesn't. Our Student Score rankings and recommendations follow the spec data and testing results.
            We sometimes recommend products where the affiliate commission rate is lower than alternatives we don't
            recommend. If we think a product isn't worth your money, we say so — even if recommending it would
            pay us more.
          </p>
          <p className="mt-3">
            No brand has paid for placement, sponsored rankings, or positive coverage. If that ever changes,
            it will be disclosed clearly and prominently on the relevant page.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Price accuracy</h2>
          <p>
            Prices shown on this site are approximations at the time of last update and may not reflect current
            Amazon pricing. Always verify the current price on Amazon before purchasing. We display a "last
            updated" date on every product review.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Digital products (Gumroad)</h2>
          <p>
            This site may link to digital products (guides, roadmaps) sold on Gumroad. These are created by
            the site author and are disclosed in context. These are not affiliate links — we earn the full sale
            price directly.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Compliance</h2>
          <p>
            This disclosure is in accordance with the Federal Trade Commission (FTC) guidelines on endorsements
            and testimonials, and the Advertising Standards Council of India (ASCI) guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Questions?</h2>
          <p>
            If you have questions about this disclosure or our editorial independence, please{" "}
            <a href="/contact" className="text-primary hover:underline">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
