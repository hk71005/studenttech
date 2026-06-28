#!/usr/bin/env tsx
/**
 * scripts/generate-content.ts
 *
 * Pluggable content generator for product intros, verdicts, and best-list copy.
 * Controlled by the PROVIDER env var:
 *
 *   PROVIDER=manual   (default) — no API. Writes prompts to /data/prompts/*.txt
 *                                  so you can paste them into a chat and drop the
 *                                  JSON responses back into /data/generated/
 *   PROVIDER=gemini   — calls Google Gemini Flash (free tier via AI Studio)
 *   PROVIDER=claude   — calls Anthropic Claude
 *
 * Usage:
 *   npx tsx scripts/generate-content.ts             # all products
 *   npx tsx scripts/generate-content.ts --force     # regenerate even if cached
 *   npx tsx scripts/generate-content.ts --slug=keychron-k2-v2  # single product
 *
 * The script is idempotent — skips slugs that already have content unless --force.
 * Site builds fine with zero generated content (falls back to spec-only display).
 */

import * as fs from "fs";
import * as path from "path";
import { products } from "../data/products";
import { bestLists } from "../data/best-lists";

// ─── Config ──────────────────────────────────────────────────────────────────

const PROVIDER = (process.env.PROVIDER ?? "manual") as "manual" | "gemini" | "claude";
const FORCE = process.argv.includes("--force");
const SINGLE = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

const GENERATED_DIR = path.join(process.cwd(), "data/generated");
const PROMPTS_DIR = path.join(process.cwd(), "data/prompts");
const PRODUCTS_FILE = path.join(GENERATED_DIR, "products.json");
const BEST_LISTS_FILE = path.join(GENERATED_DIR, "best-lists.json");

fs.mkdirSync(GENERATED_DIR, { recursive: true });
fs.mkdirSync(PROMPTS_DIR, { recursive: true });

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildProductPrompt(product: (typeof products)[0]): string {
  return `You are a CS engineering student in India writing an honest product review for a tech blog targeting college students.

Product: ${product.name} (${product.brand})
Category: ${product.category}
Price: ₹${product.priceINR.toLocaleString("en-IN")}
Processor: ${product.processor}
RAM: ${product.ram}GB | Storage: ${product.storage}GB
${product.displayInches ? `Display: ${product.displayInches}" ${product.displayType ?? ""} ${product.displayRefreshRate ? product.displayRefreshRate + "Hz" : ""}` : ""}
${product.batteryCapacity ? `Battery: ${product.batteryCapacity}${product.category === "laptops" ? "Wh" : "mAh"}${product.chargingWatts ? ` / ${product.chargingWatts}W charging` : ""}` : ""}
${product.weightKg ? `Weight: ${product.weightKg}kg` : ""}
Student Score: ${product.studentScore.overall}/100 (perf:${product.studentScore.performance} batt:${product.studentScore.battery} value:${product.studentScore.value} portability:${product.studentScore.portability})
Best for: ${product.bestForTags.join(", ")}
Pros: ${product.pros.join(" | ")}
Cons: ${product.cons.join(" | ")}

Write the following in first-person, honest CS-student voice. No marketing language. Mention at least one specific real-world student scenario (coding, exams, hostel, college commute, etc.).

Return ONLY a JSON object with these two keys:
{
  "intro": "3-4 sentence paragraph introducing the product from a CS student perspective. Must be specific to this product — no generic opener.",
  "verdict": "2-3 sentence verdict. Who should buy it, who shouldn't. Mention the price context."
}`;
}

function buildBestListPrompt(list: (typeof bestLists)[0]): string {
  return `You are a CS engineering student in India writing a buying guide for a tech blog.

List: ${list.title}
Description: ${list.description}
Category: ${list.category}
${list.maxPriceINR ? `Budget: Under ₹${list.maxPriceINR.toLocaleString("en-IN")}` : ""}
Focus tag: ${list.tag}

Write in honest first-person CS-student voice. Be specific about student life in India (hostel, labs, lectures, placements).

Return ONLY a JSON object:
{
  "intro": "2-3 sentence intro paragraph. Why this buying decision matters for engineering students specifically.",
  "methodology": "1-2 sentences on how you evaluated/tested products in this category.",
  "faqItems": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}
Include 2-3 FAQ items that real students actually ask when buying in this category.`;
}

// ─── API callers ──────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  // Using Google Gen AI SDK (Gemini Flash — free tier)
  // Install: npm install @google/generative-ai
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai" as any);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e: any) {
    if (e.code === "MODULE_NOT_FOUND") {
      throw new Error("Install the Gemini SDK: npm install @google/generative-ai");
    }
    throw e;
  }
}

async function callClaude(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  try {
    const Anthropic = (await import("@anthropic-ai/sdk" as any)).default;
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });
    return (msg.content[0] as any).text;
  } catch (e: any) {
    if (e.code === "MODULE_NOT_FOUND") {
      throw new Error("Install the Anthropic SDK: npm install @anthropic-ai/sdk");
    }
    throw e;
  }
}

function extractJson(text: string): any {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  return JSON.parse(match[0]);
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀 Content generator — provider: ${PROVIDER}\n`);

  // Load existing content
  const existingProducts: Record<string, any> = fs.existsSync(PRODUCTS_FILE)
    ? JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"))
    : {};

  const existingLists: Record<string, any> = fs.existsSync(BEST_LISTS_FILE)
    ? JSON.parse(fs.readFileSync(BEST_LISTS_FILE, "utf-8"))
    : {};

  const toProcess = SINGLE
    ? products.filter((p) => p.slug === SINGLE)
    : products;

  // ── Products ─────────────────────────────────────────────────────────────────
  for (const product of toProcess) {
    if (!FORCE && existingProducts[product.slug]) {
      console.log(`  ✓ ${product.slug} (cached)`);
      continue;
    }

    const prompt = buildProductPrompt(product);

    if (PROVIDER === "manual") {
      const promptFile = path.join(PROMPTS_DIR, `product-${product.slug}.txt`);
      fs.writeFileSync(promptFile, prompt, "utf-8");
      console.log(`  📝 ${product.slug} → prompt written to data/prompts/product-${product.slug}.txt`);
      continue;
    }

    try {
      console.log(`  ⏳ ${product.slug}...`);
      const raw = PROVIDER === "gemini" ? await callGemini(prompt) : await callClaude(prompt);
      const parsed = extractJson(raw);
      existingProducts[product.slug] = parsed;
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(existingProducts, null, 2), "utf-8");
      console.log(`  ✅ ${product.slug}`);
      // Polite rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (e: any) {
      console.error(`  ❌ ${product.slug}: ${e.message}`);
    }
  }

  // ── Best lists ────────────────────────────────────────────────────────────────
  if (!SINGLE) {
    for (const list of bestLists) {
      if (!FORCE && existingLists[list.slug]) {
        console.log(`  ✓ ${list.slug} (cached)`);
        continue;
      }

      const prompt = buildBestListPrompt(list);

      if (PROVIDER === "manual") {
        const promptFile = path.join(PROMPTS_DIR, `list-${list.slug}.txt`);
        fs.writeFileSync(promptFile, prompt, "utf-8");
        console.log(`  📝 ${list.slug} → data/prompts/list-${list.slug}.txt`);
        continue;
      }

      try {
        console.log(`  ⏳ ${list.slug}...`);
        const raw = PROVIDER === "gemini" ? await callGemini(prompt) : await callClaude(prompt);
        const parsed = extractJson(raw);
        existingLists[list.slug] = parsed;
        fs.writeFileSync(BEST_LISTS_FILE, JSON.stringify(existingLists, null, 2), "utf-8");
        console.log(`  ✅ ${list.slug}`);
        await new Promise((r) => setTimeout(r, 500));
      } catch (e: any) {
        console.error(`  ❌ ${list.slug}: ${e.message}`);
      }
    }
  }

  if (PROVIDER === "manual") {
    console.log(`
✅ Prompts written to /data/prompts/

To use them:
  1. Open each .txt file and paste it into a chat (Claude, Gemini, etc.)
  2. Copy the JSON response
  3. Merge into /data/generated/products.json or /data/generated/best-lists.json

Or switch providers:
  PROVIDER=gemini GEMINI_API_KEY=your-key npx tsx scripts/generate-content.ts
`);
  } else {
    console.log("\n✅ Content generation complete.\n");
  }
}

main().catch(console.error);
