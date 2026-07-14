"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface CloudDef {
  top: string;
  left: string;
  size: string;
  startAt: number;
}

// Several clouds converging from different positions/timings reads as an
// actual whiteout sweeping in, rather than one translucent circle sitting
// on the dark hero background — which just blended into a muddy brown mass
// instead of looking like cloud.
const CLOUDS: CloudDef[] = [
  { top: "10%", left: "10%", size: "55vmax", startAt: 0 },
  { top: "5%", left: "60%", size: "50vmax", startAt: 0.06 },
  { top: "45%", left: "-10%", size: "50vmax", startAt: 0.1 },
  { top: "50%", left: "55%", size: "55vmax", startAt: 0.04 },
  { top: "25%", left: "30%", size: "45vmax", startAt: 0.14 },
];

export default function CloudTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.28, 0.55], [0, 1, 0]);

  return (
    <div ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 flex h-screen items-start justify-center overflow-hidden pt-[18vh]">
        {CLOUDS.map((c, i) => (
          <Cloud key={i} cloud={c} scrollYProgress={scrollYProgress} />
        ))}
        <motion.p
          className="relative z-10 font-mono text-[11px] uppercase"
          style={{ opacity: labelOpacity, color: "var(--amber-bright)", letterSpacing: "0.14em" }}
        >
          Our story
        </motion.p>
      </div>
    </div>
  );
}

function Cloud({
  cloud,
  scrollYProgress,
}: {
  cloud: CloudDef;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const scale = useTransform(scrollYProgress, [cloud.startAt, cloud.startAt + 0.55], [0.15, 1.6]);
  const opacity = useTransform(scrollYProgress, [cloud.startAt, cloud.startAt + 0.25], [0, 0.98]);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top: cloud.top,
        left: cloud.left,
        width: cloud.size,
        height: cloud.size,
        scale,
        opacity,
        background: "radial-gradient(circle, #F5EAD9 0%, #F5EAD9 60%, rgba(245,234,217,0) 78%)",
        filter: "blur(4px)",
      }}
    />
  );
}
