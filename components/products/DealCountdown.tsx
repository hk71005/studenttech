"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

/**
 * Countdown to the end of the local day, shown on the featured "Top Deal".
 * It's an honest daily reset (today's editor's pick), not a claim about
 * Amazon's own pricing or stock — the live price is always on Amazon.
 */
export function DealCountdown() {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(24, 0, 0, 0);
      const diff = endOfDay.getTime() - now.getTime();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing on the server / first paint to avoid hydration mismatch
  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
      <Clock className="h-3 w-3 shrink-0" />
      <span>Today&apos;s deal ends in</span>
      <span className="font-mono tabular-nums">{timeLeft}</span>
    </div>
  );
}
