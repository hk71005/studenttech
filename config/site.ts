// SINGLE SOURCE OF TRUTH — edit brand/tagline/accent here only
export const siteConfig = {
  name: "StudentTech India", // TODO: change brand name here
  tagline: "Honest tech picks for Indian CS students", // TODO: update tagline
  description:
    "Unbiased tech reviews, comparisons, and buying guides for engineering & college students in India. Real specs, student scores, and honest CS-student opinions.",
  url: "https://studenttechindia.com", // TODO: replace with your domain
  accentColor: "#6366f1", // indigo-500 — ONE accent, used exclusively
  accentColorDark: "#818cf8", // indigo-400 for dark mode
  author: {
    name: "Hari", // TODO: your name
    bio: "3rd-year CSE student who builds side projects, obsesses over keyboards, and reviews every gadget before spending a rupee.",
    avatar: "/images/author.jpg", // TODO: add your photo
    social: {
      twitter: "https://twitter.com/TODO",
      github: "https://github.com/TODO",
      linkedin: "https://linkedin.com/in/TODO",
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
    { label: "Find My Tech", href: "/finder" },
  ],
};
