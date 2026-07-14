"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { adminLogin, isOk, setSession } from "@/lib/api";

export default function AdminLoginForm({ onLoggedIn }: { onLoggedIn: (accountId: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await adminLogin({ username, password });
    setSubmitting(false);
    if (!isOk(res)) return setError(res.error);
    setSession(res.account_id, res.token);
    onLoggedIn(res.account_id);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="glass mx-auto max-w-sm p-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="mb-4">Staff sign in</h2>
      <div className="space-y-3">
        <input className="input" placeholder="Username or email" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p className="mt-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <button type="submit" className="btn primary mt-4" disabled={submitting || !username || !password}>
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </motion.form>
  );
}
