import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public admin login page
  if (pathname === "/admin/login") return NextResponse.next();

  // Protect admin UI and admin APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = await getToken({ req, secret: NEXTAUTH_SECRET });
    const role = (token as any)?.role as string | undefined;

    if (!token || role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return new NextResponse(JSON.stringify({ error: "UNAUTHORIZED" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
