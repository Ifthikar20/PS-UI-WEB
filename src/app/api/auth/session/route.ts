import { NextResponse } from "next/server";
import { django, DjangoError } from "@/lib/server/django";
import { isAuthenticated } from "@/lib/server/session";
import type { Me } from "@/lib/types";

/** GET /api/auth/session — current user, rewards, and subscription. */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  try {
    const me = await django<Me>("me/");
    return NextResponse.json(me);
  } catch (e) {
    const err = e as DjangoError;
    if (err.status === 401) {
      return NextResponse.json({ user: null }, { status: 200 });
    }
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
}
