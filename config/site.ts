// SINGLE SOURCE OF TRUTH — edit brand/tagline/accent here only
export const siteConfig = {
  name: "StudentTech India", // TODO: change brand name here
  tagline: "Independent tech reviews for Indian students", // TODO: update tagline
  description:
    "Independent tech reviews, comparisons, and buying guides for engineering & college students in India. Real specs, transparent Student Scores, and clear buying recommendations.",
  url: "https://studenttech.kanvi.app", // live domain (Vercel + name.com subdomain)
  accentColor: "#6366f1", // indigo-500 — ONE accent, used exclusively
  accentColorDark: "#818cf8", // indigo-400 for dark mode
  author: {
    name: "StudentTech India Editorial",
    bio: "An independent publication reviewing laptops, phones, and dev gear for Indian students — no sponsorships, no paid placements.",
    avatar: "/images/author.jpg",
    social: {
      twitter: "",
      github: "",
      linkedin: "",
    },
  },
  locale: "en-IN",
  currency: "INR",
  currencySymbol: "₹",
  marketplace: "amazon.in",
  nav: [
    { label: "Phones", href: "/phones" },
    { label: "Laptops", href: "/laptops" },
    { label: "Accessories", href: "/accessories" },
    { label: "Career & Dev", href: "/career" },
    { label: "Compare", href: "/compare" },
    { label: "Budget", href: "/budget" },
    { label: "Find My Tech", href: "/finder" },
  ],
};
