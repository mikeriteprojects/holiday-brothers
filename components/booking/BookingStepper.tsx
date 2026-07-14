"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getPricing,
  submitBooking,
  setPassword,
  isOk,
  calculatePrice,
  getSelfDeliveryDiscount,
  getWorkerPickupDiscount,
  type PricingRow,
} from "@/lib/api";
import {
  STEP_LABELS,
  SIZE_OPTIONS,
  TYPE_OPTIONS,
  TYPE_DESCRIPTIONS,
  SPEED_OPTIONS,
  SPEED_DESCRIPTIONS,
  stageForStep,
  visibleSteps,
  type StepId,
} from "@/lib/booking/steps";
import OptionGrid from "./OptionGrid";
import SukkahBuildVisual from "./SukkahBuildVisual";

interface Answers {
  has_supplies: boolean | null;
  size: string;
  sukkah_type: string;
  speed_tier: string;
  self_delivery: boolean;
  worker_pickup: boolean;
  address: string;
  accountMode: "full" | "guest" | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

const INITIAL_ANSWERS: Answers = {
  has_supplies: null,
  size: "",
  sukkah_type: "",
  speed_tier: "",
  self_delivery: false,
  worker_pickup: false,
  address: "",
  accountMode: null,
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

function summarize(step: StepId, a: Answers): string {
  switch (step) {
    case "supplies":
      return a.has_supplies ? "Have supplies" : "Need supplies";
    case "size":
      return a.size;
    case "type":
      return a.sukkah_type;
    case "speed":
      return a.speed_tier;
    case "delivery":
      return [a.self_delivery && "Self-delivery", a.worker_pickup && "Own pickup"].filter(Boolean).join(", ") || "Standard";
    case "address":
      return a.address.slice(0, 28) + (a.address.length > 28 ? "…" : "");
    case "account":
      return a.accountMode === "guest" ? "Guest ticket" : "Full account";
  }
}

export default function BookingStepper() {
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [pricingRows, setPricingRows] = useState<PricingRow[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ booking_code: string; total: number } | null>(null);

  useEffect(() => {
    getPricing().then((res) => {
      if (isOk(res)) setPricingRows(res.rows);
    });
  }, []);

  const steps = useMemo(() => visibleSteps(answers.has_supplies), [answers.has_supplies]);
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];
  const answeredSteps = steps.slice(0, stepIndex);

  const price = useMemo(
    () => calculatePrice(pricingRows, answers.size, answers.sukkah_type, answers.speed_tier),
    [pricingRows, answers.size, answers.sukkah_type, answers.speed_tier]
  );
  const selfDeliveryDiscount = getSelfDeliveryDiscount(pricingRows);
  const workerPickupDiscount = getWorkerPickupDiscount(pricingRows);
  const discountedTotal =
    price.total - (answers.self_delivery ? selfDeliveryDiscount : 0) - (answers.worker_pickup ? workerPickupDiscount : 0);

  const visualStage = result ? 4 : stageForStep(currentStep === "account" ? "address" : currentStep);

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function jumpTo(step: StepId) {
    const idx = steps.indexOf(step);
    if (idx !== -1 && idx < stepIndex) setStepIndex(idx);
  }

  function selectAndAdvance(patch: Partial<Answers>) {
    setAnswers((a) => ({ ...a, ...patch }));
    window.setTimeout(goNext, 220);
  }

  async function handleSubmit() {
    if (!answers.address.trim()) {
      setError("An address is required.");
      return;
    }
    if (!answers.phone.trim() && !answers.email.trim()) {
      setError("At least a phone number or email is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const isGuest = answers.accountMode === "guest";
    const res = await submitBooking({
      has_supplies: answers.has_supplies ? "TRUE" : "FALSE",
      size: answers.size as "Small" | "Medium" | "Large",
      sukkah_type: answers.sukkah_type as "Canvas" | "Modular" | "Construction",
      speed_tier: answers.speed_tier as "Patient" | "Regular" | "Express",
      self_delivery: answers.self_delivery ? "TRUE" : "FALSE",
      worker_pickup: answers.worker_pickup ? "TRUE" : "FALSE",
      address: answers.address,
      guest_ticket: isGuest,
      username: isGuest ? undefined : answers.username || undefined,
      name: isGuest ? undefined : `${answers.firstName} ${answers.lastName}`.trim() || undefined,
      email: answers.email || undefined,
      phone: answers.phone || undefined,
    });
    if (!isOk(res)) {
      setError(res.error);
      setSubmitting(false);
      return;
    }
    if (!isGuest && answers.password) {
      await setPassword({ account_id: res.account_id, password: answers.password });
    }
    setResult({ booking_code: res.booking_code, total: res.price.total });
    setSubmitting(false);
  }

  if (result) {
    return (
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        <motion.div
          className="glass p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow mb-3">Job confirmed</p>
          <h2>You&rsquo;re booked, {answers.firstName || "friend"}.</h2>
          <p className="mt-3">
            Confirmation code <span style={{ color: "var(--text-cream)" }}>{result.booking_code}</span>. We&rsquo;ll text
            or email you as soon as your quote is finalized.
          </p>
          <p className="mt-4 text-[15px]" style={{ color: "var(--text-cream)" }}>
            Estimated total: ${discountedTotal.toFixed(0)}
          </p>
        </motion.div>
        <SukkahBuildVisual stage={4} className="lg:sticky lg:top-24" />
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="space-y-1.5">
          {answeredSteps.map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => jumpTo(step)}
              className="step-row w-full text-left"
            >
              <span>{STEP_LABELS[step]}</span>
              <span className="step-value">{summarize(step, answers)}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="active-q mt-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4">{STEP_LABELS[currentStep]}</h2>

            {currentStep === "supplies" && (
              <OptionGrid
                value={answers.has_supplies === null ? null : answers.has_supplies ? "yes" : "no"}
                onSelect={(v) => selectAndAdvance({ has_supplies: v === "yes" })}
                options={[
                  { value: "no", label: "No, I need supplies", description: "We'll source and deliver everything." },
                  { value: "yes", label: "Yes, I have supplies", description: "Just need the crew to build." },
                ]}
              />
            )}

            {currentStep === "size" && (
              <OptionGrid
                value={answers.size}
                onSelect={(v) => selectAndAdvance({ size: v })}
                options={SIZE_OPTIONS.map((s) => ({ value: s, label: s }))}
              />
            )}

            {currentStep === "type" && (
              <OptionGrid
                value={answers.sukkah_type}
                onSelect={(v) => selectAndAdvance({ sukkah_type: v })}
                options={TYPE_OPTIONS.map((t) => ({ value: t, label: t, description: TYPE_DESCRIPTIONS[t] }))}
              />
            )}

            {currentStep === "speed" && (
              <OptionGrid
                value={answers.speed_tier}
                onSelect={(v) => selectAndAdvance({ speed_tier: v })}
                options={SPEED_OPTIONS.map((s) => ({ value: s, label: s, description: SPEED_DESCRIPTIONS[s] }))}
              />
            )}

            {currentStep === "delivery" && (
              <div>
                <div className="option-grid">
                  <button
                    type="button"
                    className={`option-btn ${answers.self_delivery ? "selected" : ""}`}
                    onClick={() => setAnswers((a) => ({ ...a, self_delivery: !a.self_delivery }))}
                  >
                    <div className="font-medium">
                      Self-deliver &amp; save{selfDeliveryDiscount ? ` $${selfDeliveryDiscount}` : ""}
                    </div>
                    <div className="mt-0.5 text-[13px]" style={{ color: "var(--text-faint)" }}>
                      You pick up the supplies yourself.
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${answers.worker_pickup ? "selected" : ""}`}
                    onClick={() => setAnswers((a) => ({ ...a, worker_pickup: !a.worker_pickup }))}
                  >
                    <div className="font-medium">
                      Pick up the crew &amp; save{workerPickupDiscount ? ` $${workerPickupDiscount}` : ""}
                    </div>
                    <div className="mt-0.5 text-[13px]" style={{ color: "var(--text-faint)" }}>
                      You bring the workers to the job yourself.
                    </div>
                  </button>
                </div>
                <button type="button" className="btn mt-4" onClick={goNext}>
                  Continue
                </button>
              </div>
            )}

            {currentStep === "address" && (
              <div>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Full address where the sukkah will be built"
                  value={answers.address}
                  onChange={(e) => setAnswers((a) => ({ ...a, address: e.target.value }))}
                />
                <button
                  type="button"
                  className="btn mt-4"
                  disabled={!answers.address.trim()}
                  onClick={goNext}
                >
                  Continue
                </button>
              </div>
            )}

            {currentStep === "account" && (
              <div>
                <div className="option-grid mb-4">
                  <button
                    type="button"
                    className={`option-btn ${answers.accountMode === "full" ? "selected" : ""}`}
                    onClick={() => setAnswers((a) => ({ ...a, accountMode: "full" }))}
                  >
                    <div className="font-medium">Create a full account</div>
                    <div className="mt-0.5 text-[13px]" style={{ color: "var(--text-faint)" }}>
                      Track jobs, earn Priority Points, chat with us.
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`option-btn ${answers.accountMode === "guest" ? "selected" : ""}`}
                    onClick={() => setAnswers((a) => ({ ...a, accountMode: "guest" }))}
                  >
                    <div className="font-medium">Continue as guest</div>
                    <div className="mt-0.5 text-[13px]" style={{ color: "var(--text-faint)" }}>
                      Just a phone number — no account needed.
                    </div>
                  </button>
                </div>

                {answers.accountMode && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {answers.accountMode === "full" && (
                      <>
                        <input
                          className="input"
                          placeholder="First name"
                          value={answers.firstName}
                          onChange={(e) => setAnswers((a) => ({ ...a, firstName: e.target.value }))}
                        />
                        <input
                          className="input"
                          placeholder="Last name"
                          value={answers.lastName}
                          onChange={(e) => setAnswers((a) => ({ ...a, lastName: e.target.value }))}
                        />
                        <input
                          className="input"
                          placeholder="Username"
                          value={answers.username}
                          onChange={(e) => setAnswers((a) => ({ ...a, username: e.target.value }))}
                        />
                        <input
                          className="input"
                          type="password"
                          placeholder="Password"
                          value={answers.password}
                          onChange={(e) => setAnswers((a) => ({ ...a, password: e.target.value }))}
                        />
                      </>
                    )}
                    <input
                      className="input"
                      type="email"
                      placeholder="Email"
                      value={answers.email}
                      onChange={(e) => setAnswers((a) => ({ ...a, email: e.target.value }))}
                    />
                    <input
                      className="input"
                      type="tel"
                      placeholder="Phone"
                      value={answers.phone}
                      onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
                    />
                  </div>
                )}

                {error && (
                  <p className="mt-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  className="btn primary mt-4"
                  disabled={!answers.accountMode || submitting}
                  onClick={handleSubmit}
                  style={{ borderColor: "var(--amber-bright)" }}
                >
                  {submitting ? "Booking…" : "Book it"}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {answers.size && (
          <motion.div
            className="glass mt-4 p-4 text-[14px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between" style={{ color: "var(--text-muted)" }}>
              <span>Estimated price</span>
              <span style={{ color: "var(--text-cream)" }}>${discountedTotal.toFixed(0)}</span>
            </div>
          </motion.div>
        )}
      </div>

      <SukkahBuildVisual stage={visualStage} className="lg:sticky lg:top-24" />
    </div>
  );
}
