"use client";

import { getAdminContentAll, isOk } from "@/lib/api";
import DraftableTable from "@/components/admin/DraftableTable";

export default function ContentTab({ accountId }: { accountId: string }) {
  return (
    <div>
      <h2 className="mb-4">Site content</h2>
      <DraftableTable
        table="Content"
        accountId={accountId}
        rowKeyField="block_id"
        displayColumns={[{ key: "block_id", label: "Block" }]}
        fetchRows={async () => {
          const res = await getAdminContentAll({ account_id: accountId });
          return isOk(res) ? { ok: true, rows: res.rows } : { ok: false, error: res.error };
        }}
        helpText="Editable text blocks used across the site. New blocks must be added directly in the Content sheet — this contract has no create action for it."
      />
    </div>
  );
}
