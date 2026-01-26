"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Item = {
  mes: string;
  total: number;
};

export default function ChartsMesPage() {
  const [data, setData] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/charts/ingresos-mes")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Ingresos mes a mes</h1>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
