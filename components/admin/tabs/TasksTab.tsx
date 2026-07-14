"use client";

import { useEffect, useState } from "react";
import { getTasks, takeoverTask, resolveTask, isOk, type TaskRow } from "@/lib/api";

const TIERS: TaskRow["current_tier"][] = ["CS", "Manager", "Admin"];

export default function TasksTab({ accountId }: { accountId: string }) {
  const [tier, setTier] = useState<TaskRow["current_tier"]>("Manager");
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getTasks({ account_id: accountId, tier });
    if (isOk(res)) setRows(res.rows);
    else setError(res.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  async function handleTakeover(taskId: string, newTier: string) {
    const res = await takeoverTask({ account_id: accountId, task_id: taskId, new_tier: newTier });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleResolve(taskId: string) {
    const res = await resolveTask({ task_id: taskId });
    if (isOk(res)) load();
    else setError(res.error);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2>Follow-ups</h2>
        <div className="flex gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              className={`btn ${tier === t ? "" : ""}`}
              style={tier === t ? { borderColor: "var(--amber-bright)" } : undefined}
              onClick={() => setTier(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      {loading ? (
        <p style={{ color: "var(--text-faint)" }}>Loading…</p>
      ) : (
        <div className="space-y-2">
          {rows.length === 0 && <p style={{ color: "var(--text-faint)" }}>Nothing open at this tier.</p>}
          {rows.map((t) => (
            <div key={t.task_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
              <div className="flex-1 min-w-[220px]">
                <div style={{ color: "var(--text-cream)" }}>
                  {t.category} — {t.related_id}
                </div>
                <div style={{ color: "var(--text-faint)" }}>{t.current_tier}</div>
              </div>
              <button type="button" className="btn" onClick={() => handleTakeover(t.task_id, "Admin")}>
                Take over
              </button>
              <button type="button" className="btn" onClick={() => handleResolve(t.task_id)}>
                Resolve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
