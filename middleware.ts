import { auth } from "@/auth";

export default auth((req) => {
  // Middleware will automatically redirect to /login if not authenticated
  // because NextAuth v5 handles this internally
});

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/clientes/:path*",
    "/motos/:path*",
    "/contratos/:path*",
    "/pagos/:path*",
    "/facturas/:path*",
    "/alertas/:path*",
  ],
};
