"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Item = {
  name: string;
  total: number;
};

export default function ChartsPage() {
  const [clientes, setClientes] = useState<Item[]>([]);
  const [motos, setMotos] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/charts/ingresos")
      .then((r) => r.json())
      .then((data) => {
        setClientes(data.clientes);
        setMotos(data.motos);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Ingresos</h1>

      <h2>Por cliente</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={clientes}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Por moto</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={motos}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
