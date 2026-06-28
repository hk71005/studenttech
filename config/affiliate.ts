// Amazon Associates configuration
export const affiliateConfig = {
  amazonTag: "studenttec095-21", // amazon.in Associates tag
  amazonDomain: "https://www.amazon.in",
  disclosureText:
    "We earn a commission from qualifying Amazon purchases at no extra cost to you. Prices and availability may change — always verify on Amazon before buying.",
  linkAttrs: {
    rel: "sponsored nofollow",
    target: "_blank",
  },
};

/** Appends the Associates tag to an amazon.in product URL */
export function buildAffiliateUrl(asin: string): string {
  return `https://www.amazon.in/dp/${asin}?tag=${affiliateConfig.amazonTag}&linkCode=ogi&th=1&psc=1`;
}

/** Returns the /go/ cloaked redirect URL for an ASIN */
export function buildRedirectUrl(asin: string): string {
  return `/go/${asin}`;
}
