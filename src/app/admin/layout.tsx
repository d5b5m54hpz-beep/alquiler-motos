import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin - Alquiler Motos",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/pricing" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/admin/motos" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Motos
          </Link>
          <Link href="/admin/contratos" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Contratos
          </Link>
          <Link href="/admin/facturas" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Facturas
          </Link>
          <Link href="/admin/pagos" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Pagos
          </Link>
          <Link href="/admin/clientes" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Clientes
          </Link>
          <Link href="/admin/usuarios" className="block py-2 px-4 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors">
            Usuarios
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
