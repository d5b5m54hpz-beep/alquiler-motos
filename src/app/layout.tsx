import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertDropdown } from "./components/AlertDropdown";
import { Providers } from "./providers";
import "@/cron";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alquiler Motos",
  description: "Gestión de alquileres de motos",
  manifest: "/manifest.json",
  themeColor: "#111827",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderBottom: "1px solid #e5e5e5",
              background: "#1f2937",
              color: "#fff",
            }}
          >
            <span style={{ fontWeight: 700, color: "#fff" }}>Alquiler Motos</span>

            <a href="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</a>
            <a href="/clientes" style={{ color: "#fff", textDecoration: "none" }}>Clientes</a>
            <a href="/motos" style={{ color: "#fff", textDecoration: "none" }}>Motos</a>
            <a href="/contratos" style={{ color: "#fff", textDecoration: "none" }}>Contratos</a>
            <a href="/pagos" style={{ color: "#fff", textDecoration: "none" }}>Pagos</a>
            <a href="/facturas" style={{ color: "#fff", textDecoration: "none" }}>Facturas</a>
            <a href="/alertas" style={{ color: "#fff", textDecoration: "none" }}>Alertas</a>
            <a href="/usuarios" style={{ color: "#fff", textDecoration: "none" }}>Usuarios</a>
            <a href="/dashboard/charts" style={{ color: "#fff", textDecoration: "none" }}>Graficos</a>
            <a href="/dashboard/charts/mes" style={{ color: "#fff", textDecoration: "none" }}>Mes a mes</a>
            <a href="/api/export/pagos" style={{ color: "#fff", textDecoration: "none" }}>Export CSV</a>

            <div style={{ marginLeft: "auto" }}>
              <AlertDropdown />
            </div>
          </nav>

          <main style={{ padding: 16 }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
