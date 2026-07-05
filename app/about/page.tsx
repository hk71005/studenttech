import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Who Writes These Reviews?",
  description: `${siteConfig.name} is an independent publication reviewing tech gear for Indian college students. No sponsorships, no paid placements.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-foreground mb-3">About {siteConfig.name}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">{siteConfig.author.bio}</p>
      </div>

      <div className="prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Why this exists</h2>
          <p>
            Buying your first laptop or phone for college shouldn&apos;t mean wading through YouTube reviews where every
            gadget was gifted, and blogs where each &quot;recommendation&quot; conveniently links to something priced well
            above a student budget.
          </p>
          <p className="mt-3">
            {siteConfig.name} is built to be the resource we wish existed at the start of an engineering degree —
            real spec analysis, student-specific scoring, and honest verdicts based on how these products actually hold up
            in lecture halls, hostels, and marathon coding sessions. Not a press demo room.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How we score products</h2>
          <p>
            Every product gets a Student Score (0–100) across four sub-categories: Performance, Battery, Value, and Portability.
            Display is added for screens and laptops. These scores reflect real-world student usage — not gaming benchmarks or
            camera sensor specs nobody thinks about during exams.
          </p>
          <p className="mt-3">
            Laptops are evaluated against a real student workload: VS Code, Android Studio with an emulator, a browser with
            15 tabs, and a local dev server. Phones are judged on camera in actual campus lighting, call quality in noisy
            environments, and battery life across a typical college day.
          </p>
          <p className="mt-3">
            <Link href="/methodology" className="text-primary hover:underline">Read the full methodology →</Link>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How we stay independent</h2>
          <p>
            {siteConfig.name} earns through Amazon Associates affiliate links. When you click a link and buy something, we
            earn a small commission — at zero extra cost to you. That&apos;s what keeps the site running without charging for access.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">What that doesn&apos;t mean:</strong> no brand pays to rank higher, and no product
            is featured in exchange for a positive review. Student Score rankings follow the data, not commission rates —
            sometimes the recommended product pays less than the alternative. That&apos;s fine.
          </p>
          <p className="mt-3">
            <Link href="/affiliate-disclosure" className="text-primary hover:underline">Full affiliate disclosure →</Link>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
          <p>
            Found a spec error? Want to suggest a product for review? Have a question about a specific buying decision?
          </p>
          <div className="mt-3">
            <Button variant="outline" asChild>
              <Link href="/contact">Get in touch →</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
