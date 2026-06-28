// Gumroad digital products — shown ONLY on contextually relevant pages
// TODO: Replace placeholder URLs and add your actual Gumroad product links

export interface GumroadProduct {
  id: string;
  title: string;
  description: string;
  cta: string; // natural copy, NOT "BUY MY PDF"
  url: string; // TODO: replace with actual Gumroad links
  price: string;
  relevantCategories: string[]; // show only on these category/tag pages
  relevantTags: string[];
}

export const gumroadProducts: GumroadProduct[] = [
  {
    id: "cse-roadmap",
    title: "The Complete CSE Student Roadmap",
    description:
      "Week-by-week study plan for 4 years of CSE — projects, skills, and resources that actually get you hired.",
    cta: "Want a clear week-by-week roadmap through all 4 years of CSE, with real project ideas and a skill tracker?",
    url: "https://yourgumroadhandle.gumroad.com/l/cse-roadmap", // TODO
    price: "₹499",
    relevantCategories: ["career"],
    relevantTags: ["coding", "career", "dev-setup"],
  },
  {
    id: "laptop-buyers-guide",
    title: "The Indian CS Student Laptop Buying Guide 2025",
    description:
      "Deep-dive PDF guide: what specs actually matter, red flags to avoid, and exactly which configs to buy at each budget.",
    cta: "Want the full 40-page guide with config recommendations at every budget, plus a comparison spreadsheet?",
    url: "https://yourgumroadhandle.gumroad.com/l/laptop-guide", // TODO
    price: "₹299",
    relevantCategories: ["laptops"],
    relevantTags: ["coding", "budget", "performance"],
  },
];

/** Returns Gumroad products relevant to a given category/tag */
export function getRelevantGumroadProducts(
  category: string,
  tags: string[] = []
): GumroadProduct[] {
  return gumroadProducts.filter(
    (p) =>
      p.relevantCategories.includes(category) ||
      tags.some((t) => p.relevantTags.includes(t))
  );
}
