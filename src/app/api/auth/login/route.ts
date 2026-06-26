import { NextRequest, NextResponse } from "next/server";
import { django, DjangoError } from "@/lib/server/django";
import { setSessionTokens } from "@/lib/server/session";
import { verifyCsrf } from "@/lib/server/csrf";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
};

/** POST /api/auth/login — exchange email+password for an httpOnly session. */
export async function POST(req: NextRequest) {
  if (!(await verifyCsrf())) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }
  try {
    const data = await django<AuthResponse>("auth/email/", {
      method: "POST",
      noAuth: true,
      body: { email, password },
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
