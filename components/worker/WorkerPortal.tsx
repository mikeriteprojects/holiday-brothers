"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  getWorkerDashboard,
  getWorkerOpenJobs,
  claimJob,
  crewButtonTap,
  requestRedemption,
  setPayoutPreference,
  isOk,
  getStoredAccountId,
  clearSession,
  type Account,
  type Job,
  type RewardRow,
  type RedemptionRow,
  type OpenJobListing,
  type Currency,
} from "@/lib/api";

const CURRENCY_LABELS: Record<Currency, string> = {
  Priority: "Priority",
  Incentive: "Incentive",
  Referral: "Referral",
  Vendor: "Vendor",
  Shop: "Shop",
};

export default function WorkerPortal() {
  const router = useRouter();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [worker, setWorker] = useState<Account | null>(null);
  const [balances, setBalances] = useState<Record<Currency, number> | null>(null);
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [openJobs, setOpenJobs] = useState<OpenJobListing[]>([]);
  const [jobLabels, setJobLabels] = useState<Record<string, string | null>>({});
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async (id: string) => {
    const [dash, open] = await Promise.all([
      getWorkerDashboard({ worker_id: id }),
      getWorkerOpenJobs({ account_id: id }),
    ]);
    if (isOk(dash)) {
      setWorker(dash.worker);
      setBalances(dash.balances);
      setCurrentJobs(dash.current_jobs);
      setPastJobs(dash.past_jobs);
      setRewards(dash.rewards);
      setRedemptions(dash.redemptions);
    }
    if (isOk(open)) setOpenJobs(open.rows);
    setLoading(false);
  }, []);

  useEffect(() => {
    const id = getStoredAccountId();
    if (!id) {
      router.replace("/worker-login");
      return;
    }
    setAccountId(id);
    load(id);
  }, [load, router]);

  async function handleClaim(jobId: string) {
    if (!accountId) return;
    const res = await claimJob({ job_id: jobId, worker_id: accountId });
    if (isOk(res)) {
      setMessage("Requested — admin will confirm your assignment.");
      load(accountId);
    }
  }

  async function handleTap(jobId: string) {
    const res = await crewButtonTap({ job_id: jobId });
    if (isOk(res)) {
      setJobLabels((m) => ({ ...m, [jobId]: res.next_label }));
      if (!res.next_label && accountId) load(accountId);
    }
  }

  async function handleRedeem(rewardId: string, currency: Currency) {
    if (!accountId) return;
    const res = await requestRedemption({ worker_id: accountId, reward_id: rewardId, currency });
    setMessage(isOk(res) ? "Redemption requested." : res.error);
    if (isOk(res)) load(accountId);
  }

  async function handleBatchToggle(batch: boolean) {
    if (!accountId) return;
    await setPayoutPreference({ account_id: accountId, batch });
    load(accountId);
  }

  function handleLogout() {
    clearSession();
    router.push("/worker-login");
  }

  if (loading) {
    return <p style={{ color: "var(--text-faint)" }}>Loading your dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1>Welcome back{worker?.first_name ? `, ${worker.first_name}` : ""}</h1>
        <button type="button" className="btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[14px]"
          style={{ color: "var(--amber-bright)" }}
        >
          {message}
        </motion.p>
      )}

      {balances && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.keys(CURRENCY_LABELS) as Currency[]).map((c) => (
            <div key={c} className="glass p-4 text-center">
              <div className="eyebrow">{CURRENCY_LABELS[c]}</div>
              <div className="mt-2 text-2xl font-display" style={{ color: "var(--text-cream)" }}>
                {balances[c] ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-4">Your jobs</h2>
        {currentJobs.length === 0 && <p style={{ color: "var(--text-faint)" }}>No active jobs right now.</p>}
        <div className="space-y-3">
          {currentJobs.map((job) => (
            <div key={job.job_id} className="glass flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div style={{ color: "var(--text-cream)" }}>{job.job_type || "Sukkah build"}</div>
                <div className="text-[13px]" style={{ color: "var(--text-faint)" }}>
                  {job.date} · {job.status}
                </div>
              </div>
              <button type="button" className="btn" onClick={() => handleTap(job.job_id)}>
                {jobLabels[job.job_id] ?? "Begin Drive"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4">Open jobs</h2>
        {openJobs.length === 0 && <p style={{ color: "var(--text-faint)" }}>No open jobs match right now.</p>}
        <div className="space-y-3">
          {openJobs.map((job) => (
            <div key={job.job_id} className="glass flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div style={{ color: "var(--text-cream)" }}>{job.job_type} — {job.neighborhood}</div>
                <div className="text-[13px]" style={{ color: "var(--text-faint)" }}>
                  {job.date} · {job.tier}
                  {job.pay_amount !== undefined ? ` · $${job.pay_amount}` : ""}
                </div>
              </div>
              <button type="button" className="btn" onClick={() => handleClaim(job.job_id)}>
                Request this job
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2>Rewards</h2>
          <label className="flex items-center gap-2 text-[13px]" style={{ color: "var(--text-faint)" }}>
            <input
              type="checkbox"
              checked={worker?.batch_payout_pref === "TRUE"}
              onChange={(e) => handleBatchToggle(e.target.checked)}
            />
            Batch payouts (bonus incentive points)
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {rewards.map((r) => (
            <div key={r.reward_id} className="glass p-4">
              <div style={{ color: "var(--text-cream)" }}>{r.label}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.cost_incentive_points ? (
                  <button type="button" className="btn" onClick={() => handleRedeem(r.reward_id, "Incentive")}>
                    {r.cost_incentive_points} Incentive
                  </button>
                ) : null}
                {r.cost_shop_points ? (
                  <button type="button" className="btn" onClick={() => handleRedeem(r.reward_id, "Shop")}>
                    {r.cost_shop_points} Shop
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      {redemptions.length > 0 && (
        <section>
          <h2 className="mb-4">Your redemptions</h2>
          <div className="space-y-2">
            {redemptions.map((r) => (
              <div key={r.redemption_id} className="step-row">
                <span>
                  {r.currency_used} — {r.cost_paid}
                </span>
                <span className="step-value">{r.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {pastJobs.length > 0 && (
        <section>
          <h2 className="mb-4">Past jobs</h2>
          <div className="space-y-2">
            {pastJobs.map((job) => (
              <div key={job.job_id} className="step-row">
                <span>{job.job_type || "Sukkah build"}</span>
                <span className="step-value">{job.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
