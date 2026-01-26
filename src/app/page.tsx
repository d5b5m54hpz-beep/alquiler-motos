"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type DashboardData = {
  totalCobrado: number;
  pagosPendientes: number;
  pagosVencidos: number;
  facturasEmitidas: number;
  alertasNoLeidas: number;
};

type ChartData = {
  ingresos: { fecha: string; total: number }[];
  estados: { estado: string; cantidad: number }[];
};

export default function DashboardPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<DashboardData | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard?days=${days}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);

    fetch(`/api/dashboard/charts?days=${days}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setCharts);
  }, [days]);

  if (!data || !charts) return <p>Cargando dashboard…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* Filtros */}
      <div style={{ marginTop: 12 }}>
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #ccc",
              background: days === d ? "#2563eb" : "#fff",
              color: days === d ? "#fff" : "#000",
              cursor: "pointer",
            }}
          >
            Últimos {d} días
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        <Card title="💰 Total cobrado" value={`$${data.totalCobrado}`} />
        <Card title="⏳ Pagos pendientes" value={data.pagosPendientes} />
        <Card title="🔴 Pagos vencidos" value={data.pagosVencidos} />
        <Card title="📄 Facturas emitidas" value={data.facturasEmitidas} />
        <Card title="🔔 Alertas no leídas" value={data.alertasNoLeidas} />
      </div>

      {/* Gráficos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginTop: 40,
        }}
      >
        <div style={{ height: 300 }}>
          <h3>Ingresos por día</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.ingresos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 300 }}>
          <h3>Pagos por estado</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.estados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="estado" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        background: "white",
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}
