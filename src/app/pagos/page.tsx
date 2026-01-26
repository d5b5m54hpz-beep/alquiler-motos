"use client";

import { useEffect, useState } from "react";

type Pago = {
  id: string;
  monto: number;
  metodo: string;
  estado: string;
  createdAt: string;
};

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pagos")
      .then((r) => r.json())
      .then((data) => {
        setPagos(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando pagos...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Pagos</h1>
      <p>Registrar y ver pagos de contratos</p>

      {pagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Monto</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td>{p.monto}</td>
                <td>{p.metodo}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
