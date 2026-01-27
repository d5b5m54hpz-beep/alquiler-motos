import { NextResponse } from "next/server";

export default function middleware(req: Request & { cookies: any; nextUrl: URL }) {
  const url = (req as any).nextUrl as URL;
  const cookies = (req as any).cookies as { get: (name: string) => any };
  const hasSession =
    cookies?.get("__Secure-authjs.session-token") ||
    cookies?.get("authjs.session-token") ||
    cookies?.get("__Secure-next-auth.session-token") ||
    cookies?.get("next-auth.session-token");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/pagos/:path*",
    "/facturas/:path*",
    "/alertas/:path*",
    "/dashboard/:path*",
    "/usuarios/:path*",
  ],
};
