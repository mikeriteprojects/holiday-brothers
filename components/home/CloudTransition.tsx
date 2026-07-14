"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-driven whiteout: a soft cloud mass grows to cover the screen,
 * wiping from the dark hero into the light parchment tone the pamphlet
 * section below uses (#F5EAD9) so the handoff is seamless once this
 * section's sticky viewport releases. No flat background color of its own —
 * it sits over the page's own dark gradient (body background) so there's
 * no hard-edged box before the cloud fills in.
 */
export default function CloudTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const cloudScale = useTransform(scrollYProgress, [0, 0.7], [0.4, 3.4]);
  const cloudOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const wipeOpacity = useTransform(scrollYProgress, [0.3, 0.85], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.9], [0, 1, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden pt-[18vh]">
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "20%",
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
          className="relative font-mono text-[11px] uppercase"
          style={{ opacity: labelOpacity, color: "var(--amber-bright)", letterSpacing: "0.14em" }}
        >
          Our story
        </motion.p>
      </div>
    </div>
  );
}
