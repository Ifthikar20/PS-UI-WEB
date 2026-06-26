import { NextRequest, NextResponse } from "next/server";
import { djangoRaw } from "@/lib/server/django";
import { verifyCsrf } from "@/lib/server/csrf";

/**
 * Authenticated BFF proxy: /api/proxy/<django-path> → /api/v1/<django-path>.
 *
 * The browser hits this with same-site httpOnly cookies; we attach the Bearer
 * token server-side and forward. Mutating methods must carry a valid CSRF
 * header. Streams the upstream body and status straight back.
 */
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

async function handle(req: NextRequest, path: string[]) {
  const method = req.method.toUpperCase();

  if (!SAFE_METHODS.has(method) && !(await verifyCsrf())) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const search = req.nextUrl.search;
  // Django routes are slash-terminated; preserve that before the query string.
  const joined = path.join("/");
  const target = `${joined}${joined.endsWith("/") ? "" : "/"}${search}`;

  const contentType = req.headers.get("content-type") ?? "";
  const headers: Record<string, string> = {};
  const idem = req.headers.get("idempotency-key");
  if (idem) headers["Idempotency-Key"] = idem;

  let raw: BodyInit | undefined;
  if (!SAFE_METHODS.has(method)) {
    if (contentType.includes("multipart/form-data")) {
      raw = await req.formData();
    } else {
      const text = await req.text();
      if (text) {
        raw = text;
        headers["Content-Type"] = contentType || "application/json";
      }
    }
  }

  const upstream = await djangoRaw(target, { method, raw, headers });

  const body = await upstream.arrayBuffer();
  const resHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) resHeaders.set("content-type", upstreamType);
  return new NextResponse(body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await ctx.params).path);
}
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await ctx.params).path);
}
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await ctx.params).path);
}
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await ctx.params).path);
}
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handle(req, (await ctx.params).path);
}
