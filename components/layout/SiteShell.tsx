"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { CompareTray } from "@/components/layout/CompareTray";
import type { Product } from "@/types/product";

interface SiteShellProps {
  children: React.ReactNode;
  products: Product[];
}

export function SiteShell({ children, products }: SiteShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openSearch = useCallback(() => setPaletteOpen(true), []);

  return (
    <>
      <Navbar onSearchOpen={openSearch} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        products={products}
      />
      <CompareTray />
    </>
  );
}
