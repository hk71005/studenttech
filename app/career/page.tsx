import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Briefcase, GraduationCap } from "lucide-react";
import { GumroadCTA } from "@/components/products/GumroadCTA";
import { EmailCapture } from "@/components/products/EmailCapture";
import { gumroadProducts } from "@/config/gumroad";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Career & Dev Resources for CSE Students",
  description: "Curated resources, roadmaps, and honest advice for Indian CS engineering students on internships, placements, and building projects.",
  alternates: { canonical: "/career" },
};

const resources = [
  {
    icon: Code2,
    title: "What programming language to learn first",
    description: "Python vs Java vs C++ — the honest answer depends on your goal. For competitive programming, C++. For placements, Java or Python. For web dev, JavaScript. Here's why.",
    href: "#",
    badge: "Guide",
  },
  {
    icon: Briefcase,
    title: "How to get your first CS internship in India",
    description: "The cold truth about internships at Indian tech companies: off-campus matters more than on-campus for most students, and your GitHub is reviewed before your resume.",
    href: "#",
    badge: "Career",
  },
  {
    icon: GraduationCap,
    title: "The dev setup every CS student should have",
    description: "Laptop, keyboard, external display, and software — the full setup I use for 6-8 hour coding sessions, with budget tiers.",
    href: "#",
    badge: "Setup",
  },
  {
    icon: BookOpen,
    title: "Best free resources for DSA prep",
    description: "Striver, NeetCode, LeetCode — ranked by what actually helps you crack placements at Indian product companies vs service companies.",
    href: "#",
    badge: "DSA",
  },
];

export default function CareerPage() {
  const careerGumroad = gumroadProducts.filter((p) => p.relevantCategories.includes("career"));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-4">Career & Dev</Badge>
        <h1 className="text-3xl font-bold text-foreground mb-3">Career & Dev for CS Students</h1>
        <p className="text-muted-foreground max-w-2xl">
          Honest guides on internships, placements, learning paths, and dev setups — from someone who's been
          through the grind of CSE in India.
        </p>
      </div>

      {/* Gumroad CTAs — career is the right place */}
      {careerGumroad.length > 0 && (
        <div className="mb-10 space-y-4">
          {careerGumroad.map((p) => (
            <GumroadCTA key={p.id} product={p} />
          ))}
        </div>
      )}

      {/* Resource cards */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-foreground mb-5">Guides & articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map(({ icon: Icon, title, description, href, badge }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <Badge variant="outline" className="text-[10px]">{badge}</Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium">
                Read article <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          More articles coming soon. Subscribe below to get notified.
        </p>
      </div>

      {/* Dev setup link */}
      <div className="mb-10 rounded-xl border border-border/60 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-2">Build the right setup first</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Before optimizing your career, make sure your tools aren't slowing you down. The right laptop
          and accessories make a measurable difference in how much you can build in a day.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/best/best-laptops-for-cse-students-under-50000" className="text-xs text-primary hover:underline flex items-center gap-1">
            Best laptops under ₹50K <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/best/best-mechanical-keyboards-for-coding" className="text-xs text-primary hover:underline flex items-center gap-1">
            Keyboards for coders <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/accessories" className="text-xs text-primary hover:underline flex items-center gap-1">
            Full accessories guide <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <EmailCapture />
    </div>
  );
}
