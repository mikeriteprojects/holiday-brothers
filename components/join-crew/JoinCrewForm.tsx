"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { submitCrewApplication, isOk, type CrewApplicationAnswers } from "@/lib/api";
import OptionGrid from "@/components/booking/OptionGrid";

const CREW_ROLES: CrewApplicationAnswers["crew_role"][] = ["Builder Only", "Builder + Driver", "Driver Only"];
const DRIVING_SUBTYPES: NonNullable<CrewApplicationAnswers["driving_subtype"]>[] = [
  "Supplies only",
  "Crew only",
  "Both",
];

function computeAge(birthday: string): number | null {
  if (!birthday) return null;
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return null;
  return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
}

const initialForm = {
  name: "",
  email: "",
  phone: "",
  birthday: "",
  crew_role: "" as CrewApplicationAnswers["crew_role"] | "",
  driving_subtype: "" as NonNullable<CrewApplicationAnswers["driving_subtype"]> | "",
  school: "",
  prior_work: false,
  address: "",
  transport_guaranteed: false,
  emergency_contact_name: "",
  emergency_contact_phone: "",
  guardian_contact_name: "",
  guardian_contact_phone: "",
  medical_experience: false,
  medical_cert_url: "",
  waiver_accepted: false,
};

export default function JoinCrewForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ requiresConsent: boolean } | null>(null);

  const age = useMemo(() => computeAge(form.birthday), [form.birthday]);
  const needsGuardian = age !== null && age < 16;
  const needsDriving = form.crew_role === "Builder + Driver" || form.crew_role === "Driver Only";

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.crew_role) return setError("Choose Builder, Driver, or both.");
    if (!form.birthday) return setError("Birthday is required.");
    if (!form.emergency_contact_name || !form.emergency_contact_phone)
      return setError("Emergency contact is required for every applicant.");
    if (needsGuardian && (!form.guardian_contact_name || !form.guardian_contact_phone))
      return setError("A guardian contact is required for applicants under 16.");
    if (form.medical_experience && !form.medical_cert_url)
      return setError("A certification link is required if you have medical experience.");
    if (!form.waiver_accepted) return setError("You must accept the liability waiver.");

    setSubmitting(true);
    const res = await submitCrewApplication({
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      birthday: form.birthday,
      crew_role: form.crew_role,
      driving_subtype: needsDriving ? form.driving_subtype || undefined : undefined,
      school: form.school || undefined,
      prior_work: form.prior_work ? "TRUE" : "FALSE",
      address: form.address || undefined,
      transport_guaranteed: form.transport_guaranteed ? "TRUE" : "FALSE",
      emergency_contact_name: form.emergency_contact_name,
      emergency_contact_phone: form.emergency_contact_phone,
      guardian_contact_name: form.guardian_contact_name || undefined,
      guardian_contact_phone: form.guardian_contact_phone || undefined,
      medical_experience: form.medical_experience ? "TRUE" : "FALSE",
      medical_cert_url: form.medical_cert_url || undefined,
      waiver_accepted: "TRUE",
    });
    setSubmitting(false);
    if (!isOk(res)) return setError(res.error);
    setResult({ requiresConsent: res.requires_parental_consent });
  }

  if (result) {
    return (
      <motion.div className="glass p-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow mb-3">Application submitted</p>
        <h2>Thanks, {form.name || "friend"}.</h2>
        <p className="mt-3">
          Your application is under review. We&rsquo;ll reach out by phone or email once it&rsquo;s been looked at.
        </p>
        {result.requiresConsent && (
          <p className="mt-3" style={{ color: "var(--amber-bright)" }}>
            Since you&rsquo;re under 16, we&rsquo;ll also need to confirm consent with your parent or guardian before
            you can be scheduled.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-6 p-6 sm:p-8">
      <div>
        <h2 className="mb-4">Your info</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input
            className="input"
            type="date"
            placeholder="Birthday"
            value={form.birthday}
            onChange={(e) => set("birthday", e.target.value)}
          />
          <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          <input className="input" type="tel" placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        {age !== null && (
          <p className="mt-2 text-[13px]" style={{ color: "var(--text-faint)" }}>
            Age {age}
            {needsGuardian ? " — a guardian contact will be required below." : ""}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-4">Role</h2>
        <OptionGrid
          value={form.crew_role}
          onSelect={(v) => set("crew_role", v as CrewApplicationAnswers["crew_role"])}
          options={CREW_ROLES.map((r) => ({ value: r, label: r }))}
        />
      </div>

      {needsDriving && (
        <div>
          <h2 className="mb-4">Driving — what kind?</h2>
          <OptionGrid
            value={form.driving_subtype}
            onSelect={(v) => set("driving_subtype", v as NonNullable<CrewApplicationAnswers["driving_subtype"]>)}
            options={DRIVING_SUBTYPES.map((d) => ({ value: d, label: d }))}
          />
        </div>
      )}

      <div>
        <h2 className="mb-4">School / Yeshiva</h2>
        <input className="input" placeholder="Where do you attend? (optional)" value={form.school} onChange={(e) => set("school", e.target.value)} />
        <label className="mt-3 flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={form.prior_work} onChange={(e) => set("prior_work", e.target.checked)} />
          I have prior sukkah-building work experience
        </label>
      </div>

      <div>
        <h2 className="mb-4">Transportation & address</h2>
        <label className="mb-3 flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.transport_guaranteed}
            onChange={(e) => set("transport_guaranteed", e.target.checked)}
          />
          I have guaranteed transportation to jobs
        </label>
        {form.transport_guaranteed && (
          <p className="mb-3 text-[13px]" style={{ color: "var(--text-faint)" }}>
            We&rsquo;ll never default to arranging pickup for you if you check this.
          </p>
        )}
        <input
          className="input"
          placeholder={form.transport_guaranteed ? "Street (city/town is enough)" : "Full address"}
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
      </div>

      <div>
        <h2 className="mb-4">Emergency contact</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="input"
            placeholder="Name"
            value={form.emergency_contact_name}
            onChange={(e) => set("emergency_contact_name", e.target.value)}
          />
          <input
            className="input"
            type="tel"
            placeholder="Phone"
            value={form.emergency_contact_phone}
            onChange={(e) => set("emergency_contact_phone", e.target.value)}
          />
        </div>
      </div>

      {needsGuardian && (
        <div>
          <h2 className="mb-4">Guardian contact</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="input"
              placeholder="Name"
              value={form.guardian_contact_name}
              onChange={(e) => set("guardian_contact_name", e.target.value)}
            />
            <input
              className="input"
              type="tel"
              placeholder="Phone"
              value={form.guardian_contact_phone}
              onChange={(e) => set("guardian_contact_phone", e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4">Medical experience</h2>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={form.medical_experience}
            onChange={(e) => set("medical_experience", e.target.checked)}
          />
          I have relevant medical training or certification
        </label>
        {form.medical_experience && (
          <input
            className="input mt-3"
            placeholder="Link to certification / proof"
            value={form.medical_cert_url}
            onChange={(e) => set("medical_cert_url", e.target.value)}
          />
        )}
      </div>

      <div>
        <label className="flex items-start gap-2 text-[14px]">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.waiver_accepted}
            onChange={(e) => set("waiver_accepted", e.target.checked)}
          />
          I accept the liability waiver — volunteering medical info creates no additional liability.
        </label>
      </div>

      {error && (
        <p className="text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn primary" disabled={submitting} style={{ borderColor: "var(--amber-bright)" }}>
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
