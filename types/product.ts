export type Category = "phones" | "laptops" | "accessories";

export type BestForTag =
  | "coding"
  | "gaming"
  | "note-taking"
  | "budget"
  | "performance"
  | "portability"
  | "battery-life"
  | "value"
  | "typing"
  | "audio"
  | "display"
  | "dev-setup"
  | "career";

export interface StudentScore {
  overall: number; // 0–100
  performance: number;
  battery: number;
  value: number;
  portability: number;
  display?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  priceINR: number; // typical street / guide price
  mrpINR?: number; // manufacturer's M.R.P. — shown struck-through when higher than priceINR
  // Display
  displayInches?: number;
  displayType?: string; // AMOLED, IPS, etc.
  displayRefreshRate?: number; // Hz
  displayResolution?: string;
  // Processor
  processor: string;
  processorCores?: number;
  // Memory & Storage
  ram: number; // GB
  storage: number; // GB
  storageType?: string; // SSD, eMMC, NVMe
  expandableStorage?: boolean;
  // Battery
  batteryCapacity?: number; // mAh or Wh
  chargingWatts?: number;
  // Physical
  weightKg?: number;
  buildMaterial?: string;
  // Connectivity
  ports?: string[];
  // OS & Software
  os?: string;
  // Release
  releaseYear: number;
  // Scoring
  studentScore: StudentScore;
  bestForTags: BestForTag[];
  // Review content
  pros: string[];
  cons: string[];
  verdict?: string; // short verdict
  // Affiliate
  asin: string;
  amazonUrl: string; // constructed by lib/data.ts
  imageUrl: string; // /images/products/[slug].jpg or CDN placeholder
  // Meta
  lastUpdated: string; // ISO date string
  featured?: boolean;
}

export interface ComparisonMatchup {
  slug: string; // e.g. "samsung-galaxy-m14-vs-poco-x6"
  products: [string, string]; // two product slugs
  category: Category;
  verdict?: string;
}

export interface BestListSlug {
  slug: string;
  title: string;
  description: string;
  tag: BestForTag;
  category: Category;
  maxPriceINR?: number;
}
