import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with " + siteConfig.name,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-4">Contact</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Found a spec error? Want to suggest a product for review? Have a question about a buying decision?
        We read every message.
      </p>

      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Email:{" "}
          <a href="mailto:gharikrishnan710@gmail.com" className="text-primary hover:underline">
            gharikrishnan710@gmail.com
          </a>
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Response time is usually 1-3 days. For product correction requests, include the product URL and the
          specific spec that needs updating.
        </p>
      </div>
    </div>
  );
}
