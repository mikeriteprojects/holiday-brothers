"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { assetPath } from "@/lib/basePath";

const CTAS = [
  {
    href: "/booking",
    label: "Make a Booking",
    description: "Answer a few questions, get a price, lock in your build.",
    primary: true,
  },
  {
    href: "/join-crew",
    label: "Sign Up to Work",
    description: "Join the crew — builders and drivers, any age 16+.",
  },
  {
    href: "/worker-login",
    label: "Login",
    description: "Sign in to any account — client, crew, vendor, or staff.",
  },
];

export default function HomeHero() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 text-center sm:px-6">
      <Image
        src={assetPath("/sukkah-night.jpg")}
        alt="A Holiday Brothers sukkah, fully built and lit up at night"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(36,22,16,0.45) 0%, rgba(36,22,16,0.78) 55%, rgba(36,22,16,0.95) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="inline-flex flex-col items-center gap-4">
            <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={88} height={88} priority />
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
              <Link href={cta.href} className={`glass-btn h-full ${cta.primary ? "primary" : ""}`}>
                <span>{cta.label}</span>
                <span className="text-[13px] font-body font-normal" style={{ color: "var(--text-faint)" }}>
                  {cta.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="eyebrow mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Rockland County · Est. by the Kurkus family
        </motion.p>
      </div>
    </main>
  );
}
