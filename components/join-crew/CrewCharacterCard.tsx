"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface StatRow {
  key: string;
  label: string;
  value: string | null;
}

interface Props {
  name: string;
  age: number | null;
  crewRole: string;
  drivingSubtype: string;
  needsDriving: boolean;
  school: string;
  priorWork: boolean;
  transportGuaranteed: boolean;
  address: string;
  medicalExperience: boolean;
  emergencyContactName: string;
  guardianContactName: string;
  needsGuardian: boolean;
  waiverAccepted: boolean;
  className?: string;
}

const ROLE_ICON: Record<string, JSX.Element> = {
  "Builder Only": (
    <>
      <path d="M8 40 L28 8" />
      <path d="M18 40 L38 8" />
      <path d="M4 20 L26 26" />
    </>
  ),
  "Builder + Driver": (
    <>
      <rect x="2" y="8" width="24" height="16" />
      <path d="M26 14h10l8 8v2H26z" />
      <circle cx="12" cy="27" r="3" />
      <circle cx="34" cy="27" r="3" />
    </>
  ),
  "Driver Only": (
    <>
      <rect x="2" y="8" width="24" height="16" />
      <path d="M26 14h10l8 8v2H26z" />
      <circle cx="12" cy="27" r="3" />
      <circle cx="34" cy="27" r="3" />
    </>
  ),
};

function RoleGlyph({ role }: { role: string }) {
  const path = ROLE_ICON[role];
  if (!path) return null;
  return (
    <svg viewBox="0 0 48 48" width="26" height="26" fill="none" stroke="var(--gold-rim)" strokeWidth="2.4">
      {path}
    </svg>
  );
}

function SilhouetteIcon() {
  return (
    <svg viewBox="0 0 96 96" width="100%" height="100%" fill="none">
      <circle cx="48" cy="48" r="48" fill="var(--panel-glass-strong)" />
      <circle cx="48" cy="38" r="16" fill="var(--panel-border-strong)" />
      <path d="M18 88c2-20 14-30 30-30s28 10 30 30" fill="var(--panel-border-strong)" />
    </svg>
  );
}

function CameraBadge() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--bg-deep)" strokeWidth="2">
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

export default function CrewCharacterCard(props: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  }

  const rows: StatRow[] = useMemo(
    () => [
      { key: "age", label: "Age", value: props.age !== null ? String(props.age) : null },
      { key: "role", label: "Role", value: props.crewRole || null },
      { key: "driving", label: "Driving", value: props.needsDriving ? props.drivingSubtype || null : null },
      { key: "school", label: "School", value: props.school || null },
      { key: "experience", label: "Experience", value: props.priorWork ? "Prior building work" : null },
      {
        key: "transport",
        label: "Transport",
        value: props.transportGuaranteed ? "Guaranteed" : props.address ? "Needs pickup arranged" : null,
      },
      { key: "medical", label: "Medical training", value: props.medicalExperience ? "Certified" : null },
      { key: "emergency", label: "Emergency contact", value: props.emergencyContactName || null },
      {
        key: "guardian",
        label: "Guardian contact",
        value: props.needsGuardian ? props.guardianContactName || null : null,
      },
      { key: "waiver", label: "Waiver", value: props.waiverAccepted ? "Accepted" : null },
    ],
    [props]
  );

  const trackedTotal = rows.length;
  const filledCount = rows.filter((r) => r.value).length;
  const filledRows = rows.filter((r) => r.value);
  const progressPct = Math.round((filledCount / trackedTotal) * 100);

  return (
    <div className={`glass p-6 ${props.className ?? ""}`}>
      <p className="eyebrow mb-4">Crew profile</p>

      <div className="flex flex-col items-center">
        <div className="relative">
          <div
            className="relative h-24 w-24 overflow-hidden rounded-full border-2"
            style={{ borderColor: "var(--amber-bright)", boxShadow: "0 0 18px rgba(242,168,78,0.35)" }}
          >
            <AnimatePresence mode="wait">
              {photo ? (
                <motion.div
                  key="photo"
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src={photo} alt="Your profile photo" fill className="object-cover" unoptimized />
                </motion.div>
              ) : (
                <motion.div
                  key="silhouette"
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SilhouetteIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: "var(--gold-rim)" }}
            aria-label={photo ? "Change profile photo" : "Add profile photo"}
          >
            <CameraBadge />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <motion.h2
          key={props.name || "placeholder"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-[19px]"
        >
          {props.name || "New Recruit"}
        </motion.h2>

        <AnimatePresence>
          {props.crewRole && (
            <motion.div
              key="role-badge"
              className="mt-2 flex items-center gap-2 rounded-sm border px-3 py-1.5"
              style={{ borderColor: "var(--panel-border-strong)", background: "var(--panel-glass-strong)" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <RoleGlyph role={props.crewRole} />
              <span className="text-[13.5px]" style={{ color: "var(--gold-rim)" }}>
                {props.crewRole}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>
          <span>Profile complete</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--panel-glass-strong)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--amber), var(--gold-rim))" }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-0.5">
        <AnimatePresence initial={false}>
          {filledRows.length === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-3 text-center text-[13px]"
              style={{ color: "var(--text-faint)" }}
            >
              Fill in the form to build your profile.
            </motion.p>
          )}
          {filledRows.map((row) => (
            <motion.div
              key={row.key}
              layout
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="flex items-center justify-between border-b py-2 text-[13.5px]"
              style={{ borderColor: "var(--panel-border)" }}
            >
              <span style={{ color: "var(--text-faint)" }}>{row.label}</span>
              <span className="max-w-[55%] truncate text-right" style={{ color: "var(--text-cream)" }}>
                {row.value}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
