import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { django } from "@/lib/server/django";
import { setSessionTokens } from "@/lib/server/session";
import { FLAVOR_COOKIE, isFlavor, DEFAULT_FLAVOR } from "@/lib/flavor";

type AuthResponse = { accessToken: string; refreshToken: string };

/**
 * GET /api/auth/dev-login — development convenience.
 *
 * When DEV_AUTOLOGIN=1 (set by dev.sh), middleware sends unauthenticated users
 * here instead of /login. We sign in as the demo account and bounce to the
 * requested page, so you never have to log in by hand while developing.
 * Disabled in production.
 */
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") || "/dashboard";

  if (process.env.NODE_ENV === "production" || process.env.DEV_AUTOLOGIN !== "1") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const email = process.env.DEV_AUTOLOGIN_EMAIL || "demo@playstudy.app";
  const password = process.env.DEV_AUTOLOGIN_PASSWORD || "Playstudy123!";

  try {
    const data = await django<AuthResponse>("auth/email/", {
      method: "POST",
      noAuth: true,
      body: { email, password },
    });
    await setSessionTokens(data.accessToken, data.refreshToken);

    // Skip onboarding in dev: ensure a flavor is set.
    const jar = await cookies();
    if (!isFlavor(jar.get(FLAVOR_COOKIE)?.value)) {
      jar.set(FLAVOR_COOKIE, DEFAULT_FLAVOR, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    }
    return NextResponse.redirect(new URL(next, req.url));
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
