"use client";

import { useEffect, useState } from "react";
import {
  getAdminRoles,
  getAdminPermissionFlags,
  createCustomRole,
  toggleRolePermission,
  assignStaffRole,
  isOk,
  type RoleRow,
  type PermissionFlagRow,
} from "@/lib/api";

export default function RolesTab({ accountId }: { accountId: string }) {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [flags, setFlags] = useState<PermissionFlagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [targetAccount, setTargetAccount] = useState("");
  const [targetRole, setTargetRole] = useState("");

  async function load() {
    setLoading(true);
    const [r, f] = await Promise.all([
      getAdminRoles({ account_id: accountId }),
      getAdminPermissionFlags({ account_id: accountId }),
    ]);
    if (isOk(r)) setRoles(r.rows);
    if (isOk(f)) setFlags(f.rows);
    if (!isOk(r)) setError(r.error);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreateRole() {
    if (!newRoleName) return;
    const res = await createCustomRole({ account_id: accountId, role_name: newRoleName });
    if (isOk(res)) {
      setNewRoleName("");
      load();
    } else setError(res.error);
  }

  async function handleToggle(roleId: string, flagId: string, current: boolean) {
    const res = await toggleRolePermission({ account_id: accountId, role_id: roleId, flag_id: flagId, enabled: !current });
    if (isOk(res)) load();
    else setError(res.error);
  }

  async function handleAssign() {
    if (!targetAccount || !targetRole) return;
    const res = await assignStaffRole({ account_id: accountId, target_account_id: targetAccount, role_id: targetRole });
    if (isOk(res)) {
      setTargetAccount("");
      setTargetRole("");
    } else setError(res.error);
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div className="space-y-8">
      {error && (
        <p className="text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}

      <div>
        <h2 className="mb-4">Assign a staff role</h2>
        <div className="flex flex-wrap gap-2">
          <input
            className="input w-56"
            placeholder="Target account ID"
            value={targetAccount}
            onChange={(e) => setTargetAccount(e.target.value)}
          />
          <select className="input w-56" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
            <option value="">Choose a role</option>
            {roles.map((r) => (
              <option key={r.role_id} value={r.role_id}>
                {r.role_name || r.role_id}
              </option>
            ))}
          </select>
          <button type="button" className="btn" onClick={handleAssign}>
            Assign
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-4">Custom roles</h2>
        <div className="mb-4 flex gap-2">
          <input
            className="input w-56"
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          <button type="button" className="btn" onClick={handleCreateRole}>
            Create role (from CS preset)
          </button>
        </div>
        <div className="space-y-4">
          {roles.map((role) => {
            let perms: Record<string, boolean> = {};
            try {
              perms = JSON.parse(role.permissions_json || "{}");
            } catch {
              perms = {};
            }
            return (
              <div key={role.role_id} className="glass p-4">
                <div className="mb-3" style={{ color: "var(--text-cream)" }}>
                  {role.role_name || role.role_id}
                </div>
                <div className="flex flex-wrap gap-2">
                  {flags.map((f) => {
                    const enabled = !!perms[f.flag_id];
                    return (
                      <button
                        key={f.flag_id}
                        type="button"
                        className={`option-btn ${enabled ? "selected" : ""}`}
                        style={{ padding: "6px 10px" }}
                        onClick={() => handleToggle(role.role_id, f.flag_id, enabled)}
                      >
                        {f.flag_id}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
