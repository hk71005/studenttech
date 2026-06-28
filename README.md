# StudentTech India

> Honest tech reviews and comparisons for Indian engineering & college students.
> Built with Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui.

**87 pages pre-rendered at build time. Zero runtime DB. Deploys free to Vercel.**

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev                   # → http://localhost:3000
```

---

## Project structure

```
config/
  site.ts          ← Brand name, tagline, nav, accent color — edit here first
  affiliate.ts     ← Amazon Associates tag + URL helpers
  gumroad.ts       ← Gumroad digital products + relevance logic
  analytics.ts     ← GA4 / Plausible IDs (read from env)

data/
  products.ts      ← All 26 seed products (phones, laptops, accessories)
  best-lists.ts    ← Best-of list definitions
  generated/
    products.json  ← Written intros & verdicts (editable by hand)
    best-lists.json← List intros & FAQs
  prompts/         ← Created by `npm run generate` in manual mode

lib/
  data.ts          ← ALL data queries (swap to DB without touching pages)

types/
  product.ts       ← Product type + all sub-types

app/
  page.tsx                    ← Home
  [category]/page.tsx         ← /phones /laptops /accessories (SSG)
  product/[slug]/page.tsx     ← Review pages (SSG, 20 pages)
  compare/[matchup]/page.tsx  ← Auto-generated comparisons (SSG, 42 pages)
  best/[slug]/page.tsx        ← Best-of listicles (SSG, 8 pages)
  career/page.tsx             ← Career & Dev hub
  go/[id]/route.ts            ← Affiliate redirect → amazon.in
  sitemap.ts / robots.ts      ← SEO

components/
  layout/   ← Navbar, Footer, ThemeToggle, CommandPalette, CompareTray
  products/ ← ProductCard, ScoreRing, AffiliateButton, GumroadCTA, EmailCapture
  ui/       ← shadcn/ui primitives

hooks/
  useCompare.ts    ← Zustand store for the compare tray

scripts/
  generate-content.ts ← Pluggable content generator (manual | gemini | claude)
```

---

## How to add a product

1. Open [`data/products.ts`](data/products.ts) and add a new entry following the `Product` type
2. Fill every required field: `slug`, `asin`, `studentScore`, `pros[]`, `cons[]`
3. Run `npm run generate` — writes a prompt to `data/prompts/product-[slug].txt`
4. Paste the prompt into any chat → copy JSON response into `data/generated/products.json`
5. `npm run build` to verify → deploy

**Student Score formula:**
```
Overall = (performance × 0.30) + (battery × 0.25) + (value × 0.25) + (portability × 0.20)
```
Full rubric at `/methodology`.

---

## Comparisons are auto-generated

Every product pair in the same category within 2.5× price gets a `/compare/[a]-vs-[b]` page.
Adding one product creates all its comparisons automatically — no extra work.

---

## Content generation

```bash
# Default — no API, writes prompts to /data/prompts/*.txt
npm run generate

# Google Gemini (free tier — key at aistudio.google.com)
PROVIDER=gemini GEMINI_API_KEY=your-key npm run generate

# Anthropic Claude
PROVIDER=claude ANTHROPIC_API_KEY=your-key npm run generate

# Force-regenerate (skip cache)
npm run generate:force

# Single product only
npx tsx scripts/generate-content.ts --slug=keychron-k2-v2
```

The site builds **fully with zero generated content** — pages fall back to spec-only display.

---

## Monetization setup

### Amazon Associates
```ts
// config/affiliate.ts
amazonTag: "YOURTAG-21",  // ← your tag here
```
All `/go/[asin]` links auto-append the tag. Route is disallowed in robots.txt.

### Gumroad
```ts
// config/gumroad.ts  — add your products
url: "https://yourgumroadhandle.gumroad.com/l/your-product",
relevantCategories: ["laptops"],  // only shows on relevant pages
```

### Email newsletter
```env
# .env.local
NEXT_PUBLIC_EMAIL_ENDPOINT=https://api.convertkit.com/v3/forms/FORM_ID/subscribe?api_key=KEY
```

### Display ads
Set `NEXT_PUBLIC_ADS_ENABLED=true` + add markup to `components/products/AdSlot.tsx`.

---

## SEO

| Feature | Coverage |
|---|---|
| Title + description + canonical | Every page |
| Open Graph + Twitter Card | Every page |
| JSON-LD Product + Review | `/product/[slug]` |
| JSON-LD ItemList | `/[category]`, `/best/[slug]` |
| JSON-LD FAQPage | `/best/[slug]` |
| JSON-LD BreadcrumbList | All inner pages |
| Dynamic sitemap.xml | All 87+ routes |
| robots.txt | Blocks `/go/`, `/api/` |
| next/image + next/font | Zero CLS |

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Add env vars in Vercel dashboard → Settings → Environment Variables.

---

## Pre-launch checklist

- [ ] Amazon tag → `config/affiliate.ts`
- [ ] Domain → `siteConfig.url` in `config/site.ts`
- [ ] Author name/bio/social → `siteConfig.author`
- [ ] Product images → `public/images/products/[slug].jpg`
- [ ] OG image → `public/og-image.png` (1200×630)
- [ ] Author photo → `public/images/author.jpg`
- [ ] Gumroad links → `config/gumroad.ts`
- [ ] Email endpoint → `NEXT_PUBLIC_EMAIL_ENDPOINT`
- [ ] Analytics → `NEXT_PUBLIC_GA4_ID` or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Contact email → `app/contact/page.tsx` and `app/privacy-policy/page.tsx`
- [ ] Submit sitemap at `yourdomain.com/sitemap.xml` to Google Search Console
- [ ] Run Lighthouse on deployed URL → target 95+ Performance & SEO

---

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server at localhost:3000 |
| `npm run build` | Production build (SSG) |
| `npm run start` | Serve production build |
| `npm run generate` | Generate content prompts (no API) |
| `npm run generate:force` | Regenerate all content |

## Site keyboard shortcuts

| Key | Action |
|---|---|
| `Cmd/Ctrl+K` | Command palette — search all products |
| `Esc` | Close palette |
