"use client";

import { useEffect, useState } from "react";
import { saveDraft, publishDraft, isOk, type DraftableTable as DraftableTableName } from "@/lib/api";

interface Column {
  key: string;
  label: string;
}

interface Props {
  table: DraftableTableName;
  accountId: string;
  rowKeyField: string;
  displayColumns: Column[];
  valueField?: string;
  fetchRows: () => Promise<{ ok: boolean; rows?: Record<string, unknown>[]; error?: string }>;
  helpText?: string;
}

export default function DraftableTable({
  table,
  accountId,
  rowKeyField,
  displayColumns,
  valueField = "value",
  fetchRows,
  helpText,
}: Props) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetchRows();
    if (res.ok && res.rows) setRows(res.rows);
    else setError(res.error || "Failed to load");
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(rowKey: string) {
    const newValue = drafts[rowKey];
    if (newValue === undefined) return;
    setBusyKey(rowKey);
    const res = await saveDraft({ account_id: accountId, table, row_key: rowKey, new_value: newValue });
    setBusyKey(null);
    if (!isOk(res)) return setError(res.error);
    load();
  }

  async function handlePublish(rowKey: string) {
    setBusyKey(rowKey);
    const res = await publishDraft({ account_id: accountId, table, row_key: rowKey });
    setBusyKey(null);
    if (!isOk(res)) return setError(res.error);
    load();
  }

  if (loading) return <p style={{ color: "var(--text-faint)" }}>Loading…</p>;

  return (
    <div>
      {helpText && (
        <p className="mb-4 text-[13px]" style={{ color: "var(--text-faint)" }}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="mb-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      {rows.length === 0 && <p style={{ color: "var(--text-faint)" }}>No rows in this sheet yet.</p>}
      <div className="space-y-2">
        {rows.map((row) => {
          const rowKey = String(row[rowKeyField]);
          const hasDraft = String(row.has_pending_draft).toUpperCase() === "TRUE";
          return (
            <div key={rowKey} className="glass flex flex-wrap items-center gap-3 p-3">
              <div className="flex-1 min-w-[160px] text-[13.5px]">
                {displayColumns.map((c) => (
                  <span key={c.key} className="mr-3" style={{ color: "var(--text-muted)" }}>
                    {String(row[c.key] ?? "")}
                  </span>
                ))}
                <span style={{ color: "var(--text-cream)" }}>current: {String(row[valueField] ?? "")}</span>
                {hasDraft && (
                  <span className="ml-2" style={{ color: "var(--amber-bright)" }}>
                    draft: {String(row.draft_value)}
                  </span>
                )}
              </div>
              <input
                className="input w-32"
                placeholder="New value"
                value={drafts[rowKey] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [rowKey]: e.target.value }))}
              />
              <button
                type="button"
                className="btn"
                disabled={busyKey === rowKey || !drafts[rowKey]}
                onClick={() => handleSave(rowKey)}
              >
                Save draft
              </button>
              <button
                type="button"
                className="btn"
                disabled={busyKey === rowKey || !hasDraft}
                onClick={() => handlePublish(rowKey)}
                style={hasDraft ? { borderColor: "var(--amber-bright)" } : undefined}
              >
                Publish
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
