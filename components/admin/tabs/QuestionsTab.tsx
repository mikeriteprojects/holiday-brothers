"use client";

import { useState } from "react";
import { getAdminQuestions, createQuestion, isOk } from "@/lib/api";
import DraftableTable from "@/components/admin/DraftableTable";

export default function QuestionsTab({ accountId }: { accountId: string }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleCreate() {
    if (!label) return;
    const res = await createQuestion({ account_id: accountId, label, type });
    if (isOk(res)) {
      setLabel("");
      setRefreshKey((k) => k + 1);
    }
  }

  return (
    <div>
      <h2 className="mb-4">Supplementary questions</h2>
      <p className="mb-4 text-[13px]" style={{ color: "var(--text-faint)" }}>
        The core booking questions (size/type/speed) are fixed to keep pricing consistent — these are
        extra questions surfaced elsewhere (e.g. crew application follow-ups).
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input w-56" placeholder="Question label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <select className="input w-32" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="text">text</option>
          <option value="choice">choice</option>
          <option value="boolean">boolean</option>
        </select>
        <button type="button" className="btn" onClick={handleCreate}>
          Add question
        </button>
      </div>
      <DraftableTable
        key={refreshKey}
        table="Questions"
        accountId={accountId}
        rowKeyField="question_id"
        displayColumns={[
          { key: "label", label: "Label" },
          { key: "type", label: "Type" },
        ]}
        fetchRows={async () => {
          const res = await getAdminQuestions({ account_id: accountId });
          return isOk(res) ? { ok: true, rows: res.rows } : { ok: false, error: res.error };
        }}
      />
    </div>
  );
}
