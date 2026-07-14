"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const CTAS = [
  {
    href: "/booking",
    label: "Sukkah Booking",
    description: "Answer a few questions, get a price, lock in your build.",
    primary: true,
  },
  {
    href: "/join-crew",
    label: "Sign Up to Build",
    description: "Join the crew — builders and drivers, any age 16+.",
  },
  {
    href: "/admin",
    label: "Admin View",
    description: "Staff and owner access.",
  },
];

export default function HomeHero() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="inline-flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Holiday Brothers" width={88} height={88} priority />
          <span className="eyebrow">Holiday Brothers</span>
        </Link>
      </motion.div>

      <motion.h1
        className="mt-8 max-w-2xl text-balance"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Sukkahs built right, by people who know your neighborhood.
      </motion.h1>

      <motion.p
        className="mt-4 max-w-xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Serving Rockland County with sukkah building and Jewish holiday services — from delivery to
        teardown, handled by a crew you can trust.
      </motion.p>

      <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
        {CTAS.map((cta, i) => (
          <motion.div
            key={cta.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          >
            <Link href={cta.href} className={`glass-btn block h-full ${cta.primary ? "primary" : ""}`}>
              <span>{cta.label}</span>
              <span className="text-[13px] font-body font-normal" style={{ color: "var(--text-faint)" }}>
                {cta.description}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-20 grid w-full gap-4 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="glass overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src="/sukkah-day.jpg"
              alt="A Holiday Brothers sukkah, fully built in daylight"
              fill
              className="object-cover"
              sizes="(min-width: 640px) 460px, 100vw"
            />
          </div>
        </div>
        <div className="glass overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src="/sukkah-night.jpg"
              alt="A Holiday Brothers sukkah, lit up at night"
              fill
              className="object-cover"
              sizes="(min-width: 640px) 460px, 100vw"
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="eyebrow mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Rockland County · Est. by the Kurkus family
      </motion.p>
    </main>
  );
}
