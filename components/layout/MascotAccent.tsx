"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MascotAccentProps {
  /** filename under public/images/, e.g. "mascot-compare.webp" */
  src: string;
  /** which corner to anchor to */
  position?: "bottom-right" | "bottom-left";
  className?: string;
}

/**
 * Hero-mode-only decorative corner accent. Smaller, subtler sibling of
 * HeroMascot — no scroll-panning, just a gentle float + glow pulse.
 * Renders nothing outside Hero mode or on small screens.
 */
export function MascotAccent({
  src,
  position = "bottom-right",
  className,
}: MascotAccentProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || theme !== "hero") return null;

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed z-0 hidden md:block",
        position === "bottom-right" ? "right-2 lg:right-6" : "left-2 lg:left-6",
        "bottom-0",
        className
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 0.4, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.img
          src={`/images/${src}`}
          alt=""
          draggable={false}
          className="h-[38vh] max-h-[420px] w-auto select-none object-contain"
          style={{
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 55%, black 55%, transparent 85%)",
            maskImage:
              "radial-gradient(ellipse at 50% 55%, black 55%, transparent 85%)",
          }}
          animate={
            reduce
              ? undefined
              : {
                  filter: [
                    "drop-shadow(0 0 16px rgba(124,58,237,0.4))",
                    "drop-shadow(0 0 30px rgba(226,54,54,0.5))",
                    "drop-shadow(0 0 16px rgba(124,58,237,0.4))",
                  ],
                }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
