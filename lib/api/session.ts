/**
 * Thin localStorage wrapper for the session token + account_id issued by
 * workerVerifyCode/workerLoginPassword/adminLogin. Most POST/admin GET
 * actions require account_id as a plain param (see actions.ts `Actor`) —
 * the backend has no bearer-token middleware, it just checks account_id's
 * permissions directly, so the token itself is mainly a client-side
 * "am I logged in" flag rather than something sent per-request.
 */

const ACCOUNT_ID_KEY = "hb_account_id";
const TOKEN_KEY = "hb_session_token";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getStoredAccountId(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCOUNT_ID_KEY);
}

export function getStoredToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setSession(accountId: string, token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCOUNT_ID_KEY, accountId);
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearSession(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCOUNT_ID_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}
