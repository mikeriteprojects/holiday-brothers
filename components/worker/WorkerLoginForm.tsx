"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { identify, loginPassword, verifyCode, isOk, setSession } from "@/lib/api";

type Stage = "identify" | "password" | "code";

export default function WorkerLoginForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("identify");
  const [identifier, setIdentifier] = useState("");
  const [accountId, setAccountId] = useState("");
  const [password, setPasswordValue] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await identify(identifier);
    setSubmitting(false);
    if (!isOk(res)) return setError(res.error);
    setAccountId(res.account_id);
    setStage(res.method === "password" ? "password" : "code");
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await loginPassword({ account_id: accountId, password });
    setSubmitting(false);
    if (!isOk(res)) return setError(res.error);
    setSession(res.account_id, res.token);
    router.push("/worker-portal");
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await verifyCode({ account_id: accountId, code });
    setSubmitting(false);
    if (!isOk(res)) return setError(res.error);
    setSession(res.account_id, res.token);
    router.push("/worker-portal");
  }

  return (
    <motion.div className="glass p-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {stage === "identify" && (
        <form onSubmit={handleIdentify}>
          <h2 className="mb-4">Sign in</h2>
          <input
            className="input"
            placeholder="Username, email, phone, or account ID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          {error && (
            <p className="mt-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn primary mt-4" disabled={submitting || !identifier.trim()}>
            {submitting ? "Checking…" : "Continue"}
          </button>
        </form>
      )}

      {stage === "password" && (
        <form onSubmit={handlePassword}>
          <h2 className="mb-4">Enter your password</h2>
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPasswordValue(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="mt-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn primary mt-4" disabled={submitting || !password}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}

      {stage === "code" && (
        <form onSubmit={handleCode}>
          <h2 className="mb-4">Enter your code</h2>
          <p className="mb-4 text-[14px]" style={{ color: "var(--text-muted)" }}>
            We sent a one-time code to your email.
          </p>
          <input
            className="input"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="mt-3 text-[13.5px]" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}
          <button type="submit" className="btn primary mt-4" disabled={submitting || !code}>
            {submitting ? "Verifying…" : "Verify"}
          </button>
        </form>
      )}
    </motion.div>
  );
}
