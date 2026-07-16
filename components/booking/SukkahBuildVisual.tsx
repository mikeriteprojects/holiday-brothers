"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { CSSProperties } from "react";
import { assetPath } from "@/lib/basePath";
import type { StepId } from "@/lib/booking/steps";

/**
 * Illustrated, per-question companion for the booking stepper. Each step gets
 * its own small scene (dashed "not built yet" outlines, a pile of planks, size
 * silhouettes, pinned type flyers, a live clock, an address pin, a folder or
 * receipt) rather than one generic progress box. Built from plain CSS/SVG —
 * no photoreal 3D asset exists for this, so depth is an illusion via
 * perspective + a slight static rotateX/Y tilt on the "stage", the same
 * technique used elsewhere in this codebase (see the home hero's cloud
 * layer / booking visual's prior iteration).
 *
 * Hovering the panel replays the current scene's entrance animation: bumping
 * `replayNonce` changes the scene's React key, which remounts it.
 */

const WOOD_PHOTO = assetPath("/sukkah-day.jpg");

function woodTexture(position: string): CSSProperties {
  return {
    backgroundImage: `linear-gradient(160deg, rgba(36,22,16,0.3), rgba(36,22,16,0.12)), url(${WOOD_PHOTO})`,
    backgroundSize: "auto, 480% 480%",
    backgroundPosition: `center, ${position}`,
  };
}

interface Props {
  step: StepId;
  hasSupplies: boolean | null;
  size: string;
  sukkahType: string;
  speedTier: string;
  hoveredSpeed: string | null;
  selfDelivery: boolean;
  workerPickup: boolean;
  addressTyped: string;
  addressValid: boolean | null;
  accountMode: "full" | "guest" | null;
  discounts: { label: string; amount: number }[];
  price: number;
  /** True once the booking has actually been submitted — shows the real photo payoff. */
  completed?: boolean;
  className?: string;
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[280px] w-full items-center justify-center" style={{ perspective: 900 }}>
      <div style={{ transformStyle: "preserve-3d", transform: "rotateX(8deg) rotateY(-12deg)" }}>{children}</div>
    </div>
  );
}

function Plank({ style, delay }: { style: CSSProperties; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-sm"
      style={{ ...style }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 0.95, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 140, damping: 14 }}
    />
  );
}

const PLANK_LAYOUT = [
  { top: 40, left: 20, width: 90, height: 16, rotate: -8, crop: "20% 40%" },
  { top: 60, left: 60, width: 100, height: 16, rotate: 6, crop: "50% 30%" },
  { top: 82, left: 30, width: 95, height: 16, rotate: -3, crop: "70% 55%" },
  { top: 104, left: 70, width: 85, height: 16, rotate: 10, crop: "35% 70%" },
  { top: 126, left: 45, width: 100, height: 16, rotate: -12, crop: "85% 20%" },
];

function SuppliesScene({ hasSupplies }: { hasSupplies: boolean | null }) {
  return (
    <Stage>
      <div className="relative" style={{ width: 220, height: 190 }}>
        <AnimatePresence>
          {hasSupplies !== false && (
            <motion.div
              className="beam-outline absolute"
              style={{ left: 10, top: 30, width: 200, height: 130 }}
              initial={{ opacity: 0.75 }}
              animate={
                hasSupplies === true
                  ? { opacity: 0 }
                  : { opacity: [0.75, 0.15, 0.75, 0.15, 0.75] }
              }
              transition={hasSupplies === true ? { duration: 0.6, delay: 0.5 } : { duration: 1.1, repeat: Infinity }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        {hasSupplies === true &&
          PLANK_LAYOUT.map((p, i) => (
            <Plank
              key={i}
              delay={i * 0.08}
              style={{
                top: p.top,
                left: p.left,
                width: p.width,
                height: p.height,
                rotate: `${p.rotate}deg`,
                ...woodTexture(p.crop),
              }}
            />
          ))}
        {hasSupplies === false && (
          <motion.p
            className="absolute left-0 right-0 top-[150px] text-center text-[13px]"
            style={{ color: "var(--text-faint)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            We&rsquo;ll bring everything.
          </motion.p>
        )}
      </div>
    </Stage>
  );
}

const SIZE_DIMS: Record<string, { w: number; h: number }> = {
  Small: { w: 80, h: 70 },
  Medium: { w: 110, h: 95 },
  Large: { w: 140, h: 120 },
};

function SizeScene({ size, hasSupplies }: { size: string; hasSupplies: boolean | null }) {
  return (
    <Stage>
      <div className="flex items-end gap-6">
        {(["Small", "Medium", "Large"] as const).map((s, i) => {
          const dims = SIZE_DIMS[s];
          const selected = size === s;
          return (
            <div key={s} className="flex flex-col items-center gap-2">
              <div
                className="beam-outline relative"
                style={{
                  width: dims.w,
                  height: dims.h,
                  borderStyle: selected ? "solid" : "dashed",
                  borderColor: selected ? "var(--gold-rim)" : "var(--amber-bright)",
                  boxShadow: selected ? "0 0 14px rgba(242,200,121,0.5)" : "none",
                }}
              >
                {hasSupplies === true && (
                  <>
                    <motion.div
                      className="absolute rounded-full"
                      style={{ left: 8, bottom: 4, width: dims.w - 16, height: 6, ...woodTexture("30% 40%") }}
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 0.95 }}
                      transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 130, damping: 12 }}
                    />
                    <motion.div
                      className="absolute rounded-full"
                      style={{ left: 4, top: 6, width: 6, height: dims.h - 12, ...woodTexture("60% 60%") }}
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 0.95 }}
                      transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 130, damping: 12 }}
                    />
                  </>
                )}
              </div>
              <span className="text-[12.5px]" style={{ color: selected ? "var(--gold-rim)" : "var(--text-faint)" }}>
                {s}
              </span>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}

function CanvasIcon() {
  return (
    <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="var(--gold-rim)" strokeWidth="2">
      <path d="M6 14 Q24 6 42 14 L42 38 Q24 30 6 38 Z" />
      <path d="M6 14 Q24 22 42 14" />
    </svg>
  );
}
function ModularIcon() {
  return (
    <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="var(--gold-rim)" strokeWidth="2">
      <rect x="6" y="8" width="16" height="16" />
      <rect x="26" y="8" width="16" height="16" />
      <rect x="6" y="26" width="16" height="16" />
      <rect x="26" y="26" width="16" height="16" />
    </svg>
  );
}
function ConstructionIcon() {
  return (
    <svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="var(--gold-rim)" strokeWidth="2">
      <path d="M8 40 L28 8" />
      <path d="M18 40 L38 8" />
      <path d="M4 20 L26 26" />
      <circle cx="14" cy="24" r="1.6" fill="var(--gold-rim)" />
      <circle cx="24" cy="14" r="1.6" fill="var(--gold-rim)" />
    </svg>
  );
}

const TYPE_ICONS: Record<string, () => JSX.Element> = {
  Canvas: CanvasIcon,
  Modular: ModularIcon,
  Construction: ConstructionIcon,
};

function TypeScene({ sukkahType, size, hasSupplies }: { sukkahType: string; size: string; hasSupplies: boolean | null }) {
  const materialCount = size === "Large" ? 4 : size === "Medium" ? 3 : size === "Small" ? 2 : 0;
  return (
    <Stage>
      <div className="flex items-start gap-5">
        {(["Canvas", "Modular", "Construction"] as const).map((t, i) => {
          const Icon = TYPE_ICONS[t];
          const selected = sukkahType === t;
          const showMaterial = hasSupplies === true && selected && materialCount > 0;
          return (
            <motion.div
              key={t}
              className="flyer-card relative flex w-[92px] flex-col items-center gap-2"
              style={{ rotate: `${i === 0 ? -4 : i === 1 ? 2 : -2}deg`, borderColor: selected ? "var(--amber-bright)" : undefined }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <span className="flyer-pin" />
              {showMaterial ? (
                <div className="flex h-[34px] items-end gap-0.5">
                  {Array.from({ length: materialCount }).map((_, j) => (
                    <motion.div
                      key={j}
                      className="rounded-sm"
                      style={{ width: 6, height: 14 + j * 5, ...woodTexture(`${20 + j * 20}% 40%`) }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: j * 0.06, duration: 0.3 }}
                    />
                  ))}
                </div>
              ) : (
                <Icon />
              )}
              <span className="text-[11.5px]" style={{ color: selected ? "var(--gold-rim)" : "var(--text-faint)" }}>
                {t}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Stage>
  );
}

const SPEED_TIMES: Record<string, { hour: number; minute: number }> = {
  Patient: { hour: 9, minute: 0 },
  Regular: { hour: 4, minute: 30 },
  Express: { hour: 1, minute: 0 },
};

function SpeedScene({ speedTier, hoveredSpeed }: { speedTier: string; hoveredSpeed: string | null }) {
  const active = hoveredSpeed ?? speedTier;
  const time = SPEED_TIMES[active] ?? { hour: 12, minute: 0 };
  const hourAngle = (time.hour % 12) * 30 + time.minute * 0.5;
  const minuteAngle = time.minute * 6;
  const locked = !!speedTier && !hoveredSpeed;

  return (
    <Stage>
      <div className="relative flex items-center justify-center">
        <div className="clock-face relative" style={{ width: 150, height: 150 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 2,
                height: 8,
                background: "var(--panel-border-strong)",
                transform: `rotate(${i * 30}deg) translate(-1px, -70px)`,
              }}
            />
          ))}
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
            style={{ width: 4, height: 40, marginLeft: -2, marginTop: -40, background: "var(--gold-rim)" }}
            animate={{ rotate: hourAngle }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 origin-bottom rounded-full"
            style={{ width: 3, height: 58, marginLeft: -1.5, marginTop: -58, background: "var(--amber-bright)" }}
            animate={{ rotate: minuteAngle }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
          />
          <div
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4, background: "var(--gold-rim)" }}
          />
          {locked && (
            <motion.div
              className="absolute flex items-center justify-center rounded-full"
              style={{
                right: -6,
                bottom: -6,
                width: 26,
                height: 26,
                background: "var(--bg-deep-2)",
                border: "2px solid var(--amber-bright)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--gold-rim)" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </Stage>
  );
}

function DeliveryScene({ selfDelivery, workerPickup }: { selfDelivery: boolean; workerPickup: boolean }) {
  return (
    <Stage>
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2">
          <svg
            viewBox="0 0 48 32"
            width="52"
            height="36"
            fill="none"
            stroke={selfDelivery ? "var(--gold-rim)" : "var(--text-faint)"}
            strokeWidth="2"
          >
            <rect x="2" y="8" width="24" height="16" />
            <path d="M26 14h10l8 8v2H26z" />
            <circle cx="12" cy="27" r="3" />
            <circle cx="34" cy="27" r="3" />
          </svg>
          <span className="text-[11.5px]" style={{ color: selfDelivery ? "var(--gold-rim)" : "var(--text-faint)" }}>
            Self-delivery
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <svg
            viewBox="0 0 48 48"
            width="40"
            height="40"
            fill="none"
            stroke={workerPickup ? "var(--gold-rim)" : "var(--text-faint)"}
            strokeWidth="2"
          >
            <circle cx="24" cy="10" r="5" />
            <path d="M12 40v-8a12 12 0 0 1 24 0v8" />
            <path d="M8 30h8M32 30h8" />
          </svg>
          <span className="text-[11.5px]" style={{ color: workerPickup ? "var(--gold-rim)" : "var(--text-faint)" }}>
            Own pickup
          </span>
        </div>
      </div>
    </Stage>
  );
}

function AddressScene({ addressTyped, addressValid }: { addressTyped: string; addressValid: boolean | null }) {
  const pinColor = addressValid === false ? "var(--danger)" : addressValid === true ? "var(--gold-rim)" : "var(--text-faint)";
  return (
    <Stage>
      <div className="flex flex-col items-center gap-3">
        <motion.svg
          viewBox="0 0 24 32"
          width="36"
          height="48"
          fill="none"
          stroke={pinColor}
          strokeWidth="2"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 10 }}
        >
          <path d="M12 30S2 18 2 11a10 10 0 1 1 20 0c0 7-10 19-10 19z" />
          <circle cx="12" cy="11" r="4" fill={pinColor} stroke="none" />
        </motion.svg>
        <p
          className="max-w-[220px] break-words text-center text-[12.5px]"
          style={{ color: "var(--text-cream)", fontFamily: "var(--font-ibm-plex-mono), monospace" }}
        >
          {addressTyped || "…"}
        </p>
      </div>
    </Stage>
  );
}

function PhotoRevealScene() {
  return (
    <div className="relative h-[280px] w-full overflow-hidden rounded-sm">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      >
        <Image
          src={assetPath("/sukkah-night.jpg")}
          alt="A completed Holiday Brothers sukkah, lit up at night"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 340px, 80vw"
        />
      </motion.div>
    </div>
  );
}

function FolderScene() {
  return (
    <Stage>
      <div className="relative" style={{ width: 160, height: 110 }}>
        <div
          className="absolute inset-0 rounded-sm"
          style={{ background: "linear-gradient(160deg, var(--amber), var(--amber-bright))", opacity: 0.35 }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 origin-top rounded-sm"
          style={{ height: 110, background: "linear-gradient(160deg, var(--gold-rim), var(--amber))" }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -100 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeInOut" }}
        />
        <span
          className="absolute -bottom-7 left-0 right-0 text-center text-[12.5px]"
          style={{ color: "var(--text-faint)" }}
        >
          Setting up your account…
        </span>
      </div>
    </Stage>
  );
}

function ReceiptPreviewScene({ discounts, price }: { discounts: { label: string; amount: number }[]; price: number }) {
  return (
    <Stage>
      <div className="receipt w-[220px]">
        <p className="text-[11px] uppercase tracking-wide" style={{ color: "var(--amber-bright)" }}>
          Guest receipt (preview)
        </p>
        <div className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
          {discounts.map((d) => (
            <div className="flex justify-between" key={d.label}>
              <span>{d.label}</span>
              <span style={{ color: "var(--amber-bright)" }}>-${Math.abs(d.amount).toFixed(0)}</span>
            </div>
          ))}
          <div className="mt-1 flex justify-between font-medium" style={{ color: "var(--text-cream)" }}>
            <span>Estimate</span>
            <span>${price.toFixed(0)}</span>
          </div>
          <p className="mt-2 text-[11.5px]" style={{ color: "var(--text-faint)" }}>
            Login code generated after booking.
          </p>
        </div>
      </div>
    </Stage>
  );
}

function SukkahBuildVisual(props: Props) {
  const [replayNonce, setReplayNonce] = useState(0);

  function renderScene() {
    switch (props.step) {
      case "supplies":
        return <SuppliesScene hasSupplies={props.hasSupplies} />;
      case "size":
        return <SizeScene size={props.size} hasSupplies={props.hasSupplies} />;
      case "type":
        return <TypeScene sukkahType={props.sukkahType} size={props.size} hasSupplies={props.hasSupplies} />;
      case "speed":
        return <SpeedScene speedTier={props.speedTier} hoveredSpeed={props.hoveredSpeed} />;
      case "delivery":
        return <DeliveryScene selfDelivery={props.selfDelivery} workerPickup={props.workerPickup} />;
      case "address":
        return <AddressScene addressTyped={props.addressTyped} addressValid={props.addressValid} />;
      case "account":
        if (props.completed) return <PhotoRevealScene />;
        return props.accountMode === "guest" ? (
          <ReceiptPreviewScene discounts={props.discounts} price={props.price} />
        ) : (
          <FolderScene />
        );
    }
  }

  return (
    <div
      className={`glass overflow-hidden p-4 ${props.className ?? ""}`}
      onMouseEnter={() => setReplayNonce((n) => n + 1)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${props.step}-${replayNonce}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default memo(SukkahBuildVisual);
