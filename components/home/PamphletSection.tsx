"use client";

import { motion } from "framer-motion";
import { PAMPHLETS } from "@/lib/home/pamphlets";
import PamphletCard from "./PamphletCard";

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
            <PamphletCard key={p.slug} pamphlet={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
