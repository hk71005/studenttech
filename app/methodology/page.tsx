import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Review Methodology — How Student Scores Are Calculated",
  description: "How we research, test, and score tech products for Indian engineering students. Full methodology for the Student Score system.",
  alternates: { canonical: "/methodology" },
};

const scoreWeights = [
  { sub: "Performance", weight: 30, description: "Real-world coding/dev workload. Not benchmark scores — actual compile times, IDE responsiveness, multitasking under load." },
  { sub: "Battery", weight: 25, description: "Hours of actual college use (not manufacturer lab numbers). For laptops: screen-on coding. For phones: daily social + lecture use." },
  { sub: "Value", weight: 25, description: "Specs delivered relative to price. A ₹15K phone scoring 80 on value means it punches well above its weight class." },
  { sub: "Portability", weight: 20, description: "Weight, form factor, and how it fits into daily college bag carry. Heavier = lower, but we adjust for what the weight buys you." },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground mb-4">How we score products</h1>
      <p className="text-muted-foreground mb-10 leading-relaxed">
        Every product on {siteConfig.name} gets a Student Score from 0–100, composed of four weighted sub-scores.
        Here's exactly how we calculate it and why.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-5">Student Score formula</h2>
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <table className="spec-table w-full">
            <thead>
              <tr className="bg-muted/30">
                <th>Sub-score</th>
                <th>Weight</th>
                <th>What we measure</th>
              </tr>
            </thead>
            <tbody>
              {scoreWeights.map(({ sub, weight, description }) => (
                <tr key={sub}>
                  <td className="font-medium text-foreground text-sm">{sub}</td>
                  <td className="text-primary font-semibold text-sm">{weight}%</td>
                  <td className="text-xs text-muted-foreground">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Formula: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">Overall = (Performance × 0.30) + (Battery × 0.25) + (Value × 0.25) + (Portability × 0.20)</code>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Screens and laptops get an optional Display sub-score (0–100), shown separately but not currently factored into the weighted overall to keep cross-category comparisons fair.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">How we test laptops</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">Performance test:</strong> VS Code with 10+ files open, Android Studio with an emulator running a debug build, Chrome with 15 tabs, and a local Node.js dev server — simultaneously. We measure responsiveness under this realistic student workload, not synthetic benchmarks.</p>
          <p><strong className="text-foreground">Battery test:</strong> Screen brightness at 60%, WiFi on, coding in VS Code with background syncing. We run this until the battery hits 10%, then calculate real-world hours. Manufacturer claims are always higher.</p>
          <p><strong className="text-foreground">Thermals:</strong> 30-minute continuous compile workload. We note whether the fan becomes intrusive in a quiet library environment.</p>
          <p><strong className="text-foreground">Keyboard:</strong> 1-hour typing session. We note flex, key travel, and whether it causes wrist fatigue.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">How we test phones</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p><strong className="text-foreground">Performance:</strong> App launch times, multitasking between WhatsApp, browser, camera, and YouTube, and the Android Studio project cloning experience where relevant.</p>
          <p><strong className="text-foreground">Battery:</strong> Simulated college day: 2 hours of YouTube (100% brightness), 3 hours of mixed social/browser use, 30 minutes of GPS navigation. Measured from 100% to 20%.</p>
          <p><strong className="text-foreground">Camera:</strong> Tested in three conditions: bright outdoor Indian sun, indoor lecture hall, and low-light hostel room. We prioritize practical photo quality, not studio charts.</p>
          <p><strong className="text-foreground">Call quality:</strong> Tested in noisy environments (canteen, street) for microphone isolation and earpiece loudness.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-foreground mb-4">Independence & transparency</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>No products are gifted in exchange for positive coverage. If a product is provided for review, it's disclosed prominently.</p>
          <p>Affiliate commissions do not influence rankings. The recommended product may earn less commission than alternatives — that's intentional.</p>
          <p>Prices are spot-checked regularly but may change. We include a "last updated" date on every review and recommend verifying on Amazon before buying.</p>
          <p>Scores may be revised when significant software updates change a product's real-world behavior.</p>
        </div>
      </section>
    </div>
  );
}
