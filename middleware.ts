export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pagos/:path*",
    "/facturas/:path*",
    "/alertas/:path*",
  ],
};
