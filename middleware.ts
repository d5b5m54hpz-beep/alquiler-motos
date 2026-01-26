import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/login", req.url));
  }
});

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
