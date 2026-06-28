import type { Metadata } from "next";
import { getAllProducts } from "@/lib/data";
import { TechFinder } from "@/components/finder/TechFinder";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Find Your Perfect Student Tech — Quiz",
  description:
    "Answer 4 quick questions and we'll match you with the best laptop, phone, or accessory for Indian engineering students. Based on real reviews and student scores.",
  alternates: { canonical: "/finder" },
  openGraph: {
    title: "Find Your Perfect Student Tech — Quiz",
    description:
      "Not sure what to buy? Take our 30-second quiz to find the ideal tech for your student life.",
  },
};

export default function FinderPage() {
  const products = getAllProducts();

  return <TechFinder products={products} />;
}
