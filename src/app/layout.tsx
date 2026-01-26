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
              background: "#fafafa",
            }}
          >
            <span style={{ fontWeight: 700 }}>Alquiler Motos</span>

            <a href="/">Dashboard</a>
            <a href="/clientes">Clientes</a>
            <a href="/motos">Motos</a>
            <a href="/contratos">Contratos</a>
            <a href="/pagos">Pagos</a>
            <a href="/facturas">Facturas</a>
            <a href="/alertas">Alertas</a>
            <a href="/usuarios">Usuarios</a>
            <a href="/dashboard/charts">Graficos</a>
            <a href="/dashboard/charts/mes">Mes a mes</a>
            <a href="/api/export/pagos">Export CSV</a>

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
