import { NextResponse } from "next/server";
import { django } from "@/lib/server/django";
import { clearSession, getRefreshToken } from "@/lib/server/session";
import { verifyCsrf } from "@/lib/server/csrf";

/** POST /api/auth/logout — blacklist the refresh token and clear cookies. */
export async function POST() {
  if (!(await verifyCsrf())) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  const refresh = await getRefreshToken();
  if (refresh) {
    try {
      await django("auth/signout/", {
        method: "POST",
        body: { refreshToken: refresh },
      });
    } catch {
      // Best-effort: clear the local session regardless of backend outcome.
    }
  }
  await clearSession();
  return NextResponse.json({ ok: true });
}
