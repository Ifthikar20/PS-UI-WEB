import { djangoApiBase } from "./env";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearSession,
} from "./session";

export class DjangoError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  /** When true, no Authorization header is attached (login/refresh). */
  noAuth?: boolean;
  /** Raw body passthrough (e.g. multipart uploads) — skips JSON encoding. */
  raw?: BodyInit;
  headers?: Record<string, string>;
};

async function rawFetch(path: string, token: string | null, opts: FetchOpts) {
  const headers: Record<string, string> = { ...(opts.headers ?? {}) };
  if (token && !opts.noAuth) headers["Authorization"] = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.raw !== undefined) {
    body = opts.raw;
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  return fetch(`${djangoApiBase}/${path.replace(/^\//, "")}`, {
    method: opts.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });
}

/** Attempt to refresh the access token. Returns the new token or null. */
async function tryRefresh(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;
  const res = await rawFetch("auth/refresh/", null, {
    method: "POST",
    noAuth: true,
    body: { refreshToken: refresh },
  });
  if (!res.ok) {
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      // May run during a Server Component render, where cookies can't be
      // written — ignore and let the caller treat the session as expired.
      await clearSession().catch(() => {});
    }
    return null;
  }
  const data = await res.json();
  const access = data.accessToken as string;
  // Persist the new access cookie when allowed. This call THROWS when invoked
  // during a Server Component render (Next only permits cookie writes in Route
  // Handlers / Server Actions), so swallow it: the fresh token is still
  // returned and used for the current request, and a later route-handler call
  // (e.g. the proxy) re-persists it. Without this guard an expired access token
  // would crash the app shell into the "can't reach server" screen.
  try {
    await setAccessToken(access);
  } catch {
    /* cookie write not allowed in this context; token still used below */
  }
  return access;
}

/**
 * Server-side authenticated call to Django. Mirrors the mobile ApiClient:
 * attaches the Bearer token, and on a 401 transparently refreshes once and
 * retries. Throws DjangoError on non-2xx.
 */
export async function django<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  let token = await getAccessToken();
  // If we have a refresh token but the access cookie expired, refresh first.
  if (!token && !opts.noAuth) token = await tryRefresh();

  let res = await rawFetch(path, token, opts);

  if (res.status === 401 && !opts.noAuth) {
    const fresh = await tryRefresh();
    if (fresh) res = await rawFetch(path, fresh, opts);
  }

  return parse<T>(res);
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const err = (data as any)?.error;
    throw new DjangoError(
      res.status,
      err?.message ?? (data as any)?.detail ?? res.statusText,
      err?.code ?? (data as any)?.code,
    );
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

/** Returns the raw Response (used by the generic proxy + uploads). */
export async function djangoRaw(
  path: string,
  opts: FetchOpts = {},
): Promise<Response> {
  let token = await getAccessToken();
  if (!token && !opts.noAuth) token = await tryRefresh();
  let res = await rawFetch(path, token, opts);
  if (res.status === 401 && !opts.noAuth) {
    const fresh = await tryRefresh();
    if (fresh) res = await rawFetch(path, fresh, opts);
  }
  return res;
}
