"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-driven whiteout: a soft cloud mass grows to cover the screen,
 * wiping from the dark hero into the light parchment tone the pamphlet
 * section below uses (#F5EAD9) so the handoff is seamless once this
 * section's sticky viewport releases.
 */
export default function CloudTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const cloudScale = useTransform(scrollYProgress, [0, 0.75], [0.4, 3.4]);
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const wipeOpacity = useTransform(scrollYProgress, [0.35, 0.9], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.5, 0.75, 0.95], [0, 1, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: "140vh" }}>
      <div
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
        style={{ background: "var(--bg-deep)" }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: "60vmax",
            height: "60vmax",
            scale: cloudScale,
            opacity: cloudOpacity,
            background:
              "radial-gradient(circle, rgba(245,234,217,0.95) 0%, rgba(245,234,217,0.45) 55%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />
        <motion.div className="absolute inset-0" style={{ opacity: wipeOpacity, background: "#F5EAD9" }} />
        <motion.p
          className="absolute font-mono text-[11px] uppercase"
          style={{ opacity: labelOpacity, color: "var(--bg-deep-2)", letterSpacing: "0.14em" }}
        >
          Our story
        </motion.p>
      </div>
    </div>
  );
}
