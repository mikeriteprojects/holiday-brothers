"use client";

import { motion, type MotionValue } from "framer-motion";

interface Cloud {
  top: string;
  left: string;
  width: number;
  duration: number;
  delay: number;
  opacity: number;
}

const CLOUDS: Cloud[] = [
  { top: "6%", left: "-10%", width: 220, duration: 38, delay: 0, opacity: 0.35 },
  { top: "12%", left: "30%", width: 160, duration: 30, delay: 3, opacity: 0.25 },
  { top: "4%", left: "55%", width: 260, duration: 44, delay: 6, opacity: 0.3 },
  { top: "16%", left: "75%", width: 140, duration: 26, delay: 1, opacity: 0.2 },
];

/** Slow-drifting blurred cloud shapes over the hero sky, purely decorative. */
export default function CloudsLayer({ opacity }: { opacity: MotionValue<number> }) {
  return (
    <motion.div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      {CLOUDS.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: c.top,
            left: c.left,
            width: c.width,
            height: c.width * 0.4,
            background: "rgba(245, 234, 217, 0.9)",
            filter: "blur(18px)",
            opacity: c.opacity,
          }}
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
