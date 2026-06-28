"use client";

import { useRouter } from "next/navigation";
import { X, ArrowRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

export function CompareTray() {
  const router = useRouter();
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  function goCompare() {
    if (items.length === 2) {
      router.push(`/compare/${items[0].slug}-vs-${items[1].slug}`);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-md animate-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl p-3 flex items-center gap-3">
        <BarChart2 className="h-4 w-4 text-primary shrink-0" />

        <div className="flex-1 flex items-center gap-2 min-w-0">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground min-w-0"
            >
              <span className="truncate max-w-[100px]">{item.name}</span>
              <button
                onClick={() => remove(item.slug)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label={`Remove ${item.name} from compare`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {items.length < 2 && (
            <span className="text-xs text-muted-foreground">
              Add one more to compare
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {items.length === 2 && (
            <Button size="sm" onClick={goCompare} className="h-7 text-xs gap-1.5">
              Compare <ArrowRight className="h-3 w-3" />
            </Button>
          )}
          <button
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
