"use client";

import { useEffect, useState } from "react";
import { getAdminCrew, hireWorker, isOk, type Account } from "@/lib/api";

export default function CrewTab({ accountId }: { accountId: string }) {
  const [rows, setRows] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAdminCrew({ account_id: accountId });
    if (isOk(res)) setRows(res.rows);
    else setError(res.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApprove(applicantId: string) {
    const res = await hireWorker({ account_id: accountId, applicant_id: applicantId });
    if (isOk(res)) load();
    else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      <h2 className="mb-4">Crew applications</h2>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="space-y-2">
        {rows
          .filter((a) => String(a.roles_csv || "").includes("crew"))
          .map((a) => (
            <div key={a.account_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
              <div className="flex-1 min-w-[220px]">
                <div style={{ color: "var(--text-cream)" }}>
                  {a.first_name} — {a.crew_subtype}
                </div>
                <div style={{ color: "var(--text-faint)" }}>
                  {a.phone} · {a.status}
                </div>
              </div>
              {a.status !== "Approved" && (
                <button type="button" className="btn" onClick={() => handleApprove(a.account_id)}>
                  Approve
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
