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
 * POST /api/auth/signup
 * The backend's auth/email/ endpoint creates the account if the email is new,
 * so signup and login share the same Django endpoint (with `name` on signup).
 */
export async function POST(req: NextRequest) {
  if (!(await verifyCsrf())) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }
  let email: string, password: string, name: string | undefined;
  try {
    ({ email, password, name } = await req.json());
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
      body: { email, password, name },
    });
    await setSessionTokens(data.accessToken, data.refreshToken);
    return NextResponse.json({ user: data.user });
  } catch (e) {
    const err = e as DjangoError;
    return NextResponse.json(
      { error: err.message || "Sign up failed" },
      { status: err.status || 500 },
    );
  }
}
