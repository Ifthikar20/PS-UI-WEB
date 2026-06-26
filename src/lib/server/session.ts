import { cookies } from "next/headers";
import { env } from "./env";

/**
 * Auth session storage.
 *
 * The Django JWTs are kept in httpOnly cookies so client-side JS can never
 * read them (mitigates token theft via XSS). They are sent automatically on
 * same-site requests to our BFF route handlers, which forward them to Django
 * as `Authorization: Bearer`.
 */
export const ACCESS_COOKIE = "ps_access";
export const REFRESH_COOKIE = "ps_refresh";
export const CSRF_COOKIE = "ps_csrf";
export const CSRF_HEADER = "x-csrf-token";

const baseCookie = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: env.isProd,
  path: "/",
};

// Access token lifetime is 30 min on the backend; refresh is 30 days.
const ACCESS_MAX_AGE = 60 * 30;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;

export async function setSessionTokens(access: string, refresh?: string) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, access, { ...baseCookie, maxAge: ACCESS_MAX_AGE });
  if (refresh) {
    jar.set(REFRESH_COOKIE, refresh, {
      ...baseCookie,
      maxAge: REFRESH_MAX_AGE,
    });
  }
}

export async function setAccessToken(access: string) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, access, { ...baseCookie, maxAge: ACCESS_MAX_AGE });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value ?? null;
}

export async function isAuthenticated() {
  return Boolean(await getRefreshToken());
}
