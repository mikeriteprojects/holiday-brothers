"use client";

import { useEffect, useState } from "react";
import { getAdminVendors, approveVendor, decideVendorTier, isOk, type Vendor } from "@/lib/api";

export default function VendorsTab({ accountId }: { accountId: string }) {
  const [rows, setRows] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await getAdminVendors();
    if (isOk(res)) setRows(res.rows);
    else setError(res.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApprove(vendorId: string) {
    const res = await approveVendor({ account_id: accountId, vendor_id: vendorId });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleTier(vendorId: string, tier: string) {
    const res = await decideVendorTier({ account_id: accountId, vendor_id: vendorId, tier });
    if (isOk(res)) load();
    else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      <h2 className="mb-4">Vendors</h2>
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <div className="space-y-2">
        {rows.map((v) => (
          <div key={v.vendor_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
            <div className="flex-1 min-w-[220px]">
              <div style={{ color: "var(--text-cream)" }}>
                {v.category} — {v.tier} ({v.status})
              </div>
              <div style={{ color: "var(--text-faint)" }}>
                {v.service_area} · {v.vendor_points} pts
              </div>
            </div>
            {v.status !== "Approved" && (
              <button type="button" className="btn" onClick={() => handleApprove(v.vendor_id)}>
                Approve
              </button>
            )}
            <select
              className="input w-32"
              value={String(v.tier ?? "")}
              onChange={(e) => handleTier(v.vendor_id, e.target.value)}
            >
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
              <option value="Tier 3">Tier 3</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
