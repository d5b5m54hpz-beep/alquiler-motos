"use client";

import { useEffect, useState } from "react";

type KPIs = {
  totalMotos: number;
  totalContratos: number;
  totalClientes: number;
  pagosPendientes: number;
  alertasNoLeidas: number;
};

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => setKpis(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      {!kpis && <p>Cargando...</p>}

      {kpis && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <strong>Motos</strong>
            <div style={{ fontSize: 24 }}>{kpis.totalMotos}</div>
          </div>

          <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <strong>Contratos</strong>
            <div style={{ fontSize: 24 }}>{kpis.totalContratos}</div>
          </div>

          <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <strong>Clientes</strong>
            <div style={{ fontSize: 24 }}>{kpis.totalClientes}</div>
          </div>

          <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <strong>Pagos pendientes</strong>
            <div style={{ fontSize: 24 }}>{kpis.pagosPendientes}</div>
          </div>

          <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <strong>Alertas no leídas</strong>
            <div style={{ fontSize: 24 }}>{kpis.alertasNoLeidas}</div>
          </div>
        </div>
      )}
    </div>
  );
}
