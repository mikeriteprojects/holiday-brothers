"use client";

import { useEffect, useState } from "react";
import { getStoredAccountId } from "@/lib/api";
import AdminLoginForm from "./AdminLoginForm";
import AdminDashboard from "./AdminDashboard";

export default function AdminGate() {
  const [accountId, setAccountId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setAccountId(getStoredAccountId());
  }, []);

  if (accountId === undefined) return null;
  if (!accountId) return <AdminLoginForm onLoggedIn={setAccountId} />;
  return <AdminDashboard accountId={accountId} />;
}
