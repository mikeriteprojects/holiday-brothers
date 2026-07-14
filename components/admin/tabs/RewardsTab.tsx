"use client";

import { useEffect, useState } from "react";
import {
  getAdminRewards,
  getAdminRedemptions,
  createReward,
  updateReward,
  fulfillRedemption,
  isOk,
  type RewardRow,
  type RedemptionRow,
} from "@/lib/api";

export default function RewardsTab({ accountId }: { accountId: string }) {
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newShopCost, setNewShopCost] = useState("");

  async function load() {
    setLoading(true);
    const [r, rd] = await Promise.all([getAdminRewards(), getAdminRedemptions({ account_id: accountId })]);
    if (isOk(r)) setRewards(r.rows);
    if (isOk(rd)) setRedemptions(rd.rows);
    if (!isOk(r)) setError(r.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    if (!newLabel) return;
    const res = await createReward({
      account_id: accountId,
      label: newLabel,
      cost_shop_points: Number(newShopCost) || 0,
    });
    if (isOk(res)) {
      setNewLabel("");
      setNewShopCost("");
      load();
    } else setError(res.error);
  }

  async function handleToggleActive(reward: RewardRow) {
    const active = String(reward.active).toUpperCase() === "TRUE";
    const res = await updateReward({ account_id: accountId, reward_id: reward.reward_id, field: "active", value: active ? "FALSE" : "TRUE" });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleFulfill(redemptionId: string) {
    const res = await fulfillRedemption({ account_id: accountId, redemption_id: redemptionId });
    if (isOk(res)) load();
    else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4">Rewards catalog</h2>
        {error && (
          <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-2">
          <input className="input w-56" placeholder="New reward label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <input
            className="input w-32"
            placeholder="Shop point cost"
            value={newShopCost}
            onChange={(e) => setNewShopCost(e.target.value)}
          />
          <button type="button" className="btn" onClick={handleCreate}>
            Add reward
          </button>
        </div>
        <div className="space-y-2">
          {rewards.map((r) => (
            <div key={r.reward_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
              <div className="flex-1 min-w-[200px]" style={{ color: "var(--text-cream)" }}>
                {r.label}
              </div>
              <span style={{ color: "var(--text-faint)" }}>{r.cost_shop_points} Shop</span>
              <button type="button" className="btn" onClick={() => handleToggleActive(r)}>
                {String(r.active).toUpperCase() === "TRUE" ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4">Pending redemptions</h2>
        <div className="space-y-2">
          {redemptions
            .filter((r) => r.status === "Pending")
            .map((r) => (
              <div key={r.redemption_id} className="glass flex flex-wrap items-center gap-3 p-3 text-[13.5px]">
                <div className="flex-1" style={{ color: "var(--text-cream)" }}>
                  {r.account_id} — {r.currency_used} {r.cost_paid}
                </div>
                <button type="button" className="btn" onClick={() => handleFulfill(r.redemption_id)}>
                  Fulfill
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
