import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MascotAccent } from "@/components/layout/MascotAccent";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Student Deal Season Guide — When to Buy Tech in India",
  description:
    "A practical guide for Indian students on when and how to buy tech during Amazon Great Indian Festival, Flipkart Big Billion Days, Prime Day, and Republic Day sales.",
  alternates: { canonical: "/deals" },
  openGraph: {
    title: "Student Deal Season Guide — When to Buy Tech in India",
    description:
      "Learn the best times to buy laptops, phones, and accessories in India. Price tracking tips, sale calendar, and smart shopping strategies.",
  },
};

const faqItems = [
  {
    question: "When is the best time to buy a laptop in India?",
    answer:
      "The best prices typically appear during the Amazon Great Indian Festival (September–October) and Flipkart Big Billion Days. Republic Day sales (January) are also strong for electronics. Avoid buying in July–August when prices tend to be highest before festive season.",
  },
  {
    question: "How do I track price history on Amazon India?",
    answer:
      "Use browser extensions or websites that track Amazon.in price history. They let you see the lowest-ever price for any product so you know whether a 'deal' is genuinely good or just the regular price shown as a discount.",
  },
  {
    question: "Are student discounts available on laptops in India?",
    answer:
      "Apple offers education pricing through their online education store. Some brands run campus ambassador programs with extra discounts. Amazon and Flipkart occasionally offer student-specific coupons during back-to-school periods.",
  },
  {
    question: "Should I buy during flash sales?",
    answer:
      "Flash sales can offer genuine discounts, but many 'lightning deals' inflate the MRP first. Always compare the sale price against tracked price history before buying. If the price is near its all-time low, it's a good deal.",
  },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function DealsPage() {
  const breadcrumb = [
    { name: "Home", href: "/" },
    { name: "Deal Season Guide", href: "/deals" },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <MascotAccent src="mascot-budget.webp" position="bottom-right" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
          {breadcrumb.map((item, i) => (
            <span key={item.href} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-foreground">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-10">
          <Badge variant="secondary" className="mb-4">
            📅 Evergreen Guide
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
            Student Deal Season Guide: When & How to Buy Tech in India
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Indian e-commerce runs massive sales several times a year. As a student on a budget,
            timing your purchase right can save you thousands. Here&apos;s everything you need to know.
          </p>
        </div>

        {/* Sale Calendar */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            🗓️ India&apos;s Major Tech Sale Calendar
          </h2>
          <div className="space-y-3">
            {[
              {
                name: "Republic Day Sale",
                when: "January 15–26",
                note: "Good discounts on laptops and accessories. Stock clearing before new models.",
              },
              {
                name: "Amazon Prime Day",
                when: "July (varies)",
                note: "Prime members only. Strong deals on Amazon devices, headphones, and storage.",
              },
              {
                name: "Amazon Great Indian Festival",
                when: "September–October",
                note: "The biggest sale of the year. Best time to buy laptops and phones. SBI card extra 10% off is common.",
              },
              {
                name: "Flipkart Big Billion Days",
                when: "September–October",
                note: "Runs alongside Amazon's festival sale. Often has exclusive phone launches at discounted prices.",
              },
              {
                name: "Diwali Sales",
                when: "October–November",
                note: "Extended festive deals. Good for accessories and peripherals.",
              },
              {
                name: "Year-End / New Year Sale",
                when: "December–January",
                note: "Clearance deals on older models. Great if you don't need the latest generation.",
              },
            ].map((sale) => (
              <div
                key={sale.name}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {sale.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sale.note}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {sale.when}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Shopping Tips */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            🧠 Smart Shopping Tips for Students
          </h2>
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
            {[
              {
                title: "Track prices before buying",
                body: "Use price tracking tools to check if a 'deal' is actually below the typical selling price. Many products show inflated MRPs with fake discounts. A genuine deal is one where the price is near or below its historical low.",
              },
              {
                title: "Use bank card offers wisely",
                body: "Most big sales offer 10% instant discount on specific bank cards (SBI, ICICI, HDFC rotate). The discount is capped (usually ₹1,000–₹2,000) but stacks with the sale price.",
              },
              {
                title: "Add to cart early",
                body: "During flash sales, popular items sell out in minutes. Add products to your cart and wishlist before the sale starts. Set reminders for the exact start time.",
              },
              {
                title: "Compare across platforms",
                body: "Amazon and Flipkart often run competing sales. Check both platforms — the same laptop can differ by ₹2,000–₹5,000 between them.",
              },
              {
                title: "Consider refurbished and open-box",
                body: "Amazon Renewed and Flipkart Refurbished offer significant savings on laptops and phones with warranties. A refurbished MacBook Air can save ₹15,000–₹20,000.",
              },
              {
                title: "Don't buy impulsively",
                body: "A sale doesn't make a bad product good. Decide what you need before the sale starts and stick to your list. Our Student Scores can help you narrow it down.",
              },
            ].map((tip) => (
              <div key={tip.title}>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {tip.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What to Buy When */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            📱 What to Buy When
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                category: "Laptops",
                best: "Great Indian Festival (Sep–Oct)",
                tip: "Expect ₹5K–₹15K off. New models launch Jan–Mar, so previous gen drops during festive sales.",
                link: "/laptops",
              },
              {
                category: "Phones",
                best: "Big Billion Days + New launches",
                tip: "Phone brands time launches around festive season with introductory pricing. Also check Amazon Prime Day.",
                link: "/phones",
              },
              {
                category: "Headphones & Earbuds",
                best: "Prime Day + Republic Day",
                tip: "Audio products see consistent discounts. Sony/JBL often drop 20–30% during Prime Day.",
                link: "/accessories",
              },
              {
                category: "Keyboards & Mice",
                best: "Any major sale",
                tip: "Accessories have smaller discounts but stack well with bank offers. Keychron restocks during sales.",
                link: "/accessories",
              },
            ].map((item) => (
              <Link
                key={item.category}
                href={item.link}
                className="group block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 transition-all duration-200"
              >
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {item.category}
                </h3>
                <p className="text-xs text-primary font-medium mb-1.5">
                  Best: {item.best}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.tip}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary font-medium">
                  Browse picks <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Related budget resources
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Budget Hub", href: "/budget" },
              { label: "Laptops Under ₹40K", href: "/best/best-laptops-under-40000" },
              { label: "Phones Under ₹15K", href: "/best/best-phones-under-15000" },
              { label: "Earbuds Under ₹2K", href: "/best/best-earbuds-for-students-under-2000" },
              { label: "Find My Tech Quiz", href: "/finder" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-foreground hover:border-primary/40 hover:text-primary transition-all duration-150"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/60 bg-card p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {item.question}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
