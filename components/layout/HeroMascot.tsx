"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Hero-mode-only decorative mascot.
 * - Scroll reveal: pans up (head first, body on scroll) and fades past the hero.
 * - Idle float: gentle breathing bob.
 * - Glow pulse: neon rim light throbs purple <-> red.
 * Original character art only. Renders nothing outside Hero mode.
 * Requires: public/images/hero-mascot.png
 */
export function HeroMascot() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const yRaw = useTransform(scrollYProgress, [0, 0.4], [0, -170]);
  const yScroll = useSpring(yRaw, { stiffness: 50, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [0.5, 0.4, 0]);

  useEffect(() => setMounted(true), []);
  if (!mounted || theme !== "hero") return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-1/2 top-0 z-0 hidden h-screen -translate-x-1/2 items-start justify-center overflow-visible md:flex"
      style={{ y: reduce ? 0 : yScroll, opacity }}
    >
      {/* idle float */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* glow pulse (drop-shadow) + black-bg removal via screen blend */}
        <motion.img
          src="/images/hero-mascot.webp"
          alt=""
          draggable={false}
          className="h-[128vh] w-auto max-w-none select-none object-contain"
          style={{
            mixBlendMode: "screen",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 42%, black 48%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse at 50% 42%, black 48%, transparent 80%)",
          }}
          animate={
            reduce
              ? undefined
              : {
                  filter: [
                    "drop-shadow(0 0 22px rgba(124,58,237,0.45))",
                    "drop-shadow(0 0 42px rgba(226,54,54,0.55))",
                    "drop-shadow(0 0 22px rgba(124,58,237,0.45))",
                  ],
                }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
