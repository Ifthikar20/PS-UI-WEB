import { cookies, headers } from "next/headers";
import { CSRF_COOKIE, CSRF_HEADER } from "./session";

/**
 * Double-submit-cookie CSRF protection.
 *
 * Middleware issues an unpredictable token in a NON-httpOnly cookie so our own
 * client JS can read it and echo it back in the `x-csrf-token` header on every
 * mutating request. A cross-site attacker can neither read the cookie value nor
 * set the custom header, so forged requests fail the equality check. The auth
 * cookies themselves are SameSite=Lax, which is a second line of defense.
 */
export function generateCsrfToken(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
}

/** Returns true when the request carries a header token matching the cookie. */
export async function verifyCsrf(): Promise<boolean> {
  const cookieToken = (await cookies()).get(CSRF_COOKIE)?.value;
  const headerToken = (await headers()).get(CSRF_HEADER);
  if (!cookieToken || !headerToken) return false;
  // Constant-time-ish comparison.
  if (cookieToken.length !== headerToken.length) return false;
  let mismatch = 0;
  for (let i = 0; i < cookieToken.length; i++) {
    mismatch |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
  }
  return mismatch === 0;
}
