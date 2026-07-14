"use client";

import { useState } from "react";
import { getAdminTestimonials, createTestimonial, isOk } from "@/lib/api";
import DraftableTable from "@/components/admin/DraftableTable";

export default function TestimonialsTab({ accountId }: { accountId: string }) {
  const [customerName, setCustomerName] = useState("");
  const [quote, setQuote] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleCreate() {
    if (!customerName || !quote) return;
    const res = await createTestimonial({ account_id: accountId, customer_name: customerName, quote });
    if (isOk(res)) {
      setCustomerName("");
      setQuote("");
      setRefreshKey((k) => k + 1);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Testimonials</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className="input w-48"
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input className="input flex-1 min-w-[220px]" placeholder="Quote" value={quote} onChange={(e) => setQuote(e.target.value)} />
        <button type="button" className="btn" onClick={handleCreate}>
          Add
        </button>
      </div>
      <DraftableTable
        key={refreshKey}
        table="Testimonials"
        accountId={accountId}
        rowKeyField="testimonial_id"
        displayColumns={[
          { key: "customer_name", label: "Customer" },
          { key: "quote", label: "Quote" },
        ]}
        fetchRows={async () => {
          const res = await getAdminTestimonials({ account_id: accountId });
          return isOk(res) ? { ok: true, rows: res.rows } : { ok: false, error: res.error };
        }}
        helpText="Job-level reviews rated 4★+ are flagged as testimonial candidates but never auto-published — publish here once reviewed."
      />
    </div>
  );
}
