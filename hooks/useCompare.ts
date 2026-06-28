"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareItem {
  slug: string;
  name: string;
  category: string;
}

interface CompareStore {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const { items } = get();
        if (items.length >= 2 || items.some((i) => i.slug === item.slug)) return;
        // Only same category
        if (items.length > 0 && items[0].category !== item.category) {
          set({ items: [item] });
          return;
        }
        set({ items: [...items, item] });
      },
      remove: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] }),
      has: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "compare-tray" }
  )
);
