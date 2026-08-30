import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_LOGIN_PATH = "/admin";
const ADMIN_PANEL_PREFIX = "/admin/";
const API_ADMIN_PREFIX = "/api/admin/";

const secret =
  process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

function isProtectedAdminPath(pathname: string): boolean {
  if (pathname.startsWith(ADMIN_PANEL_PREFIX)) return true;
  if (pathname.startsWith(API_ADMIN_PREFIX)) return true;
  return false;
}

function isAdminLoginPage(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_PATH || pathname === "/admin/";
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const normalizedPathname = pathname.endsWith("/") && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;

  const resolvesToAdmin =
    isProtectedAdminPath(normalizedPathname) ||
    (normalizedPathname.startsWith("/_next/data/") &&
      (normalizedPathname.includes("/admin/") ||
        normalizedPathname.includes("/api/admin/")));

  if (!resolvesToAdmin) {
    return NextResponse.next();
  }

  if (isAdminLoginPage(normalizedPathname)) {
    return NextResponse.next();
  }

  if (normalizedPathname.startsWith("/admin/mot-de-passe-oublie")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });

  if (!token || token.role !== "ADMIN") {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    const isRscRequest =
      request.nextUrl.searchParams.has("_rsc") ||
      request.headers.get("accept")?.includes("text/x-component") ||
      normalizedPathname.endsWith(".rsc");
    const isApiRequest = normalizedPathname.startsWith("/api/admin/") ||
      (normalizedPathname.startsWith("/_next/data/") &&
        normalizedPathname.includes("/api/admin/"));

    if (isApiRequest || isRscRequest) {
      return NextResponse.json(
        { error: "Non autorisé", redirect: ADMIN_LOGIN_PATH },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/_next/data/:path*/admin/:path*",
    "/_next/data/:path*/api/admin/:path*",
  ],
};
