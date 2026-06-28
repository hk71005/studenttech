import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for " + siteConfig.name,
  alternates: { canonical: "/privacy-policy" },
  robots: { index: true, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-2 text-sm">Last updated: January 2025</p>

      <div className="space-y-8 mt-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Information we collect</h2>
          <p>
            <strong className="text-foreground">Email subscriptions:</strong> If you subscribe to our newsletter,
            we collect your email address. This is stored with our email service provider (TODO: ConvertKit/Buttondown)
            and used only to send the newsletter.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Analytics:</strong> We may use Google Analytics 4 or Plausible
            Analytics to understand how visitors use the site. GA4 uses cookies. Plausible is cookieless and
            privacy-focused. See the section below for how to opt out.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">Affiliate tracking:</strong> Amazon may set cookies when you
            click our affiliate links. Amazon's privacy policy governs what they collect.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">What we don't do</h2>
          <ul className="list-disc list-inside space-y-1.5 ml-2">
            <li>We don't sell your personal data</li>
            <li>We don't serve targeted advertising using your browsing data</li>
            <li>We don't use dark patterns to collect unnecessary information</li>
            <li>We don't share email addresses with third parties beyond our email provider</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Cookies</h2>
          <p>
            This site uses minimal cookies: a theme preference cookie (light/dark mode) stored locally, and
            optionally Google Analytics cookies if GA4 is configured. You can disable cookies in your browser
            settings at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Your rights</h2>
          <p>
            You can unsubscribe from our newsletter at any time via the unsubscribe link in any email.
            To request deletion of your data, contact us at the address below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">Contact</h2>
          <p>
            For privacy-related queries: <a href="/contact" className="text-primary hover:underline">contact page</a>
            {" "}or email TODO@yourdomain.com. {/* TODO: add contact email */}
          </p>
        </section>
      </div>
    </div>
  );
}
