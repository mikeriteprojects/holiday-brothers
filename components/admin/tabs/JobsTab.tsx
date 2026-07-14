"use client";

import { useEffect, useState } from "react";
import { getAdminJobs, completeJob, triggerWeatherHold, isOk, type Job } from "@/lib/api";

export default function JobsTab({ accountId }: { accountId: string }) {
  const [rows, setRows] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAdminJobs({ account_id: accountId });
    if (isOk(res)) setRows(res.rows);
    else setError(res.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleComplete(job: Job) {
    const res = await completeJob({ account_id: accountId, job_id: job.job_id, booking_code: job.booking_code });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleWeatherHold(job: Job) {
    const res = await triggerWeatherHold({ account_id: accountId, booking_code: job.booking_code });
    if (isOk(res)) load();
    else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      <h2 className="mb-4">Jobs</h2>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="space-y-2">
        {rows.map((job) => (
          <div key={job.job_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
            <div className="flex-1 min-w-[220px]">
              <div style={{ color: "var(--text-cream)" }}>
                {job.job_id} — {job.job_type} ({job.status})
              </div>
              <div style={{ color: "var(--text-faint)" }}>
                {job.date} · {job.booking_code}
                {String(job.time_discrepancy_flag).toUpperCase() === "TRUE" ? " · ⚠ time discrepancy" : ""}
              </div>
            </div>
            {job.status === "Pending Completion" && (
              <button type="button" className="btn" onClick={() => handleComplete(job)}>
                Mark completed
              </button>
            )}
            <button type="button" className="btn" onClick={() => handleWeatherHold(job)}>
              Weather hold
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
