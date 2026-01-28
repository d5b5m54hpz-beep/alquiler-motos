import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const url = req.nextUrl;
  const pathname = url.pathname;
  const session = (req as any).auth;

  // CRITICAL: Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ["/login", "/login-admin", "/registro"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Rutas que requieren autenticación
  const protectedRoutes = [
    "/dashboard",
    "/clientes",
    "/contratos",
    "/motos",
    "/pagos",
    "/facturas",
    "/alertas",
    "/usuarios",
    "/perfil",
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si no hay sesión y es ruta protegida, redirigir según tipo de ruta
  if (!session && isProtectedRoute) {
    const adminRoutes = ["/dashboard", "/clientes", "/contratos", "/motos", "/pagos", "/facturas", "/alertas", "/usuarios"];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login-admin", url));
    }
    return NextResponse.redirect(new URL("/login", url));
  }

  // Proteger rutas de admin
  const adminRoutes = ["/dashboard", "/clientes", "/contratos", "/motos", "/pagos", "/facturas", "/alertas", "/usuarios"];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute) {
    const role = session?.user?.role;
    if (role !== "admin" && role !== "operador") {
      return NextResponse.redirect(new URL("/perfil", url));
    }
  }

  // Proteger rutas de cliente
  const clienteRoutes = ["/perfil"];
  const isClienteRoute = clienteRoutes.some(route => pathname.startsWith(route));

  if (isClienteRoute && session) {
    const role = session?.user?.role;
    if (role === "admin" || role === "operador") {
      return NextResponse.redirect(new URL("/dashboard", url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
