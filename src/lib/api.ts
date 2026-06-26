"use client";

/**
 * Browser-side API client.
 *
 * Talks only to our same-origin BFF (`/api/proxy/...` and `/api/auth/...`).
 * Auth is carried by httpOnly cookies the browser sends automatically; for
 * mutating requests we echo the CSRF cookie back in the `x-csrf-token` header
 * (double-submit). JWTs are never visible to this code.
 */

const CSRF_COOKIE = "ps_csrf";

function csrfToken(): string {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CSRF_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : "";
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  opts: {
    method?: string;
    body?: unknown;
    form?: FormData;
    headers?: Record<string, string>;
  } = {},
): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  const isWrite = !["GET", "HEAD", "OPTIONS"].includes(method);
  if (isWrite) headers["x-csrf-token"] = csrfToken();

  let body: BodyInit | undefined;
  if (opts.form) {
    body = opts.form;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(path, {
    method,
    headers,
    body,
    credentials: "same-origin",
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const message =
      (data as any)?.error ??
      (data as any)?.detail ??
      res.statusText ??
      "Request failed";
    throw new ApiError(res.status, message);
  }
  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Authenticated data calls against the Django API via the BFF proxy. */
export const api = {
  get: <T>(djangoPath: string) => request<T>(`/api/proxy/${djangoPath}`),
  post: <T>(djangoPath: string, body?: unknown) =>
    request<T>(`/api/proxy/${djangoPath}`, { method: "POST", body }),
  patch: <T>(djangoPath: string, body?: unknown) =>
    request<T>(`/api/proxy/${djangoPath}`, { method: "PATCH", body }),
  del: <T>(djangoPath: string) =>
    request<T>(`/api/proxy/${djangoPath}`, { method: "DELETE" }),
  upload: <T>(djangoPath: string, form: FormData) =>
    request<T>(`/api/proxy/${djangoPath}`, { method: "POST", form }),
};

/** Auth endpoints (these set/clear the httpOnly session cookies). */
export const auth = {
  login: (email: string, password: string) =>
    request<{ user: unknown }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  signup: (email: string, password: string, name?: string) =>
    request<{ user: unknown }>("/api/auth/signup", {
      method: "POST",
      body: { email, password, name },
    }),
  provider: (provider: "google" | "apple", idToken: string) =>
    request<{ user: unknown }>("/api/auth/provider", {
      method: "POST",
      body: { provider, idToken },
    }),
  logout: () => request<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
  session: () => request<any>("/api/auth/session"),
};
