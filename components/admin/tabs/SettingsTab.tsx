"use client";

import { getPricing, getAdminSettings, publishAll, isOk } from "@/lib/api";
import DraftableTable from "@/components/admin/DraftableTable";

const EXPECTED_PRICING_KEYS = [
  "base / Small/Canvas/Regular",
  "size_mod / Medium, size_mod / Large",
  "speed_mod / Patient, speed_mod / Regular, speed_mod / Express",
  "type_mod / Canvas, type_mod / Modular, type_mod / Construction",
  "self_delivery_discount / flat",
  "worker_pickup_discount / flat",
];

const EXPECTED_SETTINGS_KEYS = [
  "pricing_base_amount",
  "cancel_fee_tier_under_12hr",
  "cancel_fee_tier_over_12hr",
  "time_discrepancy_threshold_minutes",
  "followup_threshold_unpaid_cs_days / _manager_days",
  "followup_threshold_quote_cs_days / _manager_days",
  "followup_threshold_postjob_cs_days / _manager_days",
  "followup_threshold_crewapp_manager_days",
];

export default function SettingsTab({ accountId }: { accountId: string }) {
  async function handlePublishAll() {
    await publishAll({ account_id: accountId });
    window.location.reload();
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h2>Pricing & Settings</h2>
        <button type="button" className="btn" onClick={handlePublishAll}>
          Publish all drafts
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-[16px]" style={{ color: "var(--text-cream)" }}>
          Pricing formula (Base + Size + Speed + Type modifiers, plus discounts)
        </h3>
        <DraftableTable
          table="Pricing"
          accountId={accountId}
          rowKeyField="formula_component"
          displayColumns={[
            { key: "formula_component", label: "Component" },
            { key: "sukkah_type_or_tier", label: "Key" },
          ]}
          fetchRows={async () => {
            const res = await getPricing();
            return isOk(res) ? { ok: true, rows: res.rows } : { ok: false, error: res.error };
          }}
          helpText={`Editing updates existing rows only — this contract has no "create row" action for Pricing, so new keys must be added directly in the Pricing sheet first. Expected row keys: ${EXPECTED_PRICING_KEYS.join("; ")}.`}
        />
      </div>

      <div>
        <h3 className="mb-3 text-[16px]" style={{ color: "var(--text-cream)" }}>
          Admin thresholds & defaults
        </h3>
        <DraftableTable
          table="Settings"
          accountId={accountId}
          rowKeyField="key"
          displayColumns={[{ key: "key", label: "Key" }]}
          fetchRows={async () => {
            const res = await getAdminSettings({ account_id: accountId });
            return isOk(res) ? { ok: true, rows: res.rows } : { ok: false, error: res.error };
          }}
          helpText={`Same limitation as Pricing — new Settings keys must be added directly in the sheet. Expected keys: ${EXPECTED_SETTINGS_KEYS.join("; ")}.`}
        />
      </div>
    </div>
  );
}
