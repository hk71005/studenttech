"use client";

import { useState, useCallback, useMemo } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { trackEvent, EVENTS } from "@/config/analytics";
import {
  BUDGET_RANGES,
  USE_OPTIONS,
  PRIORITY_OPTIONS,
  findMatches,
  type QuizAnswers,
} from "@/lib/finder";
import type { Product, Category } from "@/types/product";

/* ─── Category options ───────────────────────────────────────────────── */
const CATEGORY_OPTIONS: { label: string; emoji: string; value: Category }[] = [
  { label: "Laptop", emoji: "💻", value: "laptops" },
  { label: "Phone", emoji: "📱", value: "phones" },
  { label: "Accessory", emoji: "⌨️", value: "accessories" },
];

/* ─── Types ──────────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4 | "results";
const TOTAL_STEPS = 4;

interface TechFinderProps {
  products: Product[];
}

/* ─── Option Card ────────────────────────────────────────────────────── */
function OptionCard({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2.5 rounded-xl border p-5 sm:p-6 text-center transition-all duration-200 cursor-pointer active:scale-[0.97] ${
        selected
          ? "border-primary bg-primary/10 shadow-sm shadow-primary/10"
          : "border-border/50 bg-card hover:border-border hover:bg-muted/30"
      }`}
    >
      <span className="text-2xl sm:text-3xl" role="img" aria-hidden="true">
        {emoji}
      </span>
      <span
        className={`text-sm font-medium transition-colors ${
          selected ? "text-primary" : "text-foreground"
        }`}
      >
        {label}
      </span>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </button>
  );
}

/* ─── Progress Bar ───────────────────────────────────────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Step {step} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export function TechFinder({ products }: TechFinderProps) {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [budgetIdx, setBudgetIdx] = useState<number | null>(null);
  const [useTag, setUseTag] = useState<string | null>(null);
  const [priority, setPriority] = useState<QuizAnswers["priority"] | null>(null);
  const [hasFiredEvent, setHasFiredEvent] = useState(false);

  /* Navigation */
  const goNext = useCallback(() => {
    setStep((s) => {
      if (s === 1 && category) return 2;
      if (s === 2 && budgetIdx !== null) return 3;
      if (s === 3 && useTag) return 4;
      if (s === 4) return "results";
      return s;
    });
  }, [category, budgetIdx, useTag]);

  const goBack = useCallback(() => {
    setStep((s) => {
      if (s === "results") return 4;
      if (s === 4) return 3;
      if (s === 3) return 2;
      if (s === 2) return 1;
      return s;
    });
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setCategory(null);
    setBudgetIdx(null);
    setUseTag(null);
    setPriority(null);
    setHasFiredEvent(false);
  }, []);

  /* Auto-advance on option select */
  function selectCategory(val: Category) {
    setCategory(val);
    // Reset downstream when category changes
    setBudgetIdx(null);
    setUseTag(null);
    setPriority(null);
    setTimeout(() => setStep(2), 250);
  }

  function selectBudget(idx: number) {
    setBudgetIdx(idx);
    setTimeout(() => setStep(3), 250);
  }

  function selectUse(tag: string) {
    setUseTag(tag);
    setTimeout(() => setStep(4), 250);
  }

  function selectPriority(key: QuizAnswers["priority"]) {
    setPriority(key);
    setTimeout(() => setStep("results"), 250);
  }

  /* Matching */
  const budgetRanges = category ? BUDGET_RANGES[category] : [];
  const selectedBudget = budgetIdx !== null && category ? budgetRanges[budgetIdx] : null;

  const results = useMemo(() => {
    if (step !== "results" || !category || !selectedBudget || !useTag) return [];
    const answers: QuizAnswers = {
      category,
      budgetMin: selectedBudget.min,
      budgetMax: selectedBudget.max,
      useTag: useTag as QuizAnswers["useTag"],
      priority: priority ?? "value",
    };
    return findMatches(products, answers, 3);
  }, [step, category, selectedBudget, useTag, priority, products]);

  /* Fire analytics event on results */
  if (step === "results" && !hasFiredEvent && category && useTag && selectedBudget) {
    trackEvent(EVENTS.QUIZ_COMPLETE, {
      category,
      budget: selectedBudget.label,
      use: useTag,
    });
    setHasFiredEvent(true);
  }

  /* ─── Render ────────────────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4 text-xs px-3 py-1 gap-1.5">
          <Sparkles className="h-3 w-3" /> 30-second quiz
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight">
          Find your perfect student tech
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Answer a few quick questions and we&apos;ll match you with the best picks from our reviews.
        </p>
      </div>

      {/* Progress bar (hide on results) */}
      {step !== "results" && (
        <ProgressBar step={typeof step === "number" ? step : TOTAL_STEPS} total={TOTAL_STEPS} />
      )}

      {/* Step content */}
      <div
        className="transition-opacity duration-200"
        style={{ minHeight: 280 }}
      >
        {/* ── STEP 1: Category ─────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-5">
              What are you looking for?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={category === opt.value}
                  onClick={() => selectCategory(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Budget ───────────────────────────────────────── */}
        {step === 2 && category && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Your budget?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {budgetRanges.map((range, idx) => (
                <OptionCard
                  key={range.label}
                  emoji="💵"
                  label={range.label}
                  selected={budgetIdx === idx}
                  onClick={() => selectBudget(idx)}
                />
              ))}
            </div>
            <div className="mt-6">
              <Button variant="ghost" size="sm" onClick={goBack} className="gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Back
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Use-case ─────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-5">
              Primary use?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {USE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.tag}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={useTag === opt.tag}
                  onClick={() => selectUse(opt.tag)}
                />
              ))}
            </div>
            <div className="mt-6">
              <Button variant="ghost" size="sm" onClick={goBack} className="gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Back
              </Button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Priority ─────────────────────────────────────── */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-5">
              What matters most?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.key}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={priority === opt.key}
                  onClick={() => selectPriority(opt.key)}
                />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={goBack} className="gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" /> Back
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setPriority("value"); setStep("results"); }} className="gap-1.5 text-xs text-muted-foreground ml-auto">
                Skip <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────── */}
        {step === "results" && (
          <div>
            {results.length > 0 ? (
              <>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 text-center">
                  <p className="text-sm text-foreground font-medium">
                    Based on your answers, here are your top {results.length} picks 🎯
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category === "laptops" ? "Laptops" : category === "phones" ? "Phones" : "Accessories"}
                    {selectedBudget && ` · ${selectedBudget.label}`}
                    {useTag && ` · ${USE_OPTIONS.find((o) => o.tag === useTag)?.label ?? useTag}`}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {results.map((product, i) => (
                    <ProductCard key={product.id} product={product} rank={i + 1} showCompare={false} />
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-3xl mb-3">🤔</p>
                <p className="text-sm font-medium text-foreground mb-1">
                  No exact matches found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your budget or use-case to see more options.
                </p>
              </Card>
            )}

            <div className="mt-8 flex justify-center">
              <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Start over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
