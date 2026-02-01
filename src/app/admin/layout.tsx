import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin - Alquiler Motos",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside style={{ width: 240, background: "#111827", color: "white", padding: 16 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Admin</h2>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Link href="/admin/dashboard" style={{ color: "#d1d5db" }}>
                Dashboard
              </Link>
              <Link href="/admin/motos" style={{ color: "#d1d5db" }}>
                Motos
              </Link>
              <Link href="/admin/contratos" style={{ color: "#d1d5db" }}>
                Contratos
              </Link>
              <Link href="/admin/facturas" style={{ color: "#d1d5db" }}>
                Facturas
              </Link>
              <Link href="/admin/pagos" style={{ color: "#d1d5db" }}>
                Pagos
              </Link>
              <Link href="/admin/clientes" style={{ color: "#d1d5db" }}>
                Clientes
              </Link>
              <Link href="/admin/usuarios" style={{ color: "#d1d5db" }}>
                Usuarios
              </Link>
            </nav>
          </aside>
          <main style={{ flex: 1, background: "#f3f4f6", padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
