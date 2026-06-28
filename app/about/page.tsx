import type { Metadata } from "next";
import Link from "next/link";
import { Code2, MessageCircle, Link2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Who Writes These Reviews?",
  description: `${siteConfig.author.name} is a CS engineering student reviewing tech gear for Indian college students. No sponsorships, no paid placements.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="relative h-24 w-24 mx-auto mb-5 rounded-full overflow-hidden bg-muted border border-border/60 flex items-center justify-center">
          {/* TODO: add your photo to /public/images/author.jpg */}
          <span className="text-3xl font-bold text-primary">
            {siteConfig.author.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Hey, I'm {siteConfig.author.name}</h1>
        <p className="text-muted-foreground">{siteConfig.author.bio}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          {siteConfig.author.social.twitter && (
            <a href={siteConfig.author.social.twitter} rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter/X">
              <MessageCircle className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.github && (
            <a href={siteConfig.author.social.github} rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Code2 className="h-4 w-4" />
            </a>
          )}
          {siteConfig.author.social.linkedin && (
            <a href={siteConfig.author.social.linkedin} rel="noopener noreferrer" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
              <Link2 className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Why I built this</h2>
          <p>
            Before buying my first laptop for engineering, I spent weeks wading through YouTube videos where every reviewer
            had been gifted the product, and tech blogs where every "recommendation" linked to something suspiciously priced
            well above my budget. I made a mediocre purchase. I don't want you to.
          </p>
          <p className="mt-3">
            {siteConfig.name} is the resource I wish existed when I was about to start my CS degree —
            real spec analysis, student-specific scoring, and honest opinions from someone who uses these
            products in lecture halls, hostels, and marathon coding sessions. Not a press demo room.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">How I score products</h2>
          <p>
            Every product gets a Student Score (0–100) across four sub-categories: Performance, Battery, Value, and Portability.
            Display is added for screens and laptops. These scores reflect real-world student usage — not gaming benchmarks or
            camera sensor specifications nobody actually cares about during exams.
          </p>
          <p className="mt-3">
            I test laptops specifically with a student workload: VS Code, Android Studio with an emulator, Chrome with 15 tabs,
            and a local dev server. Phones are tested for camera in actual campus lighting, call quality in noisy environments,
            and battery life during a typical college day.
          </p>
          <p className="mt-3">
            <Link href="/methodology" className="text-primary hover:underline">Read the full methodology →</Link>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Monetization & independence</h2>
          <p>
            This site earns via Amazon Associates affiliate links. When you click a link and buy something, I get a small
            commission — at zero extra cost to you. This lets me keep the site running without charging for access.
          </p>
          <p className="mt-3">
            <strong className="text-foreground">What this doesn't mean:</strong> no brand has ever paid me to rank their product higher.
            No product has been sent to me in exchange for a positive review. My Student Score rankings follow the data,
            not the affiliate commission rates. Sometimes the product I recommend pays less commission than the alternative.
            That's fine.
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
