/**
 * Core fetch client for the Holiday Brothers Apps Script Web App.
 *
 * The backend (HolidayBrothersBackend.gs) uses a single action-dispatch
 * endpoint: GET requests carry `action` as a query param (routed through
 * GET_ACTIONS), POST requests carry `action` inside a JSON body (routed
 * through POST_ACTIONS). Every response is `{ ok: true, ...fields }` or
 * `{ ok: false, error: string }` — see jsonOut_/ok_/fail_ in the .gs file.
 *
 * POST bodies are sent as `text/plain` rather than `application/json` on
 * purpose: Apps Script Web Apps don't implement doOptions, so an
 * application/json POST triggers a CORS preflight that fails outright.
 * text/plain is a "simple request" (no preflight), and doPost() still
 * parses e.postData.contents as JSON regardless of the declared type.
 */

const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz9Wt6yb4jIgise-1FQk3z8VuW228fK6vo9cHds7dWg7gTcgOqj2LocHrD8pqbkgxqh/exec";

export const APPS_SCRIPT_URL =
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || DEFAULT_APPS_SCRIPT_URL;

export type ApiSuccess<T> = { ok: true } & T;
export type ApiFailure = { ok: false; error: string };
export type ApiResult<T = Record<string, never>> = ApiSuccess<T> | ApiFailure;

export function isOk<T>(res: ApiResult<T>): res is ApiSuccess<T> {
  return res.ok === true;
}

export type QueryParams = object;
export type PostBody = object;

function toQueryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.set(key, String(value));
  });
  return search.toString();
}

function networkFailure(err: unknown): ApiFailure {
  return { ok: false, error: err instanceof Error ? err.message : "Network error" };
}

export async function apiGet<T = Record<string, never>>(
  action: string,
  params: QueryParams = {}
): Promise<ApiResult<T>> {
  const qs = toQueryString({ ...params, action });
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?${qs}`, { method: "GET" });
    return (await res.json()) as ApiResult<T>;
  } catch (err) {
    return networkFailure(err);
  }
}

export async function apiPost<T = Record<string, never>>(
  action: string,
  body: PostBody = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...body, action }),
    });
    return (await res.json()) as ApiResult<T>;
  } catch (err) {
    return networkFailure(err);
  }
}
