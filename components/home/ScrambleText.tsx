"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*אבגדהוזחטיכלמנסעפצקרשת0123456789";
const FONT_POOL = ["var(--font-ibm-plex-mono)", "var(--font-manrope)", "serif", "monospace"];

interface Props {
  text: string;
  play: boolean;
  className?: string;
  /** ms between each character starting its scramble */
  charDelayMs?: number;
  /** how long a character scrambles before locking to the real glyph */
  scrambleMs?: number;
}

/**
 * Cycles each character through random glyphs (including Hebrew, on brand)
 * in rotating fonts before resolving to the real character in the page's
 * normal font — a "typing in, changing fonts until English" reveal.
 *
 * Timed off elapsed ms (via rAF) rather than a fixed frame/tick count, so
 * charDelayMs can be tuned finer than the paint interval — a whole-tick
 * minimum stagger made the original version read as sluggish on a long
 * headline.
 */
export default function ScrambleText({
  text,
  play,
  className,
  charDelayMs = 9,
  scrambleMs = 70,
}: Props) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!play) {
      setElapsed(0);
      startRef.current = null;
      return;
    }
    function loop(t: number) {
      if (startRef.current === null) startRef.current = t;
      setElapsed(t - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i}>&nbsp;</span>;

        const startAt = i * charDelayMs;
        const local = elapsed - startAt;

        if (!play || local < 0) {
          const seed = (i * 7 + 3) % GLYPHS.length;
          return (
            <span key={i} aria-hidden style={{ fontFamily: FONT_POOL[i % FONT_POOL.length], opacity: 0.45 }}>
              {GLYPHS[seed]}
            </span>
          );
        }

        if (local < scrambleMs) {
          const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          const font = FONT_POOL[Math.floor(local / 20 + i) % FONT_POOL.length];
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
