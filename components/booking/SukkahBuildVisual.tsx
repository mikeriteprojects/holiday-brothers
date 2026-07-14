"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Pseudo-3D sukkah assembling in layers, keyed to booking-stepper progress
 * (see lib/booking/steps.ts stageForStep) rather than scroll position.
 * Built from plain CSS 3D transforms (perspective + rotateX/Y + translateZ)
 * per layer — no WebGL/Three.js, no AI-generated intermediate photos.
 *
 * Every 3D-positioned piece is a plain <div> carrying a *static* transform;
 * the reveal animation (opacity/scale) lives on a nested <motion.div> with
 * no transform of its own. Framer Motion fully owns the `transform` CSS
 * property on any element it animates x/y/scale/rotate on, so mixing a
 * static 3D placement transform with motion's own transform management on
 * the *same* element is unreliable — splitting them into parent/child avoids
 * that entirely.
 *
 * Future upgrade path: if a true photoreal 3D model is ever wanted, this
 * would be replaced with a WebGL/Three.js scene using a commissioned 3D
 * asset — not attempted here per the project brief.
 */

const W = 168; // box width
const H = 132; // box height
const D = 150; // box depth
const POST = 5; // frame line thickness

interface Props {
  stage: 0 | 1 | 2 | 3 | 4;
  className?: string;
}

function planeStyle(opts: {
  axis: "rotateX" | "rotateY";
  deg: number;
  push: number;
  width: number;
  height: number;
  marginLeftOverride?: number;
}): CSSProperties {
  const { axis, deg, push, width, height, marginLeftOverride } = opts;
  return {
    position: "absolute",
    width,
    height,
    left: "50%",
    top: "50%",
    marginLeft: marginLeftOverride ?? -width / 2,
    marginTop: -height / 2,
    transform: `${axis}(${deg}deg) translateZ(${push}px)`,
  };
}

const ROOF_STRIP_COUNT = 5;

export default function SukkahBuildVisual({ stage, className }: Props) {
  const showWalls = stage >= 1;
  const showRoof = stage >= 2;
  const showInterior = stage >= 3;
  const lit = stage >= 4;

  return (
    <div
      className={`relative aspect-square w-full max-w-[320px] mx-auto ${className ?? ""}`}
      style={{ perspective: 1100 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute rounded-full"
          style={{
            width: W * 1.5,
            height: 36,
            bottom: "14%",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: W,
            height: H,
            transformStyle: "preserve-3d",
            transform: "rotateX(-18deg) rotateY(-32deg)",
          }}
        >
          {/* frame: 4 corner posts */}
          {[
            { x: 0, z: 0 },
            { x: W, z: 0 },
            { x: 0, z: -D },
            { x: W, z: -D },
          ].map((c, i) => (
            <div
              key={`post-${i}`}
              style={{
                position: "absolute",
                left: c.x - POST / 2,
                top: 0,
                width: POST,
                height: H,
                transform: `translateZ(${c.z}px)`,
              }}
            >
              <motion.div
                className="h-full w-full rounded-full"
                style={{
                  background: "linear-gradient(180deg, var(--gold-rim), var(--amber))",
                  boxShadow: "0 0 8px rgba(242,168,78,0.45)",
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              />
            </div>
          ))}

          {/* frame: top & bottom beams, front & back */}
          {[
            { y: 0, z: 0 },
            { y: H, z: 0 },
            { y: 0, z: -D },
            { y: H, z: -D },
          ].map((b, i) => (
            <div
              key={`beam-${i}`}
              style={{
                position: "absolute",
                left: -POST / 2,
                top: b.y - POST / 2,
                width: W + POST,
                height: POST,
                transform: `translateZ(${b.z}px)`,
              }}
            >
              <motion.div
                className="h-full w-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--amber), var(--gold-rim))",
                  transformOrigin: "left",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: "easeOut" }}
              />
            </div>
          ))}

          {/* walls: left, right, back */}
          <div style={planeStyle({ axis: "rotateY", deg: -90, push: W / 2, width: D, height: H })}>
            <motion.div
              className="h-full w-full rounded-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: showWalls ? 0.85 : 0,
                background: lit
                  ? "linear-gradient(160deg, rgba(242,168,78,0.4), rgba(217,138,61,0.18))"
                  : "linear-gradient(160deg, rgba(244,196,138,0.18), rgba(244,196,138,0.06))",
              }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <div style={planeStyle({ axis: "rotateY", deg: 90, push: W / 2, width: D, height: H })}>
            <motion.div
              className="h-full w-full rounded-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: showWalls ? 0.85 : 0,
                background: lit
                  ? "linear-gradient(160deg, rgba(242,168,78,0.4), rgba(217,138,61,0.18))"
                  : "linear-gradient(160deg, rgba(244,196,138,0.18), rgba(244,196,138,0.06))",
              }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          </div>
          <div style={planeStyle({ axis: "rotateY", deg: 180, push: D / 2, width: W, height: H })}>
            <motion.div
              className="h-full w-full rounded-sm"
              initial={{ opacity: 0 }}
              animate={{
                opacity: showWalls ? 0.85 : 0,
                background: lit
                  ? "linear-gradient(160deg, rgba(242,168,78,0.4), rgba(217,138,61,0.18))"
                  : "linear-gradient(160deg, rgba(244,196,138,0.18), rgba(244,196,138,0.06))",
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>

          {/* schach roof, layered as staggered strips across the depth */}
          {Array.from({ length: ROOF_STRIP_COUNT }).map((_, i) => {
            const stripDepth = D / ROOF_STRIP_COUNT;
            return (
              <div
                key={`schach-${i}`}
                style={planeStyle({
                  axis: "rotateX",
                  deg: 90,
                  push: H / 2,
                  width: stripDepth - 2,
                  height: W,
                  marginLeftOverride: -D / 2 + i * stripDepth,
                })}
              >
                <motion.div
                  className="h-full w-full rounded-sm"
                  style={{
                    background: "linear-gradient(90deg, #4a6741, #6b8f5c)",
                    rotate: `${(i - (ROOF_STRIP_COUNT - 1) / 2) * 2.5}deg`,
                  }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: showRoof ? 0.9 : 0, y: showRoof ? 0 : -8 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                />
              </div>
            );
          })}

          {/* interior: table + chairs */}
          <div
            style={{
              position: "absolute",
              left: W / 2 - 26,
              top: H - 46,
              transform: `translateZ(${-D / 2}px)`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: showInterior ? 1 : 0, scale: showInterior ? 1 : 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-5 w-14 rounded-sm" style={{ background: "var(--amber)", opacity: 0.85 }} />
              <div className="mt-1 flex gap-1.5">
                <div className="h-3 w-3 rounded-sm" style={{ background: "var(--gold-rim)", opacity: 0.75 }} />
                <div className="h-3 w-3 rounded-sm" style={{ background: "var(--gold-rim)", opacity: 0.75 }} />
                <div className="h-3 w-3 rounded-sm" style={{ background: "var(--gold-rim)", opacity: 0.75 }} />
              </div>
            </motion.div>
          </div>

          {/* warm glow once lit */}
          <motion.div
            className="absolute inset-0 rounded-sm"
            style={{ boxShadow: "0 0 70px 24px rgba(242,168,78,0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: lit ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>

      {/* final reveal: crossfade into the real night photo */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 1.4, delay: lit ? 0.5 : 0 }}
      >
        <Image
          src="/sukkah-night.jpg"
          alt="A completed Holiday Brothers sukkah, lit up at night"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 320px, 80vw"
        />
      </motion.div>
    </div>
  );
}
