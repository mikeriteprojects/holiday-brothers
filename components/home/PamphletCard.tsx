"use client";

import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Pamphlet } from "@/lib/home/pamphlets";

/**
 * Two nested motion elements on purpose: the outer handles the static
 * per-card rotation and the whileHover lift/scale/shadow (its own
 * transform channel); the inner handles the cursor-follow x/y offset via
 * spring-smoothed MotionValues (a different element's transform channel).
 * Putting both effects on one element would mean whileHover's y and the
 * cursor-follow y fight over the same underlying motion value.
 */
export default function PamphletCard({ pamphlet, index }: { pamphlet: Pamphlet; index: number }) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="cursor-pointer self-start"
      style={{ rotate: pamphlet.rotate }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ scale: 1.08, y: -14, boxShadow: "0 28px 44px -10px rgba(0,0,0,0.55)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.12 }}
      onClick={() => router.push(`/about/${pamphlet.slug}`)}
    >
      <motion.div
        className="rounded-sm p-6"
        style={{ x: springX, y: springY, background: "#F0E3C8", color: "#3a2a18" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <p className="font-mono text-[11px] uppercase" style={{ letterSpacing: "0.14em", color: "#8a6a2f" }}>
          {pamphlet.label}
        </p>
        <p className="mt-3 font-display text-[15px] leading-relaxed">{pamphlet.short}</p>
        <p className="mt-4 font-mono text-[11px] uppercase" style={{ letterSpacing: "0.1em", color: "#8a6a2f" }}>
          Read more →
        </p>
      </motion.div>
    </motion.div>
  );
}
