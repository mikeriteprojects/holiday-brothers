"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*אבגדהוזחטיכלמנסעפצקרשת0123456789";
const FONT_POOL = ["var(--font-ibm-plex-mono)", "var(--font-manrope)", "serif", "monospace"];
const TICK_MS = 22;

interface Props {
  text: string;
  play: boolean;
  className?: string;
  /** ms between each character starting its scramble */
  charDelayMs?: number;
  /** how many ticks a character scrambles before locking to the real glyph */
  scrambleTicks?: number;
}

/**
 * Cycles each character through random glyphs (including Hebrew, on brand)
 * in rotating fonts before resolving to the real character in the page's
 * normal font — a "typing in, changing fonts until English" reveal.
 */
export default function ScrambleText({
  text,
  play,
  className,
  charDelayMs = 14,
  scrambleTicks = 5,
}: Props) {
  const [frame, setFrame] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) {
      setFrame(0);
      return;
    }
    let lastTick = 0;
    function loop(t: number) {
      if (t - lastTick > TICK_MS) {
        lastTick = t;
        setFrame((f) => f + 1);
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play]);

  const staggerTicks = Math.max(1, Math.round(charDelayMs / TICK_MS));

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i}>&nbsp;</span>;

        const startTick = i * staggerTicks;
        const localTick = frame - startTick;

        if (!play || localTick < 0) {
          const seed = (i * 7 + 3) % GLYPHS.length;
          return (
            <span key={i} aria-hidden style={{ fontFamily: FONT_POOL[i % FONT_POOL.length], opacity: 0.45 }}>
              {GLYPHS[seed]}
            </span>
          );
        }

        if (localTick < scrambleTicks) {
          const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          const font = FONT_POOL[(frame + i) % FONT_POOL.length];
          return (
            <span key={i} aria-hidden style={{ fontFamily: font }}>
              {glyph}
            </span>
          );
        }

        return (
          <span key={i} aria-hidden>
            {ch}
          </span>
        );
      })}
    </span>
  );
}
