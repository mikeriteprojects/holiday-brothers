"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { assetPath } from "@/lib/basePath";
import CloudsLayer from "./CloudsLayer";
import ScrambleText from "./ScrambleText";

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

// Approximate bounding box of the sukkah within sukkah-night.jpg, as
// percentages of the image frame — used to place the clickable outline and
// as the zoom target. Eyeballed against the source photo, not pixel-exact.
const SUKKAH_BOX = { top: "34%", left: "17%", width: "62%", height: "42%" };

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1, 2.3]);
  const imageY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-10%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.45, 0.88]);
  const cloudsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const hotspotOpacity = useTransform(scrollYProgress, [0.42, 0.6], [0, 1]);
  // Deriving these straight from scrollYProgress (rather than mirroring it
  // into React state via useMotionValueEvent) avoids a full component
  // re-render on every scroll tick — which was also observed to desync the
  // other useTransform-derived values below it in the same render.
  const hotspotPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.5 ? "auto" : "none"));
  const hotspotCursor = useTransform(scrollYProgress, (v) => (v > 0.5 ? "pointer" : "default"));

  function handleHotspotClick() {
    if (scrollYProgress.get() > 0.5) setRevealed(true);
  }

  // Scrolling back out of the zoomed-in state hides the revealed content
  // again. Only fires setRevealed when the value actually flips (React
  // bails out on a same-value primitive set), so this doesn't re-render on
  // every scroll tick the way the earlier nearEnd state did.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.4) setRevealed(false);
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: "230vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale, y: imageY }}>
          <Image
            src={assetPath("/sukkah-night.jpg")}
            alt="A Holiday Brothers sukkah, fully built and lit up at night"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        <CloudsLayer opacity={cloudsOpacity} />

        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(36,22,16,0.3) 0%, rgba(36,22,16,0.7) 60%, rgba(36,22,16,0.95) 100%)",
            opacity: overlayOpacity,
          }}
        />

        <motion.div
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="eyebrow">Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "var(--amber-bright)", fontSize: 22, lineHeight: 1 }}
          >
            ↓
          </motion.span>
        </motion.div>

        {!revealed && (
          <motion.button
            type="button"
            aria-label="Reveal Holiday Brothers"
            onClick={handleHotspotClick}
            className="absolute rounded-lg"
            style={{
              top: SUKKAH_BOX.top,
              left: SUKKAH_BOX.left,
              width: SUKKAH_BOX.width,
              height: SUKKAH_BOX.height,
              opacity: hotspotOpacity,
              border: "2px solid var(--amber-bright)",
              boxShadow: "0 0 24px rgba(242,168,78,0.5)",
              pointerEvents: hotspotPointerEvents,
              cursor: hotspotCursor,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="eyebrow absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              Tap to enter
            </motion.span>
          </motion.button>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.3, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
              >
                <Link href="/" className="inline-flex flex-col items-center gap-4">
                  <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={88} height={88} />
                  <span className="eyebrow">Holiday Brothers</span>
                </Link>
              </motion.div>

              <motion.h1
                className="mt-8 max-w-2xl text-balance"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <ScrambleText text="Sukkahs built right, by people who know your neighborhood." play={revealed} />
              </motion.h1>

              <motion.p
                className="mt-4 max-w-xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                Serving Rockland County with sukkah building and Jewish holiday services — from delivery
                to teardown, handled by a crew you can trust.
              </motion.p>

              <div className="mt-12 grid w-full max-w-3xl gap-4 sm:grid-cols-3">
                {CTAS.map((cta, i) => (
                  <motion.div
                    key={cta.href}
                    initial={{ opacity: 0, scale: 0.5, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.85 + i * 0.12 }}
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
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                Rockland County · Est. by the Kurkus family
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
