import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  CSRF_COOKIE,
} from "@/lib/server/session";

/** Paths that require an authenticated session. */
const PROTECTED = [
  "/dashboard",
  "/onboarding",
  "/library",
  "/study",
  "/games",
  "/exam",
  "/activity",
  "/supervise",
  "/rewards",
  "/profile",
  "/settings",
];

/** Auth pages an already-signed-in user should be bounced away from. */
const AUTH_PAGES = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(
    req.cookies.get(REFRESH_COOKIE) ?? req.cookies.get(ACCESS_COOKIE),
  );

  // Gate protected app routes.
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !hasSession) {
    const url = req.nextUrl.clone();
    // Dev convenience: auto-login as the demo user instead of showing /login.
    if (process.env.DEV_AUTOLOGIN === "1") {
      url.pathname = "/api/auth/dev-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Keep signed-in users out of the auth pages.
  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Ensure a CSRF token cookie exists (readable by our client JS).
  const res = NextResponse.next();
  if (!req.cookies.get(CSRF_COOKIE)) {
    const token =
      crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
    res.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return res;
}

export const config = {
  // Run on everything except static assets and Next internals.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
