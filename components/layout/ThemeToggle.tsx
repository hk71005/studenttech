"use client";

import { Moon, Sun, VenetianMask, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "dark", label: "Editorial", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "hero", label: "Hero 🕸️", icon: VenetianMask },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      setShowHint(!localStorage.getItem("themeHintSeen"));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function dismissHint() {
    setShowHint(false);
    try {
      localStorage.setItem("themeHintSeen", "1");
    } catch {
      /* ignore */
    }
  }

  function pick(value: string) {
    setTheme(value);
    setOpen(false);
    dismissHint();
  }

  if (!mounted) {
    return <div className="h-9 w-9 rounded-md border border-border/60 bg-transparent" />;
  }

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          setOpen((o) => !o);
          dismissHint();
        }}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="relative border-border/60"
      >
        <CurrentIcon className="h-4 w-4" />
        {showHint && (
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 ring-2 ring-background" />
        )}
      </Button>

      {/* One-time hint */}
      {showHint && !open && (
        <div className="absolute right-0 top-11 z-50 w-max rounded-md border border-border/60 bg-popover px-2.5 py-1.5 text-[11px] text-foreground shadow-md">
          New — try <span className="font-semibold text-primary">Hero mode</span> 🕸️
        </div>
      )}

      {/* Theme menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-50 w-40 rounded-md border border-border/60 bg-popover p-1 shadow-lg"
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              role="menuitemradio"
              aria-checked={theme === value}
              onClick={() => pick(value)}
              className={cn(
                "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent",
                theme === value && "text-primary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {theme === value && <Check className="h-3.5 w-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
