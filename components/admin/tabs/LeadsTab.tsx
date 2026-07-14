"use client";

import { useEffect, useState } from "react";
import { getAdminLeads, updateBookingStatus, deleteLead, isOk, type Booking } from "@/lib/api";

const STATUSES = [
  "Submitted Booking",
  "Price Pending",
  "Quote Sent",
  "Job Confirmed",
  "Scheduled",
  "In Progress",
  "Paid",
  "Pending Completion",
  "Completed",
  "Cancelled",
  "Weather Hold",
];

export default function LeadsTab({ accountId }: { accountId: string }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAdminLeads({ account_id: accountId });
    if (isOk(res)) setRows(res.rows);
    else setError(res.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatus(bookingCode: string, status: string) {
    const res = await updateBookingStatus({ account_id: accountId, table: "Bookings", key_value: bookingCode, status });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleDelete(bookingCode: string) {
    const res = await deleteLead({ account_id: accountId, booking_code: bookingCode });
    if (isOk(res)) load();
    else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      <h2 className="mb-4">Leads</h2>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="space-y-2">
        {rows.map((b) => (
          <div key={b.booking_code} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
            <div className="flex-1 min-w-[220px]">
              <div style={{ color: "var(--text-cream)" }}>
                {b.booking_code} — {b.size} {b.sukkah_type} ({b.speed_tier})
              </div>
              <div style={{ color: "var(--text-faint)" }}>
                {b.address} · ${b.price_total}
              </div>
            </div>
            <select
              className="input w-44"
              value={b.status}
              onChange={(e) => handleStatus(b.booking_code, e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button type="button" className="btn" onClick={() => handleDelete(b.booking_code)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
