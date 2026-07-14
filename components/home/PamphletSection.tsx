"use client";

import { motion } from "framer-motion";

const PAMPHLETS = [
  {
    label: "Vision",
    rotate: -3,
    text: "A Rockland County where every family can bring their sukkah to life — however much time, space, or help they've got.",
  },
  {
    label: "Mission",
    rotate: 2,
    text: "We handle it end-to-end: sourcing, delivery, building, and teardown — so the only thing you have to do is enjoy the holiday.",
  },
  {
    label: "Story",
    rotate: -1,
    text: "Started by the Kurkus family with a simple idea — your neighbors should be the ones building your sukkah. What began as a handful of local jobs has grown into a crew families across the county actually trust.",
  },
];

/**
 * Placeholder "table" background — a warm wood-tone gradient standing in
 * for a real photo. Swap by adding an image (e.g. public/table-bg.jpg) and
 * replacing this gradient with `url(${assetPath('/table-bg.jpg')})` as an
 * additional background-image layer underneath.
 */
const TABLE_BG =
  "repeating-linear-gradient(90deg, #8a6a45 0px, #8a6a45 3px, #7c5d3b 3px, #7c5d3b 6px), linear-gradient(180deg, #6b4f30, #4a3620)";

export default function PamphletSection() {
  return (
    <section className="relative py-24" style={{ background: "#F5EAD9" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.p
          className="mb-12 text-center font-mono text-[11px] uppercase"
          style={{ color: "#7c5d3b", letterSpacing: "0.14em" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Vision · Mission · Story
        </motion.p>

        <div
          className="relative grid gap-8 rounded-lg p-8 sm:grid-cols-3 sm:p-14"
          style={{ background: TABLE_BG, boxShadow: "inset 0 0 60px rgba(0,0,0,0.35)" }}
        >
          {PAMPHLETS.map((p, i) => (
            <motion.div
              key={p.label}
              className="rounded-sm p-6"
              style={{
                background: "#F0E3C8",
                color: "#3a2a18",
                rotate: p.rotate,
                boxShadow: "0 12px 24px -8px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.2)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <p className="font-mono text-[11px] uppercase" style={{ letterSpacing: "0.14em", color: "#8a6a2f" }}>
                {p.label}
              </p>
              <p className="mt-3 font-display text-[15px] leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
