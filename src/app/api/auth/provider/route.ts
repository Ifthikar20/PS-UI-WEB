import { NextRequest, NextResponse } from "next/server";
import { django, DjangoError } from "@/lib/server/django";
import { setSessionTokens } from "@/lib/server/session";
import { verifyCsrf } from "@/lib/server/csrf";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
};

/**
 * POST /api/auth/provider — social sign-in (Google / Apple).
 * The client obtains a signed ID token from the provider and posts it here;
 * we forward to Django's auth/provider/ and set the httpOnly session.
 */
export async function POST(req: NextRequest) {
  if (!(await verifyCsrf())) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  let provider: string, idToken: string;
  try {
    ({ provider, idToken } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!provider || !idToken) {
    return NextResponse.json(
      { error: "provider and idToken are required" },
      { status: 400 },
    );
  }
  try {
    const data = await django<AuthResponse>("auth/provider/", {
      method: "POST",
      noAuth: true,
      body: { provider, idToken },
    });
    await setSessionTokens(data.accessToken, data.refreshToken);
    return NextResponse.json({ user: data.user });
  } catch (e) {
    const err = e as DjangoError;
    return NextResponse.json(
      { error: err.message || "Sign in failed" },
      { status: err.status || 500 },
    );
  }
}
